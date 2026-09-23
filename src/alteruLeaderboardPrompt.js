// Shown only on non-Crazy Games builds when the player is outside Aigram.
// Kept in its own module so the Crazy Games bundle can drop the App Store link.
const ALTERU_APP_URL = 'https://apps.apple.com/app/id6769646546';

export function renderAlterUDownloadPrompt(isZh) {
  const needLogin = isZh
    ? '在 AlterU 中打开即可查看排行榜'
    : 'Open in AlterU to view the leaderboard.';
  const downloadAlterU = isZh ? '下载 AlterU' : 'Get AlterU on the App Store';
  return `<div class="lb-state download"><span class="lb-state-icon">🏆</span><span class="lb-state-text">${needLogin}</span><a class="lb-download" href="${ALTERU_APP_URL}" target="_blank" rel="noopener noreferrer">${downloadAlterU}</a></div>`;
}
