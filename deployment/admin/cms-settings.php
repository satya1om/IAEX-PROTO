<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
Auth::requireRole('admin');
?>
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CMS Settings</title></head><body>
<h1>CMS Settings</h1>
<p><a href="index.php">Dashboard</a></p>
<div id="message"></div>
<form id="settings-form">
<label>Site Name <input id="site_name"></label><br>
<label>Site Tagline <input id="site_tagline"></label><br>
<label>Contact Email <input id="contact_email"></label><br>
<button type="submit">Save Settings</button>
</form>
<script>
let csrfToken='';
async function fetchCsrf(){const r=await fetch('../public_html/api.php?action=csrf',{credentials:'same-origin'});csrfToken=(await r.json()).token;}
async function loadSettings(){const r=await fetch('../public_html/api.php?action=settings_get',{credentials:'same-origin'});const j=await r.json();(j.data||[]).forEach(row=>{const el=document.getElementById(row.key); if(el) el.value=row.value;});}
document.getElementById('settings-form').addEventListener('submit', async (e)=>{
 e.preventDefault(); await fetchCsrf();
 const payload={csrf_token:csrfToken,settings:{site_name:site_name.value,site_tagline:site_tagline.value,contact_email:contact_email.value}};
 const r=await fetch('../public_html/api.php?action=settings_update',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const j=await r.json(); document.getElementById('message').textContent=j.success?'Saved.':(j.error||'Save failed');
});
fetchCsrf().then(loadSettings);
</script>
</body></html>
