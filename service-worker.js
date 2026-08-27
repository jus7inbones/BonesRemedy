const defaults={cases:[],deployments:[],auditChain:[]};
chrome.runtime.onInstalled.addListener(()=>chrome.storage.local.get(defaults).then(x=>chrome.storage.local.set(x)));
chrome.runtime.onMessage.addListener((m,s,send)=>{
 if(m.type==="CREATE_CASE") chrome.storage.local.get(defaults).then(st=>{const c={id:crypto.randomUUID(),createdAt:new Date().toISOString(),query:m.query||"",sourceUrl:m.sourceUrl||"",status:"REVIEW_REQUIRED",confidence:0,evidence:[]};st.cases.push(c);return chrome.storage.local.set(st).then(()=>send(c));});
 if(m.type==="JUDGE_CASE") chrome.storage.local.get(defaults).then(st=>{const c=st.cases.find(x=>x.id===m.caseId);if(!c)return send({error:"not_found"});c.status=m.decision==="approve"?"APPROVED_FOR_AUDIT":m.decision==="reject"?"REJECTED":"REVIEW_REQUIRED";c.confidence=Math.max(0,Math.min(100,Number(m.confidence)||0));c.decision={by:"Remedy",at:new Date().toISOString(),note:m.note||""};st.auditChain.push({id:crypto.randomUUID(),timestamp:new Date().toISOString(),action:"JUDGE_DECISION",caseId:c.id,status:c.status,previousHash:st.auditChain.at(-1)?.hash||null,hash:"DEMO_HASH"});return chrome.storage.local.set(st).then(()=>send(c));});
 if(m.type==="STAGE_DEPLOYMENT") chrome.storage.local.get(defaults).then(st=>{const d={id:crypto.randomUUID(),createdAt:new Date().toISOString(),version:m.version||"0.3.0",target:"staging",status:"STAGED",approvedCases:st.cases.filter(c=>c.status==="APPROVED_FOR_AUDIT").map(c=>c.id)};st.deployments.push(d);return chrome.storage.local.set(st).then(()=>send(d));});
 return true;
});
