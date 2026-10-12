(() => {
  if (window.__chatEmojiRenamerLoaded) return;
  window.__chatEmojiRenamerLoaded = true;

  const EMOJIS = ['🌻','🪐','🦋','🎨','🚀','🍒','🧩','🌈','🐙','🎧','🍀','⚡','🌙','🐝','🎲','🍓','🛸','🌊','🔥','💎','🦊','🪁','🌺','🎭','🧠','☀️','🦄','🍉','🎯','🐬'];
  const CHAT_LINK = 'a[href^="/c/"], a[href*="chatgpt.com/c/"]';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const processed = new Set();
  const failed = new Set();
  let busy = false;
  let scanRunning = false;
  let scanPending = false;
  let picking = false;
  let scanTimer;
  let automatic = false;

  function chatId(link) {
    try { return new URL(link.href).pathname.match(/^\/c\/([^/]+)/)?.[1]; } catch { return null; }
  }

  function titleOf(link) {
    return (link.getAttribute('aria-label') || link.getAttribute('title') || link.innerText || link.textContent || '').trim();
  }

  function hasEmojiPrefix(title) {
    return EMOJIS.some(emoji => title.startsWith(`${emoji} `));
  }

  function randomEmoji() {
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    return EMOJIS[bytes[0] % EMOJIS.length];
  }

  function notify(message) {
    let note = document.getElementById('chat-emoji-renamer-note');
    if (!note) {
      note = document.createElement('div');
      note.id = 'chat-emoji-renamer-note';
      Object.assign(note.style, {position:'fixed',bottom:'22px',right:'22px',zIndex:'2147483647',background:'#b9f36b',color:'#161616',border:'3px solid #161616',boxShadow:'5px 5px #161616',padding:'12px 16px',font:'bold 14px Arial,sans-serif',maxWidth:'300px'});
      document.body.append(note);
    }
    note.textContent = message;
    clearTimeout(note._timer);
    note._timer = setTimeout(() => note.remove(), 4500);
  }

  async function waitFor(find, timeout = 2500) {
    const end = Date.now() + timeout;
    do {
      const result = find();
      if (result) return result;
      await sleep(60);
    } while (Date.now() < end);
    return null;
  }

  function optionsButton(link, title) {
    const buttons = [...document.querySelectorAll('button[data-testid^="history-item-"][data-testid$="-options"],button[aria-label^="Open conversation options for "]')];
    const named = buttons.find(button => button.getAttribute('aria-label')?.endsWith(title));
    if (named) return named;
    let row = link.parentElement;
    for (let depth = 0; row && depth < 5; depth++, row = row.parentElement) {
      const matches = [...row.querySelectorAll('button[data-testid$="-options"],button[aria-label^="Open conversation options for "]')];
      if (matches.length === 1 && row.querySelectorAll(CHAT_LINK).length === 1) return matches[0];
    }
    return null;
  }

  function findRenameMenuItem() {
    return [...document.querySelectorAll('[role="menuitem"]')]
      .find(el => /^rename(?:\b|$)/i.test((el.innerText || el.textContent || '').trim()) && el.getClientRects().length);
  }

  function linkById(id) {
    return [...document.querySelectorAll(CHAT_LINK)].find(link => chatId(link) === id);
  }

  async function rename(link) {
    const id = chatId(link);
    const oldTitle = titleOf(link);
    if (!id || !oldTitle || hasEmojiPrefix(oldTitle) || processed.has(id)) return false;
    while (busy) await sleep(80);
    busy = true;
    try {
      link.dispatchEvent(new MouseEvent('mouseover', {bubbles:true}));
      const menuButton = await waitFor(() => optionsButton(link, oldTitle));
      if (!menuButton) throw Error('Chat menu not found');
      menuButton.click();
      const renameItem = await waitFor(findRenameMenuItem);
      if (!renameItem) throw Error('Rename option not found');
      renameItem.click();
      const input = await waitFor(() => document.querySelector('input[aria-label="Chat title"]'));
      if (!input) throw Error('Title editor not found');
      const newTitle = `${randomEmoji()} ${oldTitle}`;
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, newTitle);
      input.dispatchEvent(new InputEvent('input', {bubbles:true, data:newTitle, inputType:'insertText'}));
      input.dispatchEvent(new Event('change', {bubbles:true}));
      input.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter',code:'Enter',bubbles:true,cancelable:true}));
      const updated = await waitFor(() => {
        const candidate = linkById(id);
        return candidate && titleOf(candidate) === newTitle ? candidate : null;
      }, 3500);
      if (!updated) throw Error('Title change was not confirmed');
      processed.add(id);
      await chrome.storage.local.set({ [`renamed_${id}`]: true });
      return true;
    } catch (error) {
      failed.add(id);
      notify(`Could not rename: ${error.message}`);
      return false;
    } finally {
      busy = false;
    }
  }

  async function scan() {
    if (!automatic || picking) return;
    if (scanRunning) { scanPending = true; return; }
    scanRunning = true;
    try {
      const links = [...document.querySelectorAll(CHAT_LINK)].filter(link => link.closest('nav,aside,[role="navigation"],#history'));
      for (const link of links) {
        if (!automatic || picking) break;
        const id = chatId(link);
        if (!id || hasEmojiPrefix(titleOf(link)) || processed.has(id) || failed.has(id)) continue;
        const key = `renamed_${id}`;
        if ((await chrome.storage.local.get(key))[key]) { processed.add(id); continue; }
        await rename(link);
        await sleep(1200);
      }
    } finally {
      scanRunning = false;
      if (scanPending) { scanPending = false; scheduleScan(); }
    }
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 700);
  }

  function stopPicking() {
    picking = false;
    document.documentElement.style.removeProperty('cursor');
    notify('Chat selection cancelled.');
    scheduleScan();
  }

  document.addEventListener('keydown', event => {
    if (picking && event.key === 'Escape') stopPicking();
  }, true);

  document.addEventListener('click', async event => {
    if (!picking) return;
    const link = event.target.closest?.(CHAT_LINK);
    if (!link || !link.closest('nav,aside,[role="navigation"],#history')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    picking = false;
    document.documentElement.style.removeProperty('cursor');
    failed.delete(chatId(link));
    const success = await rename(link);
    if (success) notify('Emoji added to chat title.');
    else if (hasEmojiPrefix(titleOf(link))) notify('This chat already has an emoji.');
    scheduleScan();
  }, true);

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'START_PICKING') {
      picking = true;
      document.documentElement.style.setProperty('cursor', 'crosshair', 'important');
      notify('Click a chat in the sidebar. Press Esc to cancel.');
      sendResponse({ ok: true });
    }
    if (message.type === 'AUTOMATIC_CHANGED') {
      chrome.storage.local.get({automatic:false}, data => { automatic = data.automatic; scheduleScan(); });
      sendResponse({ ok: true });
    }
  });

  chrome.storage.local.get({automatic:false}, data => { automatic = data.automatic; scheduleScan(); });
  new MutationObserver(scheduleScan).observe(document.documentElement, {childList:true,subtree:true});
})();
