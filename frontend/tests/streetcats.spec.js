import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173';

test.describe('StreetCats E2E ', () => {

  test.beforeEach(async ({ page }) => {
   
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
  });

  // TEST 1: CARICAMENTO PAGINA
  test('1. L’header mostra correttamente il titolo STREETCATS', async ({ page }) => {
    await expect(page.locator('.logo')).toContainText('STREETCATS');
  });

  // TEST 2: MAPPA
  test('2. La mappa Leaflet è inizializzata e visibile', async ({ page }) => {
    await expect(page.locator('#map-display')).toBeVisible();
  });

  // TEST 3: MESSAGGIO GUEST
  test('3. Un utente non loggato vede il messaggio della mappa', async ({ page }) => {
    await expect(page.locator('.guest-msg')).toBeVisible();
  });

  //  TEST 4: FORM LOGIN
  test('4. I campi email e password sono pronti per l’input', async ({ page }) => {
    await expect(page.locator('input[placeholder="Tua Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
  });

  // TEST 5: PRESENZA MARKER
  test('5. Verifica che esistano marker sulla mappa', async ({ page }) => {
    const marker = page.locator('.custom-arrow-marker').first();
    // Aspettiamo fino a 10 secondi che i dati arrivino da Supabase
    await expect(marker).toBeVisible({ timeout: 10000 });
  });

 // TEST 6: APERTURA POPUP
  test('6. Il click sul marker apre il popup informativo', async ({ page }) => {
    const marker = page.locator('.custom-arrow-marker').first();
    await marker.waitFor({ state: 'visible', timeout: 10000 });
    
  
    await marker.dispatchEvent('click');
    
    const popup = page.locator('.leaflet-popup-content');
    await expect(popup).toBeVisible({ timeout: 10000 });
  });

  // TEST 7: DETTAGLI GATTO
  test('7. Il tasto Vedi Dettagli apre l’overlay a tutto schermo', async ({ page }) => {
    const marker = page.locator('.custom-arrow-marker').first();
    await marker.waitFor({ state: 'visible' });
    
  
    await marker.dispatchEvent('click');

    
    const btnDettagli = page.locator('button:has-text("Vedi Dettagli")');
    await btnDettagli.waitFor({ state: 'attached', timeout: 5000 });
    
    await btnDettagli.dispatchEvent('click');
    
    await expect(page.locator('.cat-detail-overlay')).toBeVisible({ timeout: 10000 });
  });

  // TEST 8: CHIUSURA OVERLAY
  test('8. Il tasto X chiude correttamente i dettagli', async ({ page }) => {
    const marker = page.locator('.custom-arrow-marker').first();
    await marker.waitFor({ state: 'visible' });
    await marker.dispatchEvent('click');
    
    const btnDettagli = page.locator('button:has-text("Vedi Dettagli")');
    await btnDettagli.dispatchEvent('click');
    
    const closeBtn = page.locator('.close-overlay-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click(); // Qui il click normale dovrebbe funzionare perché l'overlay è statico
    
    await expect(page.locator('.cat-detail-overlay')).not.toBeVisible();
  });

  // TEST 9: COMMENTI PROTETTI
  test('9. Un guest visualizza il blocco ai commenti nei dettagli', async ({ page }) => {
    const marker = page.locator('.custom-arrow-marker').first();
    await marker.waitFor({ state: 'visible' });
    await marker.dispatchEvent('click');
    
    const btnDettagli = page.locator('button:has-text("Vedi Dettagli")');
    await btnDettagli.dispatchEvent('click');
    
    
    await expect(page.locator('text=Accedi per commentare.')).toBeVisible({ timeout: 10000 });
  });

  // TEST 10: LAYOUT SIDEBAR
  test('10. La sidebar è visibile e posizionata correttamente', async ({ page }) => {
    const sidebar = page.locator('.side-panel');
    await expect(sidebar).toBeVisible();
    const box = await sidebar.boundingBox();
    // nella metà destra dello schermo
    expect(box.x).toBeGreaterThan(300);
  });

});