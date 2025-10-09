# Admin User Management Test Plan

## Scope
- Back-officeユーザー管理機能（`/admin/users`）と関連ミドルウェア、シーディング処理、UIナビゲーション更新。
- Adminロールのみアクセス可能であること、およびCRUD操作・ソフトデリート・役割付与が期待どおり動作すること。

## 前提条件
- `php artisan migrate:fresh --seed` を実行し、初期ユーザー（`admin@example.com` ほか）が生成済みであること。
- ブラウザは最新の Chromium / Firefox のいずれか。
- 管理者アカウントと一般ユーザーアカウントの認証情報を把握していること。

## テストケース

| ID | 種別 | シナリオ | 手順 | 期待結果 | 自動化 |
| --- | --- | --- | --- | --- | --- |
| TC-ADMIN-001 | バックエンド | マイグレーション・シーディング確認 | 1. `php artisan migrate:fresh --seed`<br>2. DBで`roles`, `model_has_roles`, `users`を確認 | - `admin`, `user`ロールが存在<br>- `admin@example.com`が`admin`ロール、`user1@example.com`〜`user10@example.com`が`user`ロールに割り当て | 手動 |
| TC-ADMIN-002 | バックエンド | 管理者アクセス許可 | 1. 管理者でログイン<br>2. `/admin/users`へアクセス | ユーザー一覧ページが200で表示され、アラートなし | `tests/Feature/Admin/UserManagementTest::test_admin_can_access_users_index` |
| TC-ADMIN-003 | バックエンド | 非管理者アクセス拒否 | 1. 一般ユーザーでログイン<br>2. `/admin/users`へアクセス | HTTP 403 が返り、コンテンツが表示されない | `tests/Feature/Admin/UserManagementTest::test_non_admin_cannot_access_users_index` |
| TC-ADMIN-004 | フロント | ナビゲーション表示制御 | 1. 管理者でログイン<br>2. ヘッダー／サイドバーを確認<br>3. 一般ユーザーでログインし同様に確認 | - 管理者: 「User Management」リンクがヘッダーとサイドバーに表示<br>- 一般ユーザー: リンクが非表示 | 手動 |
| TC-ADMIN-005 | フロント | ユーザー新規作成 | 1. 管理者で`/admin/users/create`へ遷移<br>2. フォームに必須項目入力・ロール選択<br>3. 送信 | - 成功メッセージ表示<br>- 一覧に新ユーザーが追加され、選択したロールが付与 | 手動 |
| TC-ADMIN-006 | バックエンド | ユーザー編集時の検証 | 1. 既存ユーザーの編集画面を開く<br>2. メールアドレスを別のアドレスへ変更し保存<br>3. DBで`email_verified_at`確認 | - 成功メッセージ表示<br>- `email_verified_at`が`null`にリセット | `tests/Feature/Admin/UserManagementTest::test_updating_user_email_resets_verification_timestamp` |
| TC-ADMIN-007 | フロント | 削除ダイアログ動作 | 1. 一覧から任意ユーザーの削除ボタン押下<br>2. ダイアログでユーザー名とIDが表示されることを確認<br>3. 削除を確定 | - 削除後一覧から該当ユーザーが消える<br>- DBで`deleted_at`に日時が入りソフトデリートされた状態 | `tests/Feature/Admin/UserManagementTest::test_admin_can_soft_delete_other_users` |
| TC-ADMIN-008 | バックエンド | 自己削除防止 | 1. 管理者が自分の削除ダイアログを開く | 削除ボタンが無効化されるか、送信時にエラー（`You cannot delete your own account.`）が表示され削除されない | `tests/Feature/Admin/UserManagementTest::test_admin_cannot_delete_self` |

## 備考
- 手動テストに加え、上記の自動化テストを `php artisan test --filter=UserManagementTest` で実行可能。
- フロントエンドについては、CypressなどE2EツールでTC-ADMIN-004/005の自動化余地あり。
