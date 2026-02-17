<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
Auth::requireRole('admin');
?>
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pages</title>
<script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script></head><body>
<h1>Pages</h1>
<p><a href="index.php">Dashboard</a></p>
<div id="message"></div>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<thead><tr><th>ID</th><th>Slug</th><th>Title</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
<tbody id="pages-table"></tbody>
</table>

<h2 id="editor-title">Create Page</h2>
<form id="page-form">
<input type="hidden" name="id" id="page-id">
<label>Title <input type="text" name="title" id="page-title" required></label><br>
<label>Slug <input type="text" name="slug" id="page-slug"></label><br>
<label>Status <select name="status" id="page-status"><option value="draft">draft</option><option value="published">published</option></select></label><br>
<textarea name="body" id="page-body" rows="14"></textarea><br>
<button type="submit">Save Page</button>
<button type="button" id="reset-btn">Reset</button>
</form>

<script>
let csrfToken = '';
const pageBody = document.getElementById('page-body');
CKEDITOR.replace('page-body');

async function fetchCsrf() {
  const res = await fetch('../public_html/api.php?action=csrf', {credentials:'same-origin'});
  const json = await res.json();
  csrfToken = json.token;
}

function esc(v){return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}

async function loadPages(page = 1) {
  const res = await fetch('../public_html/api.php?action=pages_list&page=' + page + '&limit=20', {credentials:'same-origin'});
  const json = await res.json();
  const tbody = document.getElementById('pages-table');
  tbody.innerHTML = '';
  (json.data || []).forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${esc(row.id)}</td><td>${esc(row.slug)}</td><td>${esc(row.title)}</td><td>${esc(row.status)}</td><td>${esc(row.updated_at)}</td><td><button data-id="${esc(row.id)}" class="edit-btn">Edit</button> <button data-id="${esc(row.id)}" class="del-btn">Delete</button></td>`;
    tbody.appendChild(tr);
  });
}

async function loadPage(id){
  const res = await fetch('../public_html/api.php?action=page_get&id=' + encodeURIComponent(id), {credentials:'same-origin'});
  const json = await res.json();
  const row = json.data;
  if(!row){return;}
  document.getElementById('editor-title').textContent = 'Edit Page #' + row.id;
  document.getElementById('page-id').value = row.id;
  document.getElementById('page-title').value = row.title || '';
  document.getElementById('page-slug').value = row.slug || '';
  document.getElementById('page-status').value = row.status || 'draft';
  CKEDITOR.instances['page-body'].setData(row.body || '');
}

document.getElementById('page-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetchCsrf();
  const payload = {
    csrf_token: csrfToken,
    id: document.getElementById('page-id').value || null,
    title: document.getElementById('page-title').value,
    slug: document.getElementById('page-slug').value,
    status: document.getElementById('page-status').value,
    body: CKEDITOR.instances['page-body'].getData()
  };
  const res = await fetch('../public_html/api.php?action=page_save', {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  const json = await res.json();
  document.getElementById('message').textContent = json.success ? 'Saved successfully.' : (json.error || 'Unable to save.');
  if(json.success){
    document.getElementById('reset-btn').click();
    loadPages();
  }
});

document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('editor-title').textContent = 'Create Page';
  document.getElementById('page-id').value = '';
  document.getElementById('page-title').value = '';
  document.getElementById('page-slug').value = '';
  document.getElementById('page-status').value = 'draft';
  CKEDITOR.instances['page-body'].setData('');
});

document.getElementById('pages-table').addEventListener('click', async (e) => {
  const target = e.target;
  if (target.classList.contains('edit-btn')) {
    await loadPage(target.dataset.id);
  }
  if (target.classList.contains('del-btn')) {
    if (!confirm('Delete this page?')) return;
    await fetchCsrf();
    const res = await fetch('../public_html/api.php?action=page_delete', {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body: JSON.stringify({csrf_token: csrfToken, id: target.dataset.id})});
    const json = await res.json();
    document.getElementById('message').textContent = json.success ? 'Page deleted.' : (json.error || 'Unable to delete.');
    if (json.success) loadPages();
  }
});

fetchCsrf().then(() => loadPages());
</script>
</body></html>
