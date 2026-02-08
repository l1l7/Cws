// Admin page JS
let authToken = '';

async function login(event) {
  event.preventDefault();
  const password = document.querySelector('#admin-password').value;

  try {
    const res = await fetch(`${API_BASE}/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const json = await res.json();
    if (json.success) {
      authToken = json.token;
      alert('Logged in successfully');
      loadLeads();
      loadPendingReviews();
    } else {
      alert('Error: ' + (json.error || 'Login failed'));
    }
  } catch (err) {
    console.error(err);
    alert('Login error');
  }
}

async function loadLeads() {
  const container = document.querySelector('#leads-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/admin-leads`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const json = await res.json();

    container.innerHTML = '';
    if (json.leads) {
      json.leads.forEach((l) => {
        const div = document.createElement('div');
        div.className = 'lead-card';
        div.innerHTML = `
          <p>${l.name} (${l.email})</p>
          <p>${l.phone || ''}</p>
          <p>${l.message || ''}</p>
          <p>Status: ${l.status}</p>
        `;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Error loading leads</p>';
  }
}

async function loadPendingReviews() {
  const container = document.querySelector('#reviews-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/admin-reviews`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const json = await res.json();
    container.innerHTML = '';
    if (json.reviews) {
      json.reviews.forEach((r) => {
        const div = document.createElement('div');
        div.className = 'review-card';
        div.innerHTML = `
          <h3>${r.name}</h3>
          <p>${r.review}</p>
          <p>Rating: ${r.rating}</p>
          <button onclick="approveReview('${r.id}')">Approve</button>
          <button onclick="deleteReview('${r.id}')">Delete</button>
        `;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Error loading reviews</p>';
  }
}

async function approveReview(id) {
  await fetch(`${API_BASE}/admin-reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ id, action: 'approve' }),
  });
  loadPendingReviews();
}

async function deleteReview(id) {
  await fetch(`${API_BASE}/admin-reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ id, action: 'delete' }),
  });
  loadPendingReviews();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#admin-login-form');
  if (loginForm) loginForm.addEventListener('submit', login);
});