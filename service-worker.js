
importScripts("evidence-normalizer.js","source-scoring.js","claim-comparison.js");

const D={cases:[],evidenceLedger:[],pageSnapshots:[],deployments:[],auditChain:[],sourceMatrix:[]};

async function S(){return chrome.storage.local.get(D)}
async function H(t){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t||""));return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function audit(action,payload={}){
  const s=await S(), p=s.auditChain.at(-1);
  const material=JSON.stringify({action,payload,previousHash:p?.hash||null,timestamp:new Date().toISOString()});
  const hash=await H(material);
  s.auditChain.push({id:crypto.randomUUID(),timestamp:new Date().toISOString(),action,payload,previousHash:p?.hash||null,hash});
  await chrome.storage.local.set(s)
}

chrome.runtime.onInstalled.addListener(async()=>{const s=await S();await chrome.storage.local.set(s);await audit("EXTENSION_INSTALLED",{version:"0.5.0"})});

chrome.runtime.onMessage.addListener((m,sender,reply)=>{
(async()=>{
 const st=await S();

 if(m.type==="PAGE_SNAPSHOT"){
   st.pageSnapshots.unshift({...m.payload,id:crypto.randomUUID(),tabId:sender.tab?.id||null});
   st.pageSnapshots=st.pageSnapshots.slice(0,100);
   await chrome.storage.local.set(st);
   return reply({ok:true});
 }

 if(m.type==="CREATE_CASE"){
   const c={id:crypto.randomUUID(),createdAt:new Date().toISOString(),query:m.query||"",sourceUrl:m.sourceUrl||"",status:"REVIEW_REQUIRED",confidence:0,evidenceIds:[],decision:null};
   st.cases.push(c);await chrome.storage.local.set(st);await audit("CASE_CREATED",{caseId:c.id,query:c.query});return reply(c);
 }

 if(m.type==="ADD_EVIDENCE"){
   let e=EvidenceNormalizer.normalize(m.evidence||{});
   if(!e.id)e.id=crypto.randomUUID();
   const score=SourceScoring.score(e);
   const c=st.cases.find(x=>x.id===m.caseId);
   const cmp=ClaimComparison.assess(c?.query||e.claim||"",e);
   e.quality=score;
   e.comparison=cmp;
   st.evidenceLedger=EvidenceNormalizer.dedupe([...st.evidenceLedger,e]);

   if(c && !c.evidenceIds.includes(e.id)) c.evidenceIds.push(e.id);
   st.sourceMatrix=st.evidenceLedger.map(x=>({
      evidenceId:x.id,
      caseId: st.cases.find(c=>c.evidenceIds.includes(x.id))?.id || null,
      host: SourceScoring.hostOf(x?.source?.url||""),
      sourceType:x?.quality?.type||"unknown",
      qualityScore:x?.quality?.score||0,
      relevance:x?.comparison?.relevance||0,
      status:x.status||"UNREVIEWED"
   }));

   await chrome.storage.local.set(st);
   await audit("EVIDENCE_NORMALIZED",{evidenceId:e.id,caseId:m.caseId||null,quality:score.score,relevance:cmp.relevance});
   return reply(e);
 }

 if(m.type==="GET_CASE_MATRIX"){
   const c=st.cases.find(x=>x.id===m.caseId);
   const rows=(c?.evidenceIds||[]).map(id=>st.evidenceLedger.find(e=>e.id===id)).filter(Boolean).map(e=>({
      evidenceId:e.id,
      title:e.source?.title||"",
      url:e.source?.url||"",
      host:SourceScoring.hostOf(e.source?.url||""),
      quality:e.quality?.score||0,
      relevance:e.comparison?.relevance||0,
      status:e.status||"UNREVIEWED",
      reasons:e.quality?.reasons||[]
   })).sort((a,b)=>(b.quality+b.relevance)-(a.quality+a.relevance));
   return reply({case:c,rows});
 }

 if(m.type==="JUDGE_CASE"){
   const c=st.cases.find(x=>x.id===m.caseId);if(!c)return reply({error:"case_not_found"});
   const dec=["approve","reject","needs_more_evidence"].includes(m.decision)?m.decision:"needs_more_evidence";
   c.status=dec==="approve"?"APPROVED_FOR_AUDIT":dec==="reject"?"REJECTED":"REVIEW_REQUIRED";
   c.confidence=Math.max(0,Math.min(100,Number(m.confidence)||0));
   c.decision={by:"Remedy",at:new Date().toISOString(),decision:dec,note:m.note||"",evidenceReviewed:c.evidenceIds.length};
   await chrome.storage.local.set(st);await audit("JUDGE_DECISION",{caseId:c.id,decision:dec,confidence:c.confidence});return reply(c);
 }

 if(m.type==="STAGE_DEPLOYMENT"){
   const d={id:crypto.randomUUID(),createdAt:new Date().toISOString(),version:"0.5.0",target:"staging",status:"STAGED",approvedCases:st.cases.filter(c=>c.status==="APPROVED_FOR_AUDIT").map(c=>c.id)};
   st.deployments.push(d);await chrome.storage.local.set(st);await audit("DEPLOYMENT_STAGED",{deploymentId:d.id,version:d.version});return reply(d);
 }

 if(m.type==="EXPORT_REVIEW_BUNDLE"){
   const payload={generatedAt:new Date().toISOString(),cases:st.cases,evidence:st.evidenceLedger,sourceMatrix:st.sourceMatrix,auditChain:st.auditChain,deployments:st.deployments};
   payload.bundleHash=await H(JSON.stringify(payload));
   return reply(payload);
 }
})().catch(e=>reply({error:String(e)}));return true;
});
