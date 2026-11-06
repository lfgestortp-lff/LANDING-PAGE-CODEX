import {test} from 'node:test';
import assert from 'node:assert/strict';
import location from '../netlify/functions/location.mjs';
test('returns only coarse provider location without IP, coordinates or persistent caching', async()=>{
 const response=location(new Request('https://example.com/.netlify/functions/location'),{geo:{city:'Campinas',subdivision:{name:'São Paulo',code:'SP'},country:{name:'Brasil',code:'BR'},latitude:1,longitude:2,postalCode:'12345'},ip:'192.0.2.1'});
 assert.equal(response.status,200);
 assert.equal(response.headers.get('cache-control'),'private, no-store');
 const body=await response.json();
 assert.deepEqual(body,{ok:true,city:'Campinas',state:'São Paulo',country:'Brasil',source:'netlify_ip',accuracy:'approximate'});
 assert.ok(!JSON.stringify(body).includes('192.0.2.1'));
});
test('does not invent location or use untrusted client headers', async()=>{
 const req=new Request('https://example.com/.netlify/functions/location',{headers:{'x-city':'Jundiaí'}});
 assert.deepEqual(await location(req,{}).json(),{ok:false});
 assert.equal(location(new Request(req.url,{method:'POST'}),{}).status,405);
});
test('handles partial provider metadata and limits text length', async()=>{
 const data=await location(new Request('https://example.com/.netlify/functions/location'),{geo:{country:{code:'BR'},city:'x'.repeat(200)}}).json();
 assert.equal(data.city.length,120);
 assert.equal(data.state,'');
 assert.equal(data.country,'BR');
});
