
const safeJSONParse = (s) => {
  try { return JSON.parse(s); } catch (e) { return null; }
};

// ---------- Gemini client (optional) ----------
let model = null;
try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5"; // allow override
  if (API_KEY) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Wrap in try because older packages or mismatched versions may throw.
    try {
      model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: { responseMimeType: "application/json" },
      });
    } catch (e) {
      console.warn("Gemini init failed:", e?.message || e);
      model = null;
    }
  } else {
    console.warn("GEMINI_API_KEY not set — using local fallback parser only.");
  }
} catch (e) {
  // dependency not present
  model = null;
  // console.warn("No @google/generative-ai installed — using local fallback parser.");
}

// ----------------- Helpers -----------------

// normalize transcription: lowercase, normalize spaces and common speech errors
function normalizeText(raw) {
  if (!raw) return "";
  let s = raw.trim();
  s = s.replace(/\s+/g, " "); // collapse whitespace
  // common speech errors to correct quickly
  s = s.replace(/\bhotstar\b/ig, "hotstar");
  s = s.replace(/\bprime video\b/ig, "prime");
  s = s.replace(/\bspotify\b/ig, "spotify");
  // sometimes STT adds repeated digits like 2004 for 200: try to fix patterns like (\d{3})4 or \d{3}4 meaning extra 4
  // but careful: only handle obvious 4 appended error like 2004 -> 2004 could be valid; we will later prefer largest number logic
  return s;
}

// map some common word-number phrases to numbers (supports up to thousands; extendable)
const SMALL_NUMBER_WORDS = {
  zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10,
  eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18, nineteen:19,
  twenty:20, thirty:30, forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90,
  hundred:100, thousand:1000
};

function wordsToNumber(s) {
  if (!s) return null;
  s = s.toLowerCase().replace(/[^a-z\s-]/g, " ");
  const parts = s.split(/[\s-]+/).filter(Boolean);
  let total = 0;
  let current = 0;
  let found = false;
  for (const p of parts) {
    if (p === "and") continue;
    if (SMALL_NUMBER_WORDS[p] != null) {
      found = true;
      const val = SMALL_NUMBER_WORDS[p];
      if (val === 100) {
        if (current === 0) current = 1;
        current = current * 100;
      } else if (val === 1000) {
        if (current === 0) current = 1;
        current = current * 1000;
        total += current;
        current = 0;
      } else {
        current += val;
      }
    } else {
      // not a number word
      // break or continue - we continue to allow "two hundred rupees"
    }
  }
  const result = total + current;
  return found ? result : null;
}

// extract amount attempts:
// 1) currency + number (₹, rs, rupees)
// 2) any digits (handles decimals)
// 3) spelled-out number words (twenty five, one hundred)
function extractAmounts(raw) {
  const t = String(raw);
  const amounts = [];
  // currency-style: ₹500, 500rs, 500 rs, 500 rupees
  const currencyRegexes = [
    /(?:₹|Rs\.?|rs\.?|\brupees?\b)\s*?(\d+(?:\.\d+)?)/ig,
    /(\d+(?:\.\d+)?)\s*(?:₹|Rs\.?|rs\.?|\brupees?\b)/ig
  ];
  for (const rx of currencyRegexes) {
    let m;
    while ((m = rx.exec(t)) !== null) {
      const v = Number(m[1]);
      if (!Number.isNaN(v)) amounts.push({value: v, raw: m[0], index: m.index});
    }
  }
  // numeric digits anywhere
  const digitRx = /(\d+(?:\.\d+)?)/g;
  let m;
  while ((m = digitRx.exec(t)) !== null) {
    const v = Number(m[1]);
    if (!Number.isNaN(v)) amounts.push({value: v, raw: m[0], index: m.index});
  }
  // number words
  // look for sequences up to ~6 words of number words
  const wordNumPattern = /\b((?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|and|-)\s?){1,8}\b/ig;
  let wm;
  while ((wm = wordNumPattern.exec(t)) !== null) {
    const text = wm[0].trim();
    const val = wordsToNumber(text);
    if (val != null) amounts.push({value: val, raw: text, index: wm.index});
  }
  // return unique amounts by index
  // sort by index to keep ordering
  amounts.sort((a,b)=> a.index - b.index);
  return amounts.map(a => a.value);
}

