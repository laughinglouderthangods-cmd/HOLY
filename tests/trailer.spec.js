const { test } = require('@playwright/test');

const scenes = [
  ['hand', async page => {
    await page.waitForTimeout(800);
    await page.keyboard.down('KeyF');
    await page.waitForTimeout(4300);
    await page.keyboard.up('KeyF');
    await page.waitForTimeout(500);
  }],
  ['tea', async page => {
    await page.waitForTimeout(800);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(800);
    await page.keyboard.down('Space');
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(4200);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.up('Space');
  }],
  ['key', async page => {
    await page.waitForTimeout(800);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(4200);
  }],
  ['goat', async page => {
    await page.waitForTimeout(800);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(800);
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(4800);
    await page.keyboard.up('ArrowRight');
  }],
  ['house', async page => {
    await page.waitForTimeout(800);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(6000);
  }],
];

for (const [name, action] of scenes) {
  test(name, async ({ page }) => {
    await page.goto(`http://127.0.0.1:4173/?trailer=${name}`);
    await page.addStyleTag({ content: `
      html,body{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;background:#000!important}
      body{display:flex!important;align-items:center!important;justify-content:center!important}
      #game{display:block!important;width:960px!important;height:720px!important;max-width:none!important;max-height:none!important;image-rendering:pixelated!important}
      #mobileControls,#vault{display:none!important}
    `});
    await page.click('#btnContinue');
    await action(page);
    await page.screenshot({ path: `screenshots/${name}.png` });
  });
}
