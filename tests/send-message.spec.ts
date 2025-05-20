import { test, expect } from '@playwright/test';

test('メッセージ送信でチャット欄に表示される', async ({ page }) => {
  await page.goto('/');
  // 入力欄にテキストを入力
  await page.getByPlaceholder('メッセージを入力...').fill('こんにちは');
  // 送信ボタンをクリック
  await page.getByRole('button', { name: '送信' }).click();
  // ユーザーのメッセージが表示されていることを確認
  await expect(page.locator('text=あなた：こんにちは')).toBeVisible();
  // サーモンの返答内容を検証（「調子はどうですか？」が返る想定）
  await expect(page.locator('text=サーモン：調子はどうですか？')).toBeVisible();
}); 