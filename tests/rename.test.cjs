const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function fixture(automatic) {
  const dom = new JSDOM(`<!doctype html><html><body><nav id="history">
    <div class="row"><a href="/c/one" aria-label="First chat">First chat</a>
    <button aria-label="Unrelated action"></button>
    <button data-testid="history-item-0-options" aria-label="Open conversation options for First chat"></button></div>
  </nav></body></html>`, {url:'https://chatgpt.com/', runScripts:'outside-only'});
  const { window } = dom;
  window.HTMLElement.prototype.getClientRects = () => ({length:1});
  const saved = {automatic};
  let listener;
  window.chrome = {
    storage: {local: {
      get: (keys, callback) => {
        const result = typeof keys === 'string' ? {[keys]:saved[keys]} : {...keys, ...saved};
        if (callback) { callback(result); return; }
        return Promise.resolve(result);
      },
      set: values => { Object.assign(saved, values); return Promise.resolve(); }
    }},
    runtime: {onMessage:{addListener:fn => {listener = fn;}}}
  };
  const link = window.document.querySelector('a[href="/c/one"]');
  const menuButton = window.document.querySelector('[data-testid="history-item-0-options"]');
  menuButton.addEventListener('click', () => {
    const item = window.document.createElement('div');
    item.setAttribute('role', 'menuitem');
    item.textContent = 'Rename';
    window.document.body.append(item);
    item.addEventListener('click', () => {
      item.remove();
      const input = window.document.createElement('input');
      input.setAttribute('aria-label', 'Chat title');
      input.value = link.getAttribute('aria-label');
      window.document.querySelector('.row').append(input);
      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        link.setAttribute('aria-label', input.value);
        link.textContent = input.value;
        input.remove();
      });
    });
  });
  window.eval(source);
  return {dom, window, link, saved, message: type => listener({type}, null, () => {})};
}

test('manual mode renames only the clicked chat', async () => {
  const app = fixture(false);
  try {
    app.message('START_PICKING');
    app.link.dispatchEvent(new app.window.MouseEvent('click', {bubbles:true, cancelable:true}));
    await pause(300);
    assert.match(app.link.getAttribute('aria-label'), /^\S+ First chat$/u);
    assert.equal(app.saved.renamed_one, true);
  } finally { app.dom.window.close(); }
});

test('automatic mode uses the conversation options button', async () => {
  const app = fixture(true);
  try {
    await pause(1050);
    assert.match(app.link.getAttribute('aria-label'), /^\S+ First chat$/u);
    assert.equal(app.saved.renamed_one, true);
  } finally { app.dom.window.close(); }
});
