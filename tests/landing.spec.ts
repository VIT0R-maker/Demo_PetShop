import { expect, test, type Page } from '@playwright/test';

async function openPage(page: Page, width = 1440) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}

for (const width of [1440, 1024, 768, 390, 360]) {
  test(`responsive layout and assets at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await openPage(page, width);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('article.service-card')).toHaveCount(6);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

    // Visit each section so the browser requests the lazily loaded photographs.
    for (const section of ['#servicos', '#sobre', '#espaco', '#contato', '.footer']) {
      await page.locator(section).scrollIntoViewIfNeeded();
    }
    await expect.poll(() => page.locator('img').evaluateAll(images =>
      images.every(image => image.complete && image.naturalWidth > 0),
    )).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `artifacts/screenshots/casa-pet-${width}.png`, fullPage: true });
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `artifacts/screenshots/casa-pet-${width}-viewport.png` });
    }
  });
}

test('section links and service cards guide the visitor to the right interest', async ({ page }) => {
  await openPage(page);
  await page.getByRole('navigation', { name: 'Navegação principal', exact: true }).getByRole('link', { name: 'Sobre', exact: true }).click();
  await expect(page).toHaveURL(/#sobre$/);
  for (const [label, value] of [['Consultar banho', 'banho'], ['Consultar produtos', 'produtos']]) {
    await page.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(/#contato$/);
    await expect(page.getByLabel('Serviço de interesse')).toHaveValue(value);
    await expect(page.getByLabel('Serviço de interesse')).toBeFocused();
  }
});

test('contact validates inline and never opens an unconfigured WhatsApp number', async ({ page, context }) => {
  await openPage(page, 390);
  await page.getByRole('button', { name: 'Continuar no WhatsApp' }).click();
  await expect(page.getByText('Informe o nome do tutor.')).toBeVisible();
  await expect(page.getByText('Selecione cão ou gato.')).toBeVisible();
  await expect(page.getByText('Selecione um interesse para continuar.')).toBeVisible();
  await expect(page.getByLabel('Nome do tutor')).toBeFocused();
  await page.getByLabel('Nome do tutor').fill('Maria');
  await page.getByLabel('Nome do pet').fill('Bento');
  await page.getByLabel('Espécie').selectOption('cao');
  await page.getByLabel('Serviço de interesse').selectOption('banho');
  await page.getByRole('button', { name: 'Continuar no WhatsApp' }).click();
  await expect(page.getByRole('status')).toHaveText('O canal de atendimento será disponibilizado em breve. Nenhuma mensagem foi enviada.');
  expect(context.pages()).toHaveLength(1);
  await expect(page.getByRole('heading', { name: 'Localização em breve' })).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
});

test('mobile menu closes on Escape, restores focus, and navigates', async ({ page }) => {
  await openPage(page, 390);
  const trigger = page.getByRole('button', { name: 'Abrir menu' });
  await trigger.click();
  const menu = page.getByRole('dialog', { name: 'Menu principal', exact: true });
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const close = page.getByRole('button', { name: 'Fechar menu' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(menu.getByRole('link', { name: 'Agendar atendimento' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await trigger.click();
  await menu.getByRole('link', { name: 'Serviços', exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/#servicos$/);
});

test('gallery traps keyboard focus, closes with Escape, and restores the trigger', async ({ page }) => {
  await openPage(page, 390);
  const trigger = page.getByRole('button', { name: 'Ampliar imagem: Cada pet tem seu jeito' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Fotografia do nosso espaço' });
  const close = dialog.getByRole('button', { name: 'Fechar imagem' });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await expect(page.locator('.mobile-booking')).not.toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('compact booking bar follows hero, contact, and menu visibility', async ({ page }) => {
  await openPage(page, 390);
  await expect(page.locator('.mobile-booking')).not.toBeVisible();
  await page.locator('#servicos').scrollIntoViewIfNeeded();
  await expect(page.locator('.mobile-booking')).toBeVisible();
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.locator('.mobile-booking')).not.toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mobile-booking')).toBeVisible();
  await page.locator('.contact-form-panel').scrollIntoViewIfNeeded();
  await expect(page.locator('.mobile-booking')).not.toBeVisible();
});

test('reduced-motion preference removes entrances and smooth scrolling', async ({ page }) => {
  await openPage(page, 390);
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  const motion = await page.locator('.hero-enter').first().evaluate(element => {
    const style = getComputedStyle(element);
    return { animation: style.animationDuration, transform: style.transform, scroll: getComputedStyle(document.documentElement).scrollBehavior };
  });
  expect(parseFloat(motion.animation)).toBeLessThanOrEqual(0.001);
  expect(motion.transform).toBe('none');
  expect(motion.scroll).toBe('auto');
  await expect(page.locator('.will-reveal')).toHaveCount(0);
});

test('normal motion reveals content once without delaying the hero photograph', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPage(page);
  const photo = page.locator('.hero-photo img');
  await expect(photo).toHaveAttribute('fetchpriority', 'high');
  expect(await photo.getAttribute('loading')).not.toBe('lazy');
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(photo).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.hero-enter').first()).toHaveCSS('opacity', '1');
  const card = page.locator('.service-card').first();
  await expect(card).toHaveClass(/will-reveal/);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-visible/);
  await expect(card).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(card).toHaveClass(/is-visible/);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS('opacity', '1');
});
