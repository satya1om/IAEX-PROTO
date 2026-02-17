<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
Auth::requireRole('admin');
?>
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Media</title></head><body>
<h1>Media</h1>
<p><a href="index.php">Dashboard</a></p>
<div id="message"></div>
<form id="media-form" enctype="multipart/form-data">
<input type="file" id="media-file" name="file" required>
<button type="submit">Upload</button>
</form>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<thead><tr><th>ID</th><th>Filename</th><th>Path</th><th>Type</th><th>Uploaded</th></tr></thead>
<tbody id="media-table"></tbody>
</table>

<script>
let csrfToken = '';
async function fetchCsrf(){const r=await fetch('../public_html/api.php?action=csrf',{credentials:'same-origin'});csrfToken=(await r.json()).token;}
function esc(v){return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}
async function loadMedia(page=1){
 const res=await fetch('../public_html/api.php?action=media_list&page='+page+'&limit=20',{credentials:'same-origin'});
 const json=await res.json();
 const tbody=document.getElementById('media-table'); tbody.innerHTML='';
 (json.data||[]).forEach(row=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${esc(row.id)}</td><td>${esc(row.filename)}</td><td><a href="${esc(row.path)}" target="_blank">${esc(row.path)}</a></td><td>${esc(row.mime_type)}</td><td>${esc(row.uploaded_at)}</td>`; tbody.appendChild(tr);});
}

document.getElementById('media-form').addEventListener('submit', async (e)=>{
 e.preventDefault(); await fetchCsrf();
 const fd=new FormData(); fd.append('csrf_token', csrfToken); fd.append('file', document.getElementById('media-file').files[0]);
 const res=await fetch('../public_html/api.php?action=media_upload',{method:'POST', credentials:'same-origin', body:fd});
 const json=await res.json();
 document.getElementById('message').textContent=json.success?('Uploaded: '+json.url):(json.error||'Upload failed');
 if(json.success){document.getElementById('media-file').value=''; loadMedia();}
});

fetchCsrf().then(()=>loadMedia());
</script>
</body></html>
