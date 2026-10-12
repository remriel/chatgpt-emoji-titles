(() => {
  if (window.__chatEmojiRenamerLoaded) return;
  window.__chatEmojiRenamerLoaded = true;

  const EMOJIS = ['🌻','🪐','🦋','🎨','🚀','🍒','🧩','🌈','🐙','🎧','🍀','⚡','🌙','🐝','🎲','🍓','🛸','🌊','🔥','💎','🦊','🪁','🌺','🎭','🧠','☀️','🦄','🍉','🎯','🐬'];
  const CHAT_LINK = 'a[href*="/c/"]';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const processed = new Set();
  const savedTitles = new Map();
  const failed = new Set();
  let busy = false;
  let scanRunning = false;
  let scanPending = false;
  let picking = false;
  let scanTimer;
  let automatic = false;
  let accessToken = null;

  function chatId(link) {
    try {
      const url = new URL(link.href);
      return url.origin === location.origin ? url.pathname.match(/(?:^|\/)c\/([^/]+)/)?.[1] : null;
    } catch { return null; }
  }

  function titleOf(link) {
    return (link.innerText || link.textContent || link.getAttribute('aria-label') || link.getAttribute('title') || '').trim();
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

  function linkById(id) {
    return [...document.querySelectorAll(CHAT_LINK)].find(link => chatId(link) === id);
  }

  async function getAccessToken() {
    if (accessToken) return accessToken;
    const response = await fetch('/api/auth/session', {credentials:'include', cache:'no-store'});
    if (!response.ok) throw Error(`Session request failed (HTTP ${response.status})`);
    const session = await response.json();
    if (!session.accessToken) throw Error('Sign in to ChatGPT, then reload the page');
    accessToken = session.accessToken;
    return accessToken;
  }

  async function saveTitle(id, title) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const token = await getAccessToken();
      const response = await fetch(`/backend-api/conversation/${encodeURIComponent(id)}`, {
        method:'PATCH',
        credentials:'include',
        headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
        body:JSON.stringify({title})
      });
      if (response.status === 401 && attempt === 0) { accessToken = null; continue; }
      if (!response.ok) throw Error(`ChatGPT rejected title update (HTTP ${response.status})`);
      return;
    }
  }

  function showTitle(id, oldTitle, newTitle) {
    const link = linkById(id);
    if (!link) return;
    if (link.getAttribute('aria-label') === oldTitle) link.setAttribute('aria-label', newTitle);
    if (link.getAttribute('title') === oldTitle) link.setAttribute('title', newTitle);
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.trim() === oldTitle) { node.nodeValue = node.nodeValue.replace(oldTitle, newTitle); break; }
    }
  }

  async function rename(link) {
    const id = chatId(link);
    const oldTitle = titleOf(link);
    if (!id || !oldTitle || hasEmojiPrefix(oldTitle) || processed.has(id)) return false;
    const prior = (await chrome.storage.local.get(`renamed_${id}`))[`renamed_${id}`];
    if (prior) {
      processed.add(id);
      if (typeof prior === 'string') { savedTitles.set(id, prior); showTitle(id, oldTitle, prior); }
      return false;
    }
    while (busy) await sleep(80);
    busy = true;
    try {
      const newTitle = `${randomEmoji()} ${oldTitle}`;
      await saveTitle(id, newTitle);
      processed.add(id);
      savedTitles.set(id, newTitle);
      await chrome.storage.local.set({ [`renamed_${id}`]: newTitle });
      showTitle(id, oldTitle, newTitle);
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
        const savedTitle = savedTitles.get(id);
        if (savedTitle && titleOf(link) !== savedTitle) showTitle(id, titleOf(link), savedTitle);
        if (!id || hasEmojiPrefix(titleOf(link)) || processed.has(id) || failed.has(id)) continue;
        const key = `renamed_${id}`;
        const prior = (await chrome.storage.local.get(key))[key];
        if (prior) {
          processed.add(id);
          if (typeof prior === 'string') { savedTitles.set(id, prior); showTitle(id, titleOf(link), prior); }
          continue;
        }
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
