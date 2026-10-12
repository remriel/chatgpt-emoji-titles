const automatic = document.getElementById('automatic');
const pick = document.getElementById('pick');
const status = document.getElementById('status');

async function activeChatTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url?.startsWith('https://chatgpt.com/') ? tab : null;
}

chrome.storage.local.get({ automatic: false }, ({ automatic: enabled }) => {
  automatic.checked = enabled;
});

automatic.addEventListener('change', async () => {
  await chrome.storage.local.set({ automatic: automatic.checked });
  const tab = await activeChatTab();
  if (tab) chrome.tabs.sendMessage(tab.id, { type: 'AUTOMATIC_CHANGED' }).catch(() => {});
  status.textContent = automatic.checked ? 'Automatic mode is on.' : 'Automatic mode is off.';
});

pick.addEventListener('click', async () => {
  const tab = await activeChatTab();
  if (!tab) {
    status.textContent = 'Open a chatgpt.com tab first.';
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'START_PICKING' });
    window.close();
  } catch {
    status.textContent = 'Reload the ChatGPT tab, then try again.';
  }
});
