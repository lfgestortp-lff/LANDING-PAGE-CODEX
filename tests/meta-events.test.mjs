import { test } from "node:test";
import assert from "node:assert/strict";
import { createHandler } from "../netlify/functions/meta-events.mjs";

const origin = "https://example.netlify.app";
const now = 1800000000000;
const base = { consent: true, event_name: "Lead", event_id: "event-1", event_time: now / 1000, event_source_url: origin + "/?private=not-forwarded" };
const env = { URL: origin, META_CAPI_ACCESS_TOKEN: "unit-test-only", META_PIXEL_ID: "1801282187897715" };
const request = (data = base, headers = {}) => ({
  httpMethod: "POST", headers: { origin, "user-agent": "Test browser", "x-nf-client-connection-ip": "192.0.2.1", ...headers }, body: JSON.stringify(data)
});
test("status exposes only configuration flags, never credentials or test codes", async () => {
  const handler = createHandler({env:{...env,META_TEST_EVENT_CODE:"test-code"},fetchImpl:()=>{throw new Error("Should not send");}});
  const status=await handler({httpMethod:"GET",queryStringParameters:{status:"1"}});
  assert.equal(status.statusCode,200);
  assert.deepEqual(JSON.parse(status.body),{configured:true,test_mode:true});
  const missing = createHandler({env:{}});
  assert.deepEqual(JSON.parse((await missing({httpMethod:"GET",queryStringParameters:{status:"1"}})).body),{configured:false,test_mode:false});
});
test("requires consent and the correct origin without contacting Meta", async () => {
  const handler = createHandler({env, now: () => now, fetchImpl: () => { throw new Error("Should not send"); }});
  assert.equal((await handler(request({...base, consent: false}))).statusCode, 403);
  assert.equal((await handler(request(base, {origin: "https://other.example"}))).statusCode, 403);
  assert.equal((await handler({...request(), httpMethod: "GET"})).statusCode, 405);
});
test("validates event type, ID, date and source", async () => {
  const handler = createHandler({env, now: () => now});
  for (const change of [{event_name:"Unknown"},{event_id:42},{event_time:now / 1000 - 8 * 86400},{event_time:now / 1000 + 100},{event_source_url:"https://other.example"}]) {
    assert.equal((await handler(request({...base,...change}))).statusCode, 400);
  }
});
test("reports missing server configuration without exposing secrets", async () => {
  const handler = createHandler({env:{URL:origin}, now:() => now});
  const result = await handler(request());
  assert.equal(result.statusCode,503);
  assert.equal(JSON.parse(result.body).code,"CONFIGURATION_REQUIRED");
});
test("sends matching event IDs, removes query strings, and uses proxy IP instead of payload IP", async () => {
  let payload;
  const handler = createHandler({env:{...env, META_TEST_EVENT_CODE:"test-code"}, now: () => now, fetchImpl: async (url, options) => {
    assert.equal(url,"https://graph.facebook.com/v23.0/1801282187897715/events");
    assert.equal(options.headers.Authorization,"Bearer unit-test-only");
    payload = JSON.parse(options.body);
    return {ok:true,status:200,json:async()=>({events_received:1})};
  }});
  const result=await handler(request({...base, fbp:"fb.1.1800000000000.12345", client_ip_address:"not-trusted", nome:"Do not forward", telefone:"987654321"}));
  assert.equal(result.statusCode,200);
  assert.equal(payload.data[0].event_id,"event-1");
  assert.equal(payload.data[0].event_source_url,origin+"/");
  assert.equal(payload.data[0].user_data.client_ip_address,"192.0.2.1");
  assert.equal(payload.data[0].user_data.fbp,"fb.1.1800000000000.12345");
  assert.equal(payload.test_event_code,"test-code");
  assert.ok(!JSON.stringify(payload).includes("987654321"));
  assert.ok(!result.body.includes("unit-test-only"));
});
test("reports success only if Meta accepts the event", async () => {
  for(const [status,result,expected] of [[200,{events_received:0},502],[429,{error:"secret response"},429],[400,{error:"secret response"},502]]) {
    const handler=createHandler({env,now:()=>now,fetchImpl:async()=>({ok:status===200,status,json:async()=>result})});
    const response=await handler(request());
    assert.equal(response.statusCode,expected);
    assert.ok(!response.body.includes("secret response"));
  }
  const handler=createHandler({env,now:()=>now,fetchImpl:async()=>{throw new Error("Network");}});
  assert.equal((await handler(request())).statusCode,502);
});
test("uses the agency's current domain when the Netlify URL variable is absent", async () => {
  const agency="https://produtoraangels.netlify.app";
  const handler=createHandler({env:{META_CAPI_ACCESS_TOKEN:"unit-test-only"},now:()=>now,fetchImpl:async()=>({ok:true,status:200,json:async()=>({events_received:1})})});
  const result=await handler(request({...base,event_source_url:agency+"/"},{origin:agency}));
  assert.equal(result.statusCode,200);
});
test("keeps the renamed production domain working with a stale Netlify URL", async () => {
  const agency="https://produtoraangels.netlify.app";
  const handler=createHandler({env:{...env,URL:"https://old-project.netlify.app"},now:()=>now,fetchImpl:async()=>({ok:true,status:200,json:async()=>({events_received:1})})});
  assert.equal((await handler(request({...base,event_source_url:agency+"/"},{origin:agency}))).statusCode,200);
  assert.equal((await handler(request(base,{origin:agency}))).statusCode,400);
  assert.equal((await handler(request({...base,event_source_url:"https://other.example/"},{origin:"https://other.example"}))).statusCode,403);
});
