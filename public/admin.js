// public/admin.js
import { ENDPOINTS } from './api-config.js';

// Login
const loginForm = document.getElementById('admin-login-form');
loginForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const password = loginForm.password.value;

  try {
    const res = await fetch(ENDPOINTS.adminLogin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('adminToken', data.token);
    alert('Logged in!');
  } catch (err) {
    console.error(err);
    alert('Login failed');
  }
});

// Fetch leads
async function fetchLeads() {
  try {
    const res = await fetch(ENDPOINTS.adminLeads, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
    });
    const data = await res.json();
    console.log('Leads:', data);
  } catch (err) {
    console.error(err);
  }
}

// Fetch reviews
async function fetchAdminReviews() {
  try {
    const res = await fetch(ENDPOINTS.adminReviews, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
    });
    const data = await res.json();
    console.log('Reviews:', data);
  } catch (err) {
    console.error(err);
  }
}

// Approve review example
async function approveReview(reviewId) {
  try {
    const res = await fetch(`${ENDPOINTS.reviewsApproved}/${reviewId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
    });
    const data = await res.json();
    console.log('Approved:', data);
  } catch (err) {
    console.error(err);
  }
}