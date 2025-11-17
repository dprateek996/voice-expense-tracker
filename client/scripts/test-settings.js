import puppeteer from 'puppeteer';

(async () => {
  const url = process.argv[2] || 'http://localhost:5173/test-settings';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push({type: msg.type(), text: msg.text()}));
  page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.message }));

  try {
    const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    console.log('HTTP status:', res.status());
    const title = await page.$eval('h1', el => el.innerText).catch(() => null);
    console.log('Found H1:', title);

    // Read current budget value
    const budgetSelector = 'p.text-2xl.font-bold.text-amber-400';
    const origBudgetText = await page.$eval(budgetSelector, el => el.innerText).catch(() => null);
    console.log('Original budget text:', origBudgetText);

    // Click debug Sync button to ensure states are in sync
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Sync');
      if (btn) btn.click();
    });

    // Click Update Budget button
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Update Budget'));
      if (btn) btn.click();
    });

    await page.waitForSelector('input#budget');
    // Clear the input completely and type the new value
    await page.evaluate(() => {
      const input = document.querySelector('#budget');
      if (input) {
        input.value = '';
        input.focus();
      }
    });
    await page.keyboard.type('2000');

    const inputVal = await page.$eval('#budget', el => el.value).catch(() => null);
    console.log('Budget input value after change:', inputVal);

    // Click the 'Save' button inside the Debug panel explicitly
    const foundDebugSave = await page.evaluate(() => {
      const debugDiv = Array.from(document.querySelectorAll('div')).find(d => d && d.innerText && d.innerText.includes('Debug'));
      if (!debugDiv) return false;
      const btn = Array.from(debugDiv.querySelectorAll('button')).find(b => b.innerText.trim() === 'Save');
      if (btn) { btn.click(); return true; }
      return false;
    });
    console.log('Clicked Debug Save button success:', foundDebugSave);

    // Wait a bit for UI to update
    await new Promise((r) => setTimeout(r, 600));
    const newBudgetText = await page.$eval(budgetSelector, el => el.innerText).catch(() => null);
    console.log('Updated budget text:', newBudgetText);

    console.log('Collected logs:');
    console.log(JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Error while loading page:', err);
  } finally {
    await browser.close();
  }
})();
