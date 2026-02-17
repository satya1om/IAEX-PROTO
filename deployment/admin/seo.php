<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
Auth::requireRole('admin');
?>
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SEO</title></head><body>
<h1>SEO Settings</h1>
<p><a href="index.php">Dashboard</a></p>
<div id="message"></div>
<form id="seo-form">
<label>Page Slug <input name="page_slug" id="page_slug" required></label><br>
<label>Meta Title <input name="meta_title" id="meta_title" required></label><br>
<label>Meta Description <textarea name="meta_description" id="meta_description" rows="3"></textarea></label><br>
<label>Canonical URL <input name="canonical_url" id="canonical_url"></label><br>
<label>OG Title <input name="og_title" id="og_title"></label><br>
<label>OG Description <textarea name="og_description" id="og_description" rows="3"></textarea></label><br>
<label>JSON-LD <textarea name="schema_json" id="schema_json" rows="6"></textarea></label><br>
<button type="submit">Save SEO</button>
</form>
<script>
let csrfToken='';
async function fetchCsrf(){const r=await fetch('../public_html/api.php?action=csrf',{credentials:'same-origin'});csrfToken=(await r.json()).token;}
document.getElementById('seo-form').addEventListener('submit', async (e)=>{
 e.preventDefault(); await fetchCsrf();
 const payload={csrf_token:csrfToken,page_slug:page_slug.value,meta_title:meta_title.value,meta_description:meta_description.value,canonical_url:canonical_url.value,og_title:og_title.value,og_description:og_description.value,schema_json:schema_json.value};
 const r=await fetch('../public_html/api.php?action=seo_save',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const j=await r.json(); document.getElementById('message').textContent=j.success?'Saved.':(j.error||'Save failed');
});
fetchCsrf();
</script>
</body></html>
