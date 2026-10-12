const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function fixture({automatic = false, automaticRemove = false, title = 'First chat', content = 'Please debug this Python code.', patchStatus = 200, chatPath = '/c/one'} = {}) {
  const dom = new JSDOM(`<!doctype html><html><body><nav id="history"><div class="row"><a href="${chatPath}"></a></div></nav></body></html>`, {
    url:'https://chatgpt.com/', runScripts:'outside-only'
  });
  const {window} = dom;
  const saved = {automatic, automaticRemove, renamed_one:'legacy completion record'};
  const requests = [];
  let listener;
  window.chrome = {
    storage:{local:{
      get:(keys, callback) => {
        const result = typeof keys === 'string' ? {[keys]:saved[keys]} : {...keys, ...saved};
        if (callback) {callback(result); return;}
        return Promise.resolve(result);
      },
      set:values => {Object.assign(saved, values); return Promise.resolve();}
    }},
    runtime:{onMessage:{addListener:fn => {listener = fn;}}}
  };
  const link = window.document.querySelector('#history a');
  link.textContent = title;
  link.setAttribute('aria-label', title);
  window.fetch = async (url, options = {}) => {
    requests.push({url, options});
    if (url === '/api/auth/session') return {ok:true, status:200, json:async () => ({accessToken:'test-token'})};
    if (url === '/backend-api/conversation/one' && !options.method) {
      return {ok:true, status:200, json:async () => ({mapping:{a:{message:{author:{role:'user'},content:{parts:[content]}}}}})};
    }
    if (url === '/backend-api/conversation/one' && options.method === 'PATCH') {
      return {ok:patchStatus === 200, status:patchStatus};
    }
    throw Error(`Unexpected request: ${url}`);
  };
  window.eval(source);
  return {dom, window, link, saved, requests, message:type => listener({type}, null, () => {})};
}

test('manual mode chooses an emoji from conversation text', async () => {
  const app = fixture();
  try {
    app.message('START_PICKING');
    app.link.dispatchEvent(new app.window.MouseEvent('click', {bubbles:true, cancelable:true}));
    await pause(300);
    assert.equal(app.link.textContent, '💻 First chat');
    assert.equal(app.link.getAttribute('aria-label'), app.link.textContent);
    const patch = app.requests.find(request => request.options.method === 'PATCH');
    assert.deepEqual(JSON.parse(patch.options.body), {title:'💻 First chat'});
    assert.equal(patch.options.headers.Authorization, 'Bearer test-token');
  } finally {app.dom.window.close();}
});

test('automatic add uses a relevant title keyword', async () => {
  const app = fixture({automatic:true, title:'Dinner recipe', content:'Boil the pasta.'});
  try {
    await pause(1050);
    assert.equal(app.link.textContent, '🍳 Dinner recipe');
  } finally {app.dom.window.close();}
});

test('automatic remove strips only leading emoji and preserves title text', async () => {
  const app = fixture({automaticRemove:true, title:'🐙 🎨 Budget 2026'});
  try {
    await pause(1050);
    assert.equal(app.link.textContent, 'Budget 2026');
    assert.deepEqual(JSON.parse(app.requests.find(request => request.options.method === 'PATCH').options.body), {title:'Budget 2026'});
    assert.equal(app.requests.filter(request => request.url === '/backend-api/conversation/one' && !request.options.method).length, 0);
  } finally {app.dom.window.close();}
});

test('manual mode recognizes a chat inside a project URL', async () => {
  const app = fixture({chatPath:'/g/project-id/c/one'});
  try {
    app.message('START_PICKING');
    app.link.dispatchEvent(new app.window.MouseEvent('click', {bubbles:true, cancelable:true}));
    await pause(300);
    assert.equal(app.requests.find(request => request.options.method === 'PATCH').url, '/backend-api/conversation/one');
  } finally {app.dom.window.close();}
});

test('failed server update leaves the title unchanged', async () => {
  const app = fixture({patchStatus:403});
  try {
    app.message('START_PICKING');
    app.link.dispatchEvent(new app.window.MouseEvent('click', {bubbles:true, cancelable:true}));
    await pause(300);
    assert.equal(app.link.textContent, 'First chat');
    assert.match(app.window.document.body.textContent, /HTTP 403/);
  } finally {app.dom.window.close();}
});