// clean up description from transcript after removing number tokens and connectors
function cleanDescription(raw, amountMatches=[]) {
  let s = String(raw);
  // remove currency tokens and numbers seen in amountMatches
  amountMatches.forEach(token => {
    s = s.replace(token, " ");
  });
  // remove common connectors
  s = s.replace(/\b(for|paid|to|₹|rs\.?|rupees?|inr|on|at|from)\b/ig, " ");
  s = s.replace(/\s+/g, " ").trim();
  // try to fix leading/trailing punctuation
  s = s.replace(/^[^\w]+|[^\w]+$/g, "");
  if (!s) return "Expense";
  // Capitalize first letter
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// attempt to extract location phrases like "to the airport", "at dominos", "from zomato"
function detectLocation(text) {
  const t = text.toLowerCase();
  const locRx = /\b(?:to|at|from)\s+((?:the\s+)?[a-z0-9&\-\s]{2,40})/i;
  const m = t.match(locRx);
  if (m && m[1]) {
    const candidate = m[1].trim();
    // remove trailing words like 'for', 'rupees' etc
    return candidate.replace(/\b(for|rupees|rs|₹|paid)\b/ig, '').trim();
  }
  return null;
}

// improved "paid to" extraction for person
function detectPaidTo(text) {
  const t = text.toLowerCase();
  // patterns: "paid 200 to manav", "sent 100 to manav", "paid manav 200"
  let m = t.match(/\b(?:paid|sent|transfer|gave|gave to|paid to|paid\s+via|transferred)\b\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)?\s*(?:to\s+)?([a-z0-9\.\-_\s]{2,40})/i);
  if (m && m[2]) {
    const person = m[2].trim().replace(/\s+(?:for|rupees|rs)\b/ig, '').trim();
    return person ? person : null;
  }
  // fallback: "paid manav 200"
  m = t.match(/\b(?:paid|sent|gave)\s+([a-z0-9\-\s]{2,20})\s*(?:₹|rs|rupees)?\s*(\d+)?/i);
  if (m && m[1]) {
    return m[1].trim();
  }
  return null;
}

// fuzzy keyword detection via normalization (basic) - returns true if any keyword in array is substring of text
function containsAny(text, list) {
  const t = text.toLowerCase();
  return list.some(k => t.includes(k));
}

// improved category detection lists (student-friendly + common services)
const CATEGORY_KEYWORDS = {
  Dining: ["momos","momo","samosa","shawarma","burger","pizza","fries","chai","tea","coffee","cold coffee","cola","pepsi","zomato","swiggy","canteen","mess","restaurant","dinner","lunch","breakfast","snack","snacks","shawarma","maggie","noodle","noodles","roll","paratha","roti","thali"],
  Groceries: ["milk","bread","butter","rice","dal","vegetable","vegetables","grocery","groceries","atta","flour","oil","sugar","salt","eggs","fruit","fruits","vegetables","onion","potato","tomato","banana","apple"],
  Entertainment: ["netflix","prime","hotstar","spotify","spotify","spotify","youtube premium","zomato","ott","movies","movie","ticket","cinema","concert","tinder","gaana","apple music","crunchyroll","gaming","pubg","bgmi","steam","battle pass"],
  Transport: ["uber","ola","cab","taxi","bus","auto","rickshaw","metro","train","uber eats","uberxl","ola cabs","petrol","diesel","fuel","petrol pump","airport"],
  Utilities: ["electricity","water bill","wifi","broadband","internet","gas","recharge","postpaid","prepaid","mobile bill","phone bill","jio recharge","airtel recharge","vi recharge","bill","dues"],
  Education: ["tuition","coaching","course","udemy","coursera","byjus","unacademy","exam fee","exam fees","semester","college","college fees","library","study","books","books store","notebook","stationery","print","xerox","printing","printer","assignment","tuition"],
  PersonalCare: ["haircut","salon","spa","shampoo","soap","deodorant","cream","barber","shave","trim","facial"],
  Health: ["doctor","clinic","hospital","pharmacy","medicine","tablet","covid","checkup","diagnostic","lab","chemist"],
  Shopping: ["amazon","flipkart","myntra","shirt","tshirt","jeans","shoe","shoes","bag","wallet","mobile cover","charger","earphones","headphones","clothes","shopping"],
  Fuel: ["petrol","diesel","gas station", "pump"],
  Work: ["salary","payroll","office","client","freelance","project"],
  Other: ["gift","gift to","donation","charity","transfer","paid to","paid"] // fallback group
};

