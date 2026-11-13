const BACKEND='https://seletiva-piracicaba-inscricoes.lfgestortp.chatgpt.site';
export async function register(request,token){
 const json=(body,status)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
 if(request.method!=='POST')return json({error:'Método não permitido.'},405);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Recarregue a página e tente novamente.'},403);
 if(!token)return json({error:'Inscrições temporariamente indisponíveis. Tente novamente mais tarde.'},503);
 const body=await request.text();if(body.length>4096)return json({error:'Dados inválidos.'},413);
 let data;try{data=JSON.parse(body);}catch{return json({error:'Dados inválidos.'},400);}
 const age=String(data?.age??'').trim().match(/^(\d{1,3})(?:\s*anos?)?$/i);
 if(!age||Number(age[1])<1||Number(age[1])>120)return json({error:'Digite sua idade. Pode escrever 52 ou 52 anos.'},400);
 try{
 const upstream=await fetch(BACKEND+'/api/inscricao',{method:'POST',redirect:'error',headers:{'Content-Type':'application/json','Origin':BACKEND,'OAI-Sites-Authorization':'Bearer '+token},body,signal:AbortSignal.timeout(15000)});
 if(!upstream.headers.get('content-type')?.includes('application/json'))throw Error();
 const result=await upstream.json();return json(result,upstream.status);
 }catch{return json({error:'Não conseguimos conectar. Suas respostas continuam aqui. Tente novamente.'},503);}
}
