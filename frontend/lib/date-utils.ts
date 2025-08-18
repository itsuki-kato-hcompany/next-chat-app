/**
 * 日付関連のユーティリティ関数
 */

/**
 * メッセージの時刻を日本語形式でフォーマット（HH:MM）
 */
export function formatMessageTime(dateTime: string | Date | null | undefined): string {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
}