<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
Auth::requireRole('admin');
?>
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Posts</title>
<script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script></head><body>
<h1>Posts</h1>
<p><a href="index.php">Dashboard</a></p>
<div id="message"></div>
<table border="1" cellpadding="6" cellspacing="0" width="100%">
<thead><tr><th>ID</th><th>Slug</th><th>Title</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead>
<tbody id="posts-table"></tbody>
</table>

<h2 id="editor-title">Create Post</h2>
<form id="post-form">
<input type="hidden" name="id" id="post-id">
<label>Title <input type="text" id="post-title" required></label><br>
<label>Slug <input type="text" id="post-slug"></label><br>
<label>Excerpt <textarea id="post-excerpt" rows="2"></textarea></label><br>
<label>Status <select id="post-status"><option value="draft">draft</option><option value="published">published</option></select></label><br>
<label>Published At <input type="datetime-local" id="post-published-at"></label><br>
<label>Featured Image URL <input type="text" id="post-featured-image"></label><br>
<textarea id="post-body" rows="14"></textarea><br>
<button type="submit">Save Post</button>
<button type="button" id="reset-btn">Reset</button>
</form>

<script>
let csrfToken = '';
CKEDITOR.replace('post-body');

async function fetchCsrf() {
  const res = await fetch('../public_html/api.php?action=csrf', {credentials:'same-origin'});
  const json = await res.json();
  csrfToken = json.token;
}
function esc(v){return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}

async function loadPosts(page = 1) {
  const res = await fetch('../public_html/api.php?action=posts_list&page=' + page + '&limit=20', {credentials:'same-origin'});
  const json = await res.json();
  const tbody = document.getElementById('posts-table');
  tbody.innerHTML = '';
  (json.data || []).forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${esc(row.id)}</td><td>${esc(row.slug)}</td><td>${esc(row.title)}</td><td>${esc(row.status)}</td><td>${esc(row.published_at || '')}</td><td><button data-id="${esc(row.id)}" class="edit-btn">Edit</button> <button data-id="${esc(row.id)}" class="del-btn">Delete</button></td>`;
    tbody.appendChild(tr);
  });
}

async function loadPost(id){
  const res = await fetch('../public_html/api.php?action=post_get&id=' + encodeURIComponent(id), {credentials:'same-origin'});
  const json = await res.json();
  const row = json.data;
  if(!row){return;}
  document.getElementById('editor-title').textContent = 'Edit Post #' + row.id;
  document.getElementById('post-id').value = row.id;
  document.getElementById('post-title').value = row.title || '';
  document.getElementById('post-slug').value = row.slug || '';
  document.getElementById('post-excerpt').value = row.excerpt || '';
  document.getElementById('post-status').value = row.status || 'draft';
  document.getElementById('post-featured-image').value = row.featured_image || '';
  document.getElementById('post-published-at').value = row.published_at ? String(row.published_at).replace(' ','T').slice(0,16) : '';
  CKEDITOR.instances['post-body'].setData(row.body || '');
}

document.getElementById('post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetchCsrf();
  const payload = {
    csrf_token: csrfToken,
    id: document.getElementById('post-id').value || null,
    title: document.getElementById('post-title').value,
    slug: document.getElementById('post-slug').value,
    excerpt: document.getElementById('post-excerpt').value,
    status: document.getElementById('post-status').value,
    published_at: document.getElementById('post-published-at').value ? document.getElementById('post-published-at').value.replace('T',' ') + ':00' : null,
    featured_image: document.getElementById('post-featured-image').value,
    body: CKEDITOR.instances['post-body'].getData(),
    categories: []
  };
  const res = await fetch('../public_html/api.php?action=post_save', {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  const json = await res.json();
  document.getElementById('message').textContent = json.success ? 'Saved successfully.' : (json.error || 'Unable to save.');
  if(json.success){ document.getElementById('reset-btn').click(); loadPosts(); }
});

document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('editor-title').textContent = 'Create Post';
  ['post-id','post-title','post-slug','post-excerpt','post-published-at','post-featured-image'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('post-status').value = 'draft';
  CKEDITOR.instances['post-body'].setData('');
});

document.getElementById('posts-table').addEventListener('click', async (e) => {
  const target = e.target;
  if (target.classList.contains('edit-btn')) await loadPost(target.dataset.id);
  if (target.classList.contains('del-btn')) {
    if (!confirm('Delete this post?')) return;
    await fetchCsrf();
    const res = await fetch('../public_html/api.php?action=post_delete', {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body: JSON.stringify({csrf_token: csrfToken, id: target.dataset.id})});
    const json = await res.json();
    document.getElementById('message').textContent = json.success ? 'Post deleted.' : (json.error || 'Unable to delete.');
    if (json.success) loadPosts();
  }
});

fetchCsrf().then(() => loadPosts());
</script>
</body></html>
