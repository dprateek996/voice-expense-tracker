//
// ----- Start of Corrected server/src/services/gemini.service.js -----
//
const safeJSONParse = (s) => {
  try { return JSON.parse(s); } catch (e) { return null; }
};

// ---------- Gemini client (optional) ----------
let model = null;
try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const API_KEY = process.env.GEMINI_API_KEY;
  // --- FIX 3: Using the correct, stable model name ---
  const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";// allow override
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
  s = s.replace(/\bhotstar\b/ig, "hotstar");
  s = s.replace(/\bprime video\b/ig, "prime");
  s = s.replace(/\bspotify\b/ig, "spotify");
  return s;
}

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
    }
  }
  const result = total + current;
  return found ? result : null;
}

function extractAmounts(raw) {
  const t = String(raw);
  const amounts = [];
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
  const digitRx = /(\d+(?:\.\d+)?)/g;
  let m;
  while ((m = digitRx.exec(t)) !== null) {
    const v = Number(m[1]);
    if (!Number.isNaN(v)) amounts.push({value: v, raw: m[0], index: m.index});
  }
  const wordNumPattern = /\b((?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|and|-)\s?){1,8}\b/ig;
  let wm;
  while ((wm = wordNumPattern.exec(t)) !== null) {
    const text = wm[0].trim();
    const val = wordsToNumber(text);
    if (val != null) amounts.push({value: val, raw: text, index: wm.index});
  }
  amounts.sort((a,b)=> a.index - b.index);
  return amounts.map(a => a.value);
}

function cleanDescription(raw, amountMatches=[]) {
  let s = String(raw);
  amountMatches.forEach(token => {
    s = s.replace(token, " ");
  });
  s = s.replace(/\b(for|paid|to|₹|rs\.?|rupees?|inr|on|at|from)\b/ig, " ");
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/^[^\w]+|[^\w]+$/g, "");
  if (!s) return "Expense";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function detectLocation(text) {
  const t = text.toLowerCase();
  const locRx = /\b(?:to|at|from)\s+((?:the\s+)?[a-z0-9&\-\s]{2,40})/i;
  const m = t.match(locRx);
  if (m && m[1]) {
    const candidate = m[1].trim();
    return candidate.replace(/\b(for|rupees|rs|₹|paid)\b/ig, '').trim();
  }
  return null;
}

function detectPaidTo(text) {
  const t = text.toLowerCase();
  let m = t.match(/\b(?:paid|sent|transfer|gave|gave to|paid to|paid\s+via|transferred)\b\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)?\s*(?:to\s+)?([a-z0-9\.\-_\s]{2,40})/i);
  if (m && m[2]) {
    const person = m[2].trim().replace(/\s+(?:for|rupees|rs)\b/ig, '').trim();
    return person ? person : null;
  }
  m = t.match(/\b(?:paid|sent|gave)\s+([a-z0-9\-\s]{2,20})\s*(?:₹|rs|rupees)?\s*(\d+)?/i);
  if (m && m[1]) {
    return m[1].trim();
  }
  return null;
}

function containsAny(text, list) {
  const t = text.toLowerCase();
  return list.some(k => t.includes(k));
}

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
  Other: ["gift","gift to","donation","charity","transfer","paid to","paid"]
};

const CATEGORY_PRIORITY = ["Dining","Groceries","Entertainment","Transport","Utilities","Education","PersonalCare","Health","Shopping","Fuel","Work","Other"];

// ---------- fallback parser (very robust) ----------
// --- FIX 1: The entire function is now correctly structured ---
function fallbackParse(transcript) {
  const raw = typeof transcript === "string" ? transcript : String(transcript || "");
  const normalized = normalizeText(raw);
  const amounts = extractAmounts(normalized);
  let amount = null;
  if (amounts.length > 0) {
    amount = Math.max(...amounts.filter(n => Number.isFinite(n) && n > 0));
  }
  if (amount == null) {
    const wnum = wordsToNumber(normalized);
    if (wnum != null && wnum > 0) amount = wnum;
  }
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

  // --- FIX 2: Added backticks (`) for template literals ---
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

  const paidToPerson = detectPaidTo(normalized);
  if (paidToPerson) {
    // --- FIX 2: Added backticks (`) for template literals ---
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

  const loc = detectLocation(normalized);
  const tokensToRemove = [];
  ["₹","rs","rupees","inr"].forEach(tok => { if (normalized.includes(tok)) tokensToRemove.push(tok); });
  const numMatches = normalized.match(/(\d+(?:\.\d+)?)/g) || [];
  numMatches.forEach(nm => tokensToRemove.push(nm));

  const description = cleanDescription(raw, tokensToRemove);

  const textLower = normalized.toLowerCase();
  let category = "Other";
  for (const key of CATEGORY_PRIORITY) {
    const listName = key === "PersonalCare" ? "PersonalCare" : key;
    const keywords = CATEGORY_KEYWORDS[listName] || CATEGORY_KEYWORDS[key];
    if (!keywords) continue;
    if (containsAny(textLower, keywords)) {
      if (key === "PersonalCare") category = "Personal Care";
      else category = key === "Other" ? "Other" : key;
      break;
    }
  }

  const otts = ["netflix","prime","hotstar","spotify","youtube premium","disney+","zee5","sony liv","gaana","jio cinema"];
  if (containsAny(textLower, otts)) category = "Entertainment";
  if (/\b(print|xerox|photocopy|printout|2rs|2 rs)\b/i.test(textLower)) {
    category = "Education";
  }
  
  const location = loc || null;

  return {
    amount,
    category,
    description,
    location,
    date: null,
    is_unclear: false
  };
} // --- IMPORTANT: This is the correct end of the fallbackParse function ---

// ---------------- Primary parse function ----------------
async function parseExpense(transcript) {
  const text = String(transcript || "");
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
Now parse exactly: "${text.replace(/"/g, '\\"')}"
`;
      const res = await model.generateContent(prompt);
      let raw;
      try {
        raw = (res?.response?.text && typeof res.response.text === "function") ? await res.response.text() : (res?.response || res?.text || JSON.stringify(res));
      } catch (e) {
        raw = res;
      }
      const parsed = safeJSONParse(typeof raw === "string" ? raw.trim() : raw);
      if (parsed && parsed.amount != null && !parsed.is_unclear) {
        const allowed = ["Groceries","Dining","Transport","Shopping","Utilities","Health","Entertainment","Travel","Education","Work","Personal Care","Fuel","Other"];
        if (!allowed.includes(parsed.category)) {
          const fb = fallbackParse(text);
          fb.description = parsed.description || fb.description;
          return fb;
        }
        return parsed;
      }
      return fallbackParse(text);
    } catch (err) {
      console.warn("Gemini call failed or returned unexpected output. Falling back. Error:", err?.message || err);
      return fallbackParse(text);
    }
  } else {
    return fallbackParse(text);
  }
}

module.exports = { parseExpense };

//
// ----- End of Corrected server/src/services/gemini.service.js -----
//