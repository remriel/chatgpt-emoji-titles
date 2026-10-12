const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');

test('automatic add and remove switches are mutually exclusive', async () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'popup.html'), 'utf8');
  const source = fs.readFileSync(path.join(__dirname, '..', 'popup.js'), 'utf8');
  const dom = new JSDOM(html, {url:'https://chatgpt.com/', runScripts:'outside-only'});
  const {window} = dom;
  const saved = {automatic:true, automaticRemove:false};
  window.chrome = {
    storage:{local:{
      get:(_defaults, callback) => callback({...saved}),
      set:async values => {Object.assign(saved, values);}
    }},
    tabs:{query:async () => [{id:1, url:'https://chatgpt.com/'}], sendMessage:async () => ({ok:true})}
  };
  try {
    window.eval(source);
    const add = window.document.getElementById('automatic');
    const remove = window.document.getElementById('automatic-remove');
    assert.equal(add.checked, true);
    remove.checked = true;
    remove.dispatchEvent(new window.Event('change'));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(add.checked, false);
    assert.equal(remove.checked, true);
    assert.deepEqual(saved, {automatic:false, automaticRemove:true});
    add.checked = true;
    add.dispatchEvent(new window.Event('change'));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(add.checked, true);
    assert.equal(remove.checked, false);
    assert.deepEqual(saved, {automatic:true, automaticRemove:false});
  } finally {dom.window.close();}
});
