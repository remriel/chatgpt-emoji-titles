const automatic = document.getElementById('automatic');
const automaticRemove = document.getElementById('automatic-remove');
const pick = document.getElementById('pick');
const status = document.getElementById('status');

async function activeChatTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url?.startsWith('https://chatgpt.com/') ? tab : null;
}

chrome.storage.local.get({ automatic: false, automaticRemove: false }, settings => {
  automatic.checked = settings.automatic && !settings.automaticRemove;
  automaticRemove.checked = settings.automaticRemove;
});

async function updateAutomaticMode(changed) {
  if (changed === automatic && automatic.checked) automaticRemove.checked = false;
  if (changed === automaticRemove && automaticRemove.checked) automatic.checked = false;
  await chrome.storage.local.set({automatic:automatic.checked, automaticRemove:automaticRemove.checked});
  const tab = await activeChatTab();
  if (tab) chrome.tabs.sendMessage(tab.id, { type: 'AUTOMATIC_CHANGED' }).catch(() => {});
  status.textContent = automaticRemove.checked ? 'Automatic removal is on.' : automatic.checked ? 'Automatic emoji adding is on.' : 'Automatic modes are off.';
}

automatic.addEventListener('change', () => updateAutomaticMode(automatic));
automaticRemove.addEventListener('change', () => updateAutomaticMode(automaticRemove));

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
