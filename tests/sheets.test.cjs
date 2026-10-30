const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function service(configured = true) {
  const rows = [];
  let locked = false;
  const sheet = {
    getMaxColumns: () => 26, getMaxRows: () => 1000, getLastRow: () => rows.length,
    getSheetId: () => 0, setFrozenRows() {},
    getRange(r, c, height, width) { return {
      setNumberFormat() {},
      getDisplayValues() { return Array.from({length: height}, (_, i) => Array.from({length: width}, (_, j) => String(rows[r - 1 + i]?.[c - 1 + j] ?? ''))); },
      setValues(values) { assert.ok(locked); values.forEach((row, i) => { rows[r - 1 + i] ||= []; row.forEach((value, j) => rows[r - 1 + i][c - 1 + j] = value); }); }
    }; }
  };
  const ctx = vm.createContext({
    console: { error() {} },
    PropertiesService: { getScriptProperties: () => ({getProperty: key => key === 'PLANILHA_ID' && configured ? 'test-sheet' : null}) },
    LockService: { getScriptLock: () => ({waitLock() { assert.equal(locked, false); locked = true; }, releaseLock() { locked = false; }}) },
    SpreadsheetApp: { openById: id => { assert.equal(id, 'test-sheet'); return {getSheets: () => [sheet]}; }, flush() {} },
    Utilities: {getUuid: () => 'test-event-id'},
    ContentService: { MimeType: {JSON:'application/json'}, createTextOutput: text => ({setMimeType: () => text}) }
  });
  vm.runInContext(fs.readFileSync('integrations/google-apps-script.js', 'utf8'), ctx);
  return {rows, ctx, post: payload => JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(payload)}})), unlocked: () => !locked};
}
const lead = {nome:'Maria Silva', idade:55, telefone:'11987654321', utm_source:'facebook', utm_campaign:'Mulheres45', event_id:'lead-test-1'};
test('saves attribution and lead ID with phone normalization under a lock', () => {
  const s=service();
  const r=s.post(lead);
  assert.equal(r.codigo,'CADASTRADO');
  assert.equal(r.event_id,'lead-test-1');
  assert.equal(s.rows.length,2);
  assert.equal(s.rows[1][4],'987654321');
  assert.equal(s.rows[1][5],'facebook');
  assert.equal(s.rows[1][7],'Mulheres45');
  assert.equal(s.rows[1][13],'lead-test-1');
  assert.ok(s.unlocked());
});
test('blocks duplicate numbers without DDD, with another DDD, and with country code', () => {
  const s=service(); s.post(lead);
  for(const telefone of ['987654321','21987654321','+55 (31) 98765-4321']) assert.equal(s.post({...lead,telefone}).codigo,'DUPLICADO');
  assert.equal(s.rows.length,2);
  assert.ok(s.unlocked());
});
test('rejects invalid data without creating rows', () => {
  const s=service();
  for(const payload of [null, [], {}, {...lead, idade:'55.5'}, {...lead,telefone:'abc987654321'}]) assert.equal(s.post(payload).codigo,'DADOS_INVALIDOS');
  assert.equal(s.rows.length,0);
});
test('escapes formula values in names and attribution', () => {
  const s=service(); s.post({...lead,nome:'=Formula Teste',utm_source:'=IMPORTXML("url")'});
  assert.equal(s.rows[1][1],"'=Formula Teste");
  assert.equal(s.rows[1][5],"'=IMPORTXML(\"url\")");
});
test('requires a configured destination and preserves an incompatible sheet', () => {
  const missing=service(false); assert.equal(missing.post(lead).codigo,'ERRO'); assert.equal(missing.rows.length,0);
  const s=service(); s.rows.push(['Dados existentes']);
  assert.equal(s.post(lead).codigo,'ERRO');
  assert.deepEqual(s.rows,[['Dados existentes']]);
  assert.ok(s.unlocked());
});
