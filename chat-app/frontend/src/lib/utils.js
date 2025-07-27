export function formatMessageDate(date) {
  // 使用 undefined 表示使用用户浏览器的本地时区设置
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