// priority order for detection
const CATEGORY_PRIORITY = ["Dining","Groceries","Entertainment","Transport","Utilities","Education","PersonalCare","Health","Shopping","Fuel","Work","Other"];

// ---------- fallback parser (very robust) ----------
function fallbackParse(transcript) {
  const raw = typeof transcript === "string" ? transcript : String(transcript || "");
  const normalized = normalizeText(raw);
  const amounts = extractAmounts(normalized); // array of numbers
  // If multiple numbers choose the largest reasonable one (people often speak small quantities + price)
  let amount = null;
  if (amounts.length > 0) {
    // prefer largest positive number > 0, unless there's clear context (like "2 eggs 200 rupees" -> 200)
    amount = Math.max(...amounts.filter(n => Number.isFinite(n) && n > 0));
  }
  // If amount still null, try wordsToNumber on entire text
  if (amount == null) {
    const wnum = wordsToNumber(normalized);
    if (wnum != null && wnum > 0) amount = wnum;
  }
  // if still null -> unclear
  if (!amount) {
    return {
      amount: null,
      category: "Other",
      description: normalizeText(raw).trim() || "Expense",
      location: null,
      date: null,
      is_unclear: true
    };
  }

  // Attempt to find raw tokens that look like amount tokens for description cleaning
  const amountTokenPatterns = [
    new RegExp(`₹\\s*${amount}`, "i"),
    new RegExp(`${amount}\\s*(?:rs\\.?|rupees?)`, "i"),
    new RegExp(`${amount}`, "i")
  ];
  const amountTokensFound = [];
  amountTokenPatterns.forEach(rx => {
    const m = raw.match(rx);
    if (m) amountTokensFound.push(m[0]);
  });

  // find paid-to person
  const paidToPerson = detectPaidTo(normalized);
  if (paidToPerson) {
    const cleanedDesc = `Paid to ${paidToPerson}`.trim();
    return {
      amount,
      category: "Other",
      description: cleanedDesc,
      location: null,
      date: null,
      is_unclear: false
    };
  }

  // detect location and clean description
  const loc = detectLocation(normalized);
  // remove any obvious tokens: numbers and currency words
  // capture tokens from extractAmounts for removal - use a looser approach
  const tokensToRemove = [];
  // add currency words present
  ["₹","rs","rupees","inr"].forEach(tok => { if (normalized.includes(tok)) tokensToRemove.push(tok); });
  // numeric tokens
  const numMatches = normalized.match(/(\d+(?:\.\d+)?)/g) || [];
  numMatches.forEach(nm => tokensToRemove.push(nm));
  // also push ordinal words maybe captured - ignore

  const description = cleanDescription(raw, tokensToRemove);

  // category detection
  const textLower = normalized.toLowerCase();

  let category = "Other";
  for (const key of CATEGORY_PRIORITY) {
    const listName = key === "PersonalCare" ? "PersonalCare" : key;
    const keywords = CATEGORY_KEYWORDS[listName] || CATEGORY_KEYWORDS[key];
    if (!keywords) continue;
    if (containsAny(textLower, keywords)) {
      // Map "PersonalCare" to "Personal Care" for final label
      if (key === "PersonalCare") category = "Personal Care";
      else category = key === "Other" ? "Other" : key;
      break;
    }
  }

  // a final sanity fix: if description contains specific OTT/service names, ensure Entertainment
  const otts = ["netflix","prime","hotstar","spotify","youtube premium","disney+","zee5","sony liv","gaana","jio cinema"];
  if (containsAny(textLower, otts)) category = "Entertainment";

  // some heuristic: if description contains 'print' 'xerox' -> Education or Other (printer) but keep Education
  if (/\b(print|xerox|photocopy|printout|2rs|2 rs)\b/i.test(textLower)) {
    category = "Education";
  }

  // small amounts < 10 might be food/snacks; keep category inference
  // Location assign if found
  const location = loc || null;

  return {
    amount,
    category,
    description,
    location,
    date: null,
    is_unclear: false
  };
}

