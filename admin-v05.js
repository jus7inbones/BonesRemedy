
const E=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const q=s=>document.querySelector(s);
async function S(){return chrome.storage.local.get({cases:[],evidenceLedger:[],auditChain:[],sourceMatrix:[]})}
function color(n){return n>=80?"green":n>=55?"amber":"red"}

async function render(){
 const s=await S();
 q("#queue").innerHTML=s.cases.length?s.cases.map(c=>`<div class="row"><b>${E(c.query)}</b><br><small>${E(c.status)} • evidence ${c.evidenceIds?.length||0}</small><br><button class="action" data-matrix="${c.id}">Matrix</button><button class="action" data-approve="${c.id}">Approve</button><button class="action" data-more="${c.id}">Need evidence</button><button class="action" data-reject="${c.id}">Reject</button></div>`).join(""):"<div>No cases.</div>";
 q("#ledger").innerHTML=s.evidenceLedger.length?s.evidenceLedger.slice().reverse().map(e=>`<div class="row"><b>${E(e.source?.title||e.claim)}</b><br><span class="${color(e.quality?.score||0)}">Q ${e.quality?.score||0}</span> • relevance ${e.comparison?.relevance||0}%<br><small>${E(e.source?.url||"")}</small><br><code>${E(e.contentHash||"")}</code></div>`).join(""):"<div>No evidence.</div>";
 q("#audit").innerHTML=s.auditChain.length?s.auditChain.slice().reverse().map(a=>`<div class="row"><b>${E(a.action)}</b><br><small>${E(a.timestamp)}</small><br><code>${E(a.hash)}</code></div>`).join(""):"<div>No audit events.</div>";

 document.querySelectorAll("[data-matrix]").forEach(b=>b.onclick=()=>showMatrix(b.dataset.matrix));
 document.querySelectorAll("[data-approve]").forEach(b=>b.onclick=()=>judge(b.dataset.approve,"approve"));
 document.querySelectorAll("[data-more]").forEach(b=>b.onclick=()=>judge(b.dataset.more,"needs_more_evidence"));
 document.querySelectorAll("[data-reject]").forEach(b=>b.onclick=()=>judge(b.dataset.reject,"reject"));
}
async function showMatrix(id){
 const r=await chrome.runtime.sendMessage({type:"GET_CASE_MATRIX",caseId:id});
 q("#matrix").innerHTML=`<h4>${E(r.case?.query||"Case")}</h4><table><thead><tr><th>Source</th><th>Quality</th><th>Relevance</th><th>Status</th></tr></thead><tbody>${(r.rows||[]).map(x=>`<tr><td>${E(x.host||x.title)}</td><td class="${color(x.quality)}">${x.quality}</td><td>${x.relevance}%</td><td>${E(x.status)}</td></tr>`).join("")}</tbody></table>`;
}
async function judge(id,decision){
 const confidence=Number(prompt("Remedy confidence 0-100",decision==="approve"?85:60)||0);
 const note=prompt("Judge note","Reviewed against the provenance matrix.")||"";
 await chrome.runtime.sendMessage({type:"JUDGE_CASE",caseId:id,decision,confidence,note});render();
}
q("#stage").onclick=async()=>{const d=await chrome.runtime.sendMessage({type:"STAGE_DEPLOYMENT"});q("#deploy").textContent=`STAGED ${d.id}`;render()};
q("#export").onclick=async()=>{const bundle=await chrome.runtime.sendMessage({type:"EXPORT_REVIEW_BUNDLE"});const blob=new Blob([JSON.stringify(bundle,null,2)],{type:"application/json"});const u=URL.createObjectURL(blob);chrome.tabs.create({url:u})};
render();
