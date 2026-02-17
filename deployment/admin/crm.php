<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
Auth::requireRole('admin');
?>
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CRM</title></head><body>
<h1>CRM Leads</h1>
<p><a href="index.php">Dashboard</a></p>
<div id="message"></div>
<p><a href="../public_html/api.php?action=crm_export_csv" target="_blank">Export CSV</a></p>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<thead><tr><th>ID</th><th>Reference</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
<tbody id="lead-table"></tbody>
</table>

<h2>Lead Detail</h2>
<form id="lead-form">
<input type="hidden" id="lead-id">
<label>Status <input id="lead-status" value="new"></label>
<label>Assigned User ID <input id="lead-assigned"></label>
<button type="submit">Update Lead</button>
</form>

<h3>Add Note</h3>
<form id="note-form">
<input type="hidden" id="note-lead-id">
<textarea id="lead-note" rows="4"></textarea><br>
<button type="submit">Add Note</button>
</form>

<pre id="lead-detail"></pre>

<script>
let csrfToken='';
async function fetchCsrf(){const r=await fetch('../public_html/api.php?action=csrf',{credentials:'same-origin'});csrfToken=(await r.json()).token;}
function esc(v){return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}

async function loadLeads(){
  const r=await fetch('../public_html/api.php?action=crm_leads_list',{credentials:'same-origin'});
  const j=await r.json();
  const tbody=document.getElementById('lead-table');
  tbody.innerHTML='';
  (j.data||[]).forEach(row=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${esc(row.id)}</td><td>${esc(row.reference_number)}</td><td>${esc(row.name)}</td><td>${esc(row.email)}</td><td>${esc(row.status)}</td><td><button data-id="${esc(row.id)}" class="view-btn">View</button></td>`;
    tbody.appendChild(tr);
  });
}

async function loadLead(id){
  const r=await fetch('../public_html/api.php?action=crm_lead_get&id='+encodeURIComponent(id),{credentials:'same-origin'});
  const j=await r.json();
  if(!j.data){return;}
  document.getElementById('lead-id').value=j.data.id;
  document.getElementById('note-lead-id').value=j.data.id;
  document.getElementById('lead-status').value=j.data.status || 'new';
  document.getElementById('lead-assigned').value=j.data.assigned_to || '';
  document.getElementById('lead-detail').textContent=JSON.stringify(j,null,2);
}

document.getElementById('lead-table').addEventListener('click', async (e)=>{
  const t=e.target;
  if(t.classList.contains('view-btn')) await loadLead(t.dataset.id);
});

document.getElementById('lead-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  await fetchCsrf();
  const payload={csrf_token:csrfToken,id:Number(document.getElementById('lead-id').value),status:document.getElementById('lead-status').value,assigned_to:document.getElementById('lead-assigned').value || null};
  const r=await fetch('../public_html/api.php?action=crm_lead_update',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const j=await r.json();
  document.getElementById('message').textContent=j.success?'Lead updated':(j.error||'Update failed');
  if(j.success){loadLeads(); if(payload.id) loadLead(payload.id);}
});

document.getElementById('note-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  await fetchCsrf();
  const payload={csrf_token:csrfToken,lead_id:Number(document.getElementById('note-lead-id').value),note:document.getElementById('lead-note').value};
  const r=await fetch('../public_html/api.php?action=crm_note_add',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const j=await r.json();
  document.getElementById('message').textContent=j.success?'Note added':(j.error||'Save failed');
  if(j.success){document.getElementById('lead-note').value=''; loadLead(payload.lead_id);}
});

fetchCsrf().then(loadLeads);
</script>
</body></html>
