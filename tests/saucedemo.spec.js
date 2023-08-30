import { test, expect } from '@playwright/test';


test.beforeEach(async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();
});


test('should displayed Products title', async ({page}) => {
    await expect(page.getByText('Products')).toBeVisible();

});

test('should displayed Shopping cart icon', async ({page}) => {
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
});

test('should displayed more then one product', async ({page}) => {
    await expect((await page.locator('.inventory_item').all()).length).toBeGreaterThan(1);
});

test('Add product to the cart', async ({page}) => {

    const product = await page.locator('.inventory_item').nth(1);
    await product.getByRole('button', {name: 'Add to cart'}).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    const productName = await product.locator('.inventory_item_name').textContent();
    await page.locator('.shopping_cart_container').click();
    const cartProduct = await page.locator('.cart_item').nth(0);
    await expect(productName).toEqual(await cartProduct.locator('.inventory_item_name').textContent());

    await cartProduct.getByRole('button', {name: 'Remove'}).click();
    await expect(page.locator('.cart_item')).toHaveCount(0);


})