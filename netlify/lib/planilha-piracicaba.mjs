// URL pública /exec do Apps Script, a preencher somente após verificar a implantação.
export const SHEETS_RECEIVER_URL = '';
export const SPREADSHEET_ID = '1sycaSUjqtHIbuQFXejQOj_CiSs67GHOH_-AlFC1f-jg';

export async function registerInSheets(request,data,endpoint) {
  const json=(value,status)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) return json({error:'Integração com a planilha indisponível. Tente novamente mais tarde.'},503);
  let source=new URL(request.url).origin+'/';
  try{const ref=new URL(request.headers.get('referer')||source);if(ref.origin===new URL(request.url).origin)source=ref.origin+ref.pathname;}catch{}
  try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name,age:data.age,phone:data.phone,attendance:data.attendance,source_page:source}),redirect:'follow',signal:AbortSignal.timeout(25000)});
    if(!response.ok)throw Error();
    const result=await response.json();
    if(result.ok===true && result.codigo==='CADASTRADO' && result.spreadsheetId===SPREADSHEET_ID && result.sheetId===0 && typeof result.eventId==='string' && result.eventId.length>0)return json({ok:true,eventId:result.eventId},200);
    const messages={DUPLICADO:['Este celular já possui uma inscrição. Não é necessário se inscrever novamente.',409],DADOS_INVALIDOS:['Confira seu nome completo, idade, celular com DDD e resposta sobre comparecimento.',400]};
    if(messages[result.codigo]){const [error,status]=messages[result.codigo];return json({error},status);}
    throw Error();
  }catch{return json({error:'Não foi possível confirmar sua inscrição na planilha. Suas respostas continuam aqui. Tente novamente.'},503);}
}
