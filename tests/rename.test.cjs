const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function fixture(automatic, patchStatus = 200, chatPath = '/c/one') {
  const dom = new JSDOM(`<!doctype html><html><body><nav id="history">
    <div class="row"><a href="${chatPath}" aria-label="First chat">First chat</a></div>
  </nav></body></html>`, {url:'https://chatgpt.com/', runScripts:'outside-only'});
  const { window } = dom;
  const saved = {automatic};
  const requests = [];
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
  const link = window.document.querySelector('#history a');
  window.fetch = async (url, options = {}) => {
    requests.push({url, options});
    if (url === '/api/auth/session') return {ok:true, status:200, json:async () => ({accessToken:'test-token'})};
    if (url === '/backend-api/conversation/one' && options.method === 'PATCH') {
      return {ok:patchStatus === 200, status:patchStatus};
    }
    throw Error(`Unexpected request: ${url}`);
  };
  window.eval(source);
  return {dom, window, link, saved, requests, message: type => listener({type}, null, () => {})};
}

test('manual mode renames only the clicked chat', async () => {
  const app = fixture(false);
  try {
    app.message('START_PICKING');
    app.link.dispatchEvent(new app.window.MouseEvent('click', {bubbles:true, cancelable:true}));
    await pause(300);
    assert.match(app.link.getAttribute('aria-label'), /^\S+ First chat$/u);
    assert.equal(app.link.textContent, app.link.getAttribute('aria-label'));
    assert.equal(app.saved.renamed_one, app.link.getAttribute('aria-label'));
    assert.equal(app.requests[1].url, '/backend-api/conversation/one');
    assert.deepEqual(JSON.parse(app.requests[1].options.body), {title:app.link.getAttribute('aria-label')});
    assert.equal(app.requests[1].options.headers.Authorization, 'Bearer test-token');
  } finally { app.dom.window.close(); }
});

test('automatic mode renames without a conversation menu', async () => {
  const app = fixture(true);
  try {
    await pause(1050);
    assert.match(app.link.getAttribute('aria-label'), /^\S+ First chat$/u);
    assert.equal(app.saved.renamed_one, app.link.getAttribute('aria-label'));
  } finally { app.dom.window.close(); }
});

test('manual mode recognizes a chat inside a project URL', async () => {
  const app = fixture(false, 200, '/g/project-id/c/one');
  try {
    app.message('START_PICKING');
    app.link.dispatchEvent(new app.window.MouseEvent('click', {bubbles:true, cancelable:true}));
    await pause(300);
    assert.equal(app.requests[1].url, '/backend-api/conversation/one');
    assert.match(app.link.textContent, /^\S+ First chat$/u);
  } finally { app.dom.window.close(); }
});

test('failed server update leaves the title and completion state unchanged', async () => {
  const app = fixture(false, 403);
  try {
    app.message('START_PICKING');
    app.link.dispatchEvent(new app.window.MouseEvent('click', {bubbles:true, cancelable:true}));
    await pause(300);
    assert.equal(app.link.getAttribute('aria-label'), 'First chat');
    assert.equal(app.saved.renamed_one, undefined);
    assert.match(app.window.document.body.textContent, /HTTP 403/);
  } finally { app.dom.window.close(); }
});