// ---------------- Primary parse function ----------------
async function parseExpense(transcript) {
  const text = String(transcript || "");
  // quick guard
  if (!text || !text.trim()) {
    return {
      amount: null,
      category: "Other",
      description: "",
      location: null,
      date: null,
      is_unclear: true
    };
  }

  // If model available, try LLM parsing first; if it fails or returns unclear, fallback to robust local parser.
  if (model) {
    try {
      const prompt = `
You are a precise financial parser. Input is a short user command like "500 for pizza" or "paid 200 to manav" or "1500 jio postpaid bill".
Return EXACTLY a JSON object (no extra text) with shape:
{
  "amount": number | null,
  "category": string,
  "description": string,
  "location": string | null,
  "date": string | null,
  "is_unclear": boolean
}
Rules:
1) Always try to extract a numeric amount (₹, rs, rupees, digits, or number words).
2) Category must be one of: Groceries, Dining, Transport, Shopping, Utilities, Health, Entertainment, Travel, Education, Work, Personal Care, Fuel, Other.
3) If user says "paid X to Y" treat as a transfer: category = "Other", description = "Paid to Y".
4) If unclear or missing amount, set is_unclear = true and amount = null.
5) Do not output any commentary - only return the JSON.
6) If the transcription looks like speech with mistakes (e.g., "2004 burger"), correct it before parsing.
7) Examples (for your internal use):
  - "momos 150" -> Dining
  - "netflix 550" -> Entertainment
  - "1500 jio postpaid bill" -> Utilities
  - "25rs milk" -> Groceries
  - "200 haircut" -> Personal Care
  - "paid 200 to manav" -> Other
Now parse exactly: "${text.replace(/"/g, '\\"')}"
`;
      const res = await model.generateContent(prompt);
      // Some model versions return response.text() or response object, so be defensive
      let raw;
      try {
        raw = (res?.response?.text && typeof res.response.text === "function") ? await res.response.text() : (res?.response || res?.text || JSON.stringify(res));
      } catch (e) {
        raw = res;
      }
      const parsed = safeJSONParse(typeof raw === "string" ? raw.trim() : raw);
      if (parsed && parsed.amount != null && !parsed.is_unclear) {
        // ensure category is in allowed list
        const allowed = ["Groceries","Dining","Transport","Shopping","Utilities","Health","Entertainment","Travel","Education","Work","Personal Care","Fuel","Other"];
        if (!allowed.includes(parsed.category)) {
          // try to normalize a close category -> use fallback detection to enforce valid category
          const fb = fallbackParse(text);
          fb.description = parsed.description || fb.description;
          return fb;
        }
        return parsed;
      }
      // If model returned unclear parse or missing amount, fall back
      return fallbackParse(text);
    } catch (err) {
      // LLM call failed or timed out - fallback
      console.warn("Gemini call failed or returned unexpected output. Falling back. Error:", err?.message || err);
      return fallbackParse(text);
    }
  } else {
    // No model configured - use fallback
    return fallbackParse(text);
  }
}

// Export single function parseExpense
module.exports = { parseExpense };