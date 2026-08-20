const { test } = require('@playwright/test');

const scenes = [
  ['hand', async page => {
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1500);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.press('Space');
    await page.waitForTimeout(450);
    await page.keyboard.down('KeyF');
    await page.waitForTimeout(3400);
    await page.keyboard.up('KeyF');
    await page.waitForTimeout(250);
  }],
  ['tea', async page => {
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1500);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
    await page.keyboard.down('Space');
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(3600);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.up('Space');
  }],
  ['key', async page => {
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1450);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(2600);
  }],
  ['goat', async page => {
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1700);
    await page.keyboard.up('ArrowRight');
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(450);
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(4000);
    await page.keyboard.up('ArrowRight');
  }],
  ['house', async page => {
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(3700);
    await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(400);
    await page.keyboard.press('KeyE');
    await page.waitForTimeout(2200);
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
