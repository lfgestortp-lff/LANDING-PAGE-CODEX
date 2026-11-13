// Cole este arquivo inteiro em Extensões > Apps Script, na planilha de destino.
const SPREADSHEET_ID = '1sycaSUjqtHIbuQFXejQOj_CiSs67GHOH_-AlFC1f-jg';
const SHEET_ID = 0;
const HEADERS = ['Data da inscrição','Nome completo','Idade','Celular com DDD','Comparece à seletiva?','Cidade da seletiva','ID da inscrição','Página de inscrição'];

function resposta(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function abaDestino() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets().find(s => s.getSheetId() === SHEET_ID);
  if (!sheet) throw new Error('Aba de destino ausente.');
  return sheet;
}
function verificarCabecalhos(sheet) {
  const headers=sheet.getRange(1,1,1,HEADERS.length).getDisplayValues()[0];
  if (HEADERS.some((v,i)=>headers[i]!==v)) throw new Error('Cabeçalhos diferentes.');
}
function prepararPlanilha() {
  const sheet=abaDestino();
  if (sheet.getLastRow()===0) sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  verificarCabecalhos(sheet);
  sheet.setFrozenRows(1);
  return 'Planilha pronta.';
}
function telefoneNormalizado(value) {
  let digits=String(value??'').replace(/\D/g,'');
  if(digits.length===13 && digits.startsWith('55')) digits=digits.slice(2);
  return digits;
}
function doGet() {
  try {
    verificarCabecalhos(abaDestino());
    return resposta({ok:true,ready:true,spreadsheetId:SPREADSHEET_ID,sheetId:SHEET_ID,version:'piracicaba-v1'});
  } catch (_) {
    return resposta({ok:false,ready:false,codigo:'CONFIGURACAO',mensagem:'Confira a autorização e os cabeçalhos da planilha.'});
  }
}
function doPost(e) {
  let locked=false;
  const lock=LockService.getScriptLock();
  try {
    let data;
    try {data=JSON.parse(e.postData.contents);} catch(_){return resposta({ok:false,codigo:'DADOS_INVALIDOS',mensagem:'Dados inválidos.'});}
    if(!data||typeof data!=='object'||Array.isArray(data)) return resposta({ok:false,codigo:'DADOS_INVALIDOS',mensagem:'Dados inválidos.'});
    const name=String(data.name??'').trim().replace(/\s+/g,' ');
    if(name.length<3||name.length>150||name.split(' ').length<2||!/^[\p{L}\p{M} '\-]+$/u.test(name)) return resposta({ok:false,codigo:'DADOS_INVALIDOS',mensagem:'Digite seu nome completo, com nome e sobrenome.'});
    const ageMatch=String(data.age??'').trim().match(/^(\d{1,3})(?:\s*anos?)?$/i);
    if(!ageMatch||Number(ageMatch[1])<1||Number(ageMatch[1])>120) return resposta({ok:false,codigo:'DADOS_INVALIDOS',mensagem:'Digite sua idade. Pode escrever 52 ou 52 anos.'});
    const phone=telefoneNormalizado(data.phone);
    const ddds='11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' ');
    if(!/^\d{2}9\d{8}$/.test(phone)||!ddds.includes(phone.slice(0,2))) return resposta({ok:false,codigo:'DADOS_INVALIDOS',mensagem:'Digite seu celular com DDD: 2 números do DDD e 9 do celular.'});
    if(typeof data.attendance!=='boolean') return resposta({ok:false,codigo:'DADOS_INVALIDOS',mensagem:'Escolha Sim ou Não para continuar.'});
    if(!lock.tryLock(10000)) return resposta({ok:false,codigo:'OCUPADO',mensagem:'Estamos recebendo inscrições. Tente novamente em instantes.'});
    locked=true;
    const sheet=abaDestino();
    verificarCabecalhos(sheet);
    const last=sheet.getLastRow();
    if(last>1 && sheet.getRange(2,4,last-1,1).getDisplayValues().some(row=>telefoneNormalizado(row[0])===phone)) return resposta({ok:false,codigo:'DUPLICADO',mensagem:'Este celular já possui uma inscrição. Não é necessário se inscrever novamente.'});
    const id=Utilities.getUuid();
    const formatted='('+phone.slice(0,2)+') '+phone.slice(2,7)+'-'+phone.slice(7);
    const source=String(data.source_page??'').slice(0,300);
    const safeSource=source.startsWith('https://produtoraangels.netlify.app/')?source:'';
    const row=last+1;
    if(row>sheet.getMaxRows())sheet.insertRowsAfter(sheet.getMaxRows(),1);
    sheet.getRange(row,4,1,1).setNumberFormat('@');
    sheet.getRange(row,7,1,1).setNumberFormat('@');
    sheet.getRange(row,1,1,HEADERS.length).setValues([[new Date(),name,Number(ageMatch[1]),formatted,data.attendance?'Sim':'Não','Piracicaba',id,safeSource]]);
    sheet.getRange(row,1,1,1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    SpreadsheetApp.flush();
    return resposta({ok:true,codigo:'CADASTRADO',eventId:id,spreadsheetId:SPREADSHEET_ID,sheetId:SHEET_ID});
  } catch(_) {
    return resposta({ok:false,codigo:'ERRO',mensagem:'Não foi possível concluir agora. Suas respostas continuam aqui. Tente novamente.'});
  } finally {if(locked)lock.releaseLock();}
}
