(() => {
  if (window.__chatEmojiRenamerLoaded) return;
  window.__chatEmojiRenamerLoaded = true;

  const EMOJIS = ['🌻','🪐','🦋','🎨','🚀','🍒','🧩','🌈','🐙','🎧','🍀','⚡','🌙','🐝','🎲','🍓','🛸','🌊','🔥','💎','🦊','🪁','🌺','🎭','🧠','☀️','🦄','🍉','🎯','🐬'];
  const TOPICS = [
    {emoji:'💻', words:/\b(?:code|coding|programming|python|javascript|typescript|react|bug|debug|api|software|developer|github)\b/i},
    {emoji:'✍️', words:/\b(?:write|writing|essay|story|novel|poem|grammar|edit|draft|article|blog)\b/i},
    {emoji:'🍳', words:/\b(?:cook|cooking|recipe|bake|baking|meal|dinner|lunch|breakfast|ingredient|food)\b/i},
    {emoji:'✈️', words:/\b(?:travel|trip|flight|hotel|vacation|holiday|itinerary|destination|tourism)\b/i},
    {emoji:'💰', words:/\b(?:budget|finance|invest|stock|money|tax|expense|salary|saving|debt)\b/i},
    {emoji:'🩺', words:/\b(?:health|medical|doctor|symptom|medicine|treatment|disease|patient|therapy)\b/i},
    {emoji:'🔬', words:/\b(?:science|research|experiment|biology|chemistry|physics|laboratory|study)\b/i},
    {emoji:'📐', words:/\b(?:math|mathematics|algebra|geometry|calculus|equation|statistics)\b/i},
    {emoji:'🎨', words:/\b(?:art|design|illustration|drawing|painting|color|palette|logo|poster|image)\b/i},
    {emoji:'🎵', words:/\b(?:music|song|audio|guitar|piano|melody|lyrics|playlist|singing)\b/i},
    {emoji:'🏋️', words:/\b(?:fitness|workout|exercise|gym|training|running|yoga|muscle)\b/i},
    {emoji:'🎮', words:/\b(?:game|gaming|video game|minecraft|rpg|level|player|console)\b/i},
    {emoji:'🌍', words:/\b(?:language|translate|translation|spanish|french|german|japanese|english|vocabulary)\b/i},
    {emoji:'📋', words:/\b(?:project|plan|planning|meeting|task|schedule|workflow|productivity)\b/i},
    {emoji:'💬', words:/\b(?:relationship|friend|family|conversation|message|communicate|social)\b/i}
  ];
  const CHAT_LINK = 'a[href*="/c/"]';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const processed = new Set();
  const savedTitles = new Map();
  const failed = new Set();
  let busy = false;
  let scanRunning = false;
  let scanPending = false;
  let pickingMode = null;
  let scanTimer;
  let automaticMode = null;
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

  function withoutLeadingEmoji(title) {
    const graphemes = new Intl.Segmenter(undefined, {granularity:'grapheme'}).segment(title);
    let end = 0;
    let found = false;
    for (const {segment, index} of graphemes) {
      if (/[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u.test(segment)) {
        found = true;
        end = index + segment.length;
      } else if (found && /^\s+$/u.test(segment)) {
        end = index + segment.length;
      } else {
        break;
      }
    }
    const rest = title.slice(end).trimStart();
    return found ? rest : null;
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

  async function conversationText(id) {
    try {
      const token = await getAccessToken();
      const response = await fetch(`/backend-api/conversation/${encodeURIComponent(id)}`, {
        credentials:'include', headers:{Authorization:`Bearer ${token}`}
      });
      if (!response.ok) return '';
      const data = await response.json();
      const nodes = Object.values(data.mapping || {});
      const messages = nodes.map(node => node.message).filter(message => message?.author?.role === 'user');
      const selected = [...messages.slice(0, 3), ...messages.slice(-2)];
      return selected.flatMap(message => message.content?.parts || [])
        .map(part => typeof part === 'string' ? part : (typeof part?.text === 'string' ? part.text : ''))
        .filter(Boolean).join(' ').slice(0, 5000);
    } catch { return ''; }
  }

  async function relevantEmoji(id, title) {
    const body = await conversationText(id);
    let best = null;
    let highest = 0;
    for (const topic of TOPICS) {
      const matches = text => [...text.matchAll(new RegExp(topic.words.source, 'gi'))].length;
      const score = matches(title) * 4 + Math.min(matches(body), 4);
      if (score > highest) { best = topic.emoji; highest = score; }
    }
    return best || randomEmoji();
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

  async function rename(link, mode = 'add') {
    const id = chatId(link);
    if (!id) return false;
    while (busy) await sleep(80);
    busy = true;
    try {
      const oldTitle = titleOf(linkById(id) || link);
      const key = `${mode}:${id}`;
      const remainder = withoutLeadingEmoji(oldTitle);
      if (!oldTitle || processed.has(key) || (mode === 'add' && remainder !== null) || (mode === 'remove' && !remainder)) return false;
      const newTitle = mode === 'remove' ? remainder : `${await relevantEmoji(id, oldTitle)} ${oldTitle}`;
      await saveTitle(id, newTitle);
      processed.add(key);
      savedTitles.set(id, newTitle);
      showTitle(id, oldTitle, newTitle);
      return true;
    } catch (error) {
      failed.add(`${mode}:${id}`);
      notify(`Could not update title: ${error.message}`);
      return false;
    } finally {
      busy = false;
    }
  }

  async function scan() {
    if (!automaticMode || pickingMode) return;
    if (scanRunning) { scanPending = true; return; }
    scanRunning = true;
    try {
      const mode = automaticMode;
      const links = [...document.querySelectorAll(CHAT_LINK)].filter(link => link.closest('nav,aside,[role="navigation"],#history'));
      for (const link of links) {
        if (automaticMode !== mode || pickingMode) break;
        const id = chatId(link);
        if (!id) continue;
        const savedTitle = savedTitles.get(id);
        if (savedTitle && titleOf(link) !== savedTitle) showTitle(id, titleOf(link), savedTitle);
        const remainder = withoutLeadingEmoji(titleOf(link));
        if ((mode === 'add' && remainder !== null) || (mode === 'remove' && !remainder)) continue;
        if (processed.has(`${mode}:${id}`) || failed.has(`${mode}:${id}`)) continue;
        await rename(link, mode);
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

  function applySettings({automatic, automaticRemove}) {
    const nextMode = automaticRemove ? 'remove' : (automatic ? 'add' : null);
    if (nextMode !== automaticMode) {
      automaticMode = nextMode;
      processed.clear();
      failed.clear();
    }
    scheduleScan();
  }

  function readSettings() {
    chrome.storage.local.get({automatic:false, automaticRemove:false}, applySettings);
  }

  function stopPicking() {
    pickingMode = null;
    document.documentElement.style.removeProperty('cursor');
    notify('Chat selection cancelled.');
    scheduleScan();
  }

  document.addEventListener('keydown', event => {
    if (pickingMode && event.key === 'Escape') stopPicking();
  }, true);

  document.addEventListener('click', async event => {
    if (!pickingMode) return;
    const link = event.target.closest?.(CHAT_LINK);
    if (!link || !link.closest('nav,aside,[role="navigation"],#history')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const mode = pickingMode;
    pickingMode = null;
    document.documentElement.style.removeProperty('cursor');
    failed.delete(`${mode}:${chatId(link)}`);
    const success = await rename(link, mode);
    if (success) notify(mode === 'remove' ? 'Leading emoji removed from chat title.' : 'Emoji added to chat title.');
    else if (mode === 'add' && withoutLeadingEmoji(titleOf(link)) !== null) notify('This chat already has an emoji.');
    else if (mode === 'remove' && !failed.has(`remove:${chatId(link)}`)) {
      const remainder = withoutLeadingEmoji(titleOf(link));
      if (remainder === '') notify('An emoji-only title cannot be made empty.');
      else if (remainder === null) notify('This chat has no leading emoji.');
    }
    scheduleScan();
  }, true);

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'START_PICKING') {
      pickingMode = message.mode === 'remove' ? 'remove' : 'add';
      if (pickingMode === 'add' && automaticMode === 'remove') {
        automaticMode = null;
        chrome.storage.local.set({automaticRemove:false});
      } else if (pickingMode === 'remove' && automaticMode === 'add') {
        automaticMode = null;
        chrome.storage.local.set({automatic:false});
      }
      document.documentElement.style.setProperty('cursor', 'crosshair', 'important');
      notify(pickingMode === 'remove' ? 'Click a chat to remove its leading emoji. Press Esc to cancel.' : 'Click a chat to add an emoji. Press Esc to cancel.');
      sendResponse({ ok: true });
    }
    if (message.type === 'AUTOMATIC_CHANGED') {
      readSettings();
      sendResponse({ ok: true });
    }
  });

  readSettings();
  new MutationObserver(scheduleScan).observe(document.documentElement, {childList:true,subtree:true});
})();
