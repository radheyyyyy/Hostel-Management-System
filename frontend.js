// frontend.js
const API_BASE = 'http://localhost:5500'; // change port if server uses another

async function apiGet(path){
  try {
    const res = await fetch(API_BASE + path);
    return await res.json();
  } catch(e) {
    console.error(e);
    return null;
  }
}

async function apiPost(path, body){
  try {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch(e) {
    console.error(e);
    return null;
  }
}

async function apiPut(path, body){
  try {
    const res = await fetch(API_BASE + path, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch(e) { console.error(e); return null; }
}

async function apiDelete(path){
  try {
    const res = await fetch(API_BASE + path, { method: 'DELETE' });
    return await res.json();
  } catch(e) { console.error(e); return null; }
}

function showMsg(id, text, isError){
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? 'crimson' : 'green';
  setTimeout(()=>{ el.textContent = ''; }, 4000);
}
