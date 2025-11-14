// frontend.js - common helpers (put in frontend folder)
const API_BASE = 'http://localhost:5500'; // change if your server runs elsewhere

async function apiGet(path) {
  try {
    const res = await fetch(API_BASE + path);
    return await res.json();
  } catch (e) {
    console.error('GET', path, e);
    return null;
  }
}

async function apiPost(path, body) {
  try {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error('POST', path, e);
    return null;
  }
}

async function apiPut(path, body) {
  try {
    const res = await fetch(API_BASE + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error('PUT', path, e);
    return null;
  }
}

async function apiDelete(path) {
  try {
    const res = await fetch(API_BASE + path, { method: 'DELETE' });
    return await res.json();
  } catch (e) {
    console.error('DELETE', path, e);
    return null;
  }
}

function showMsg(elId, text, isError=false, timeout=3500) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? 'crimson' : 'green';
  el.style.display = 'block';
  setTimeout(()=> { el.style.display = 'none'; el.textContent = '' }, timeout);
}
