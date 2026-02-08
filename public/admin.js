// public/admin.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const leadsContainer = document.getElementById('admin-leads-container');
  const reviewsContainer = document.getElementById('admin-reviews-container');
  const messageEl = document.getElementById('admin-message');

  let token = null;

  // Admin login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    const credentials = {
      username: document.getElementById('admin-username').value.trim(),
      password: document.getElementById('admin-password').value.trim(),
    };

    try {
      const res = await fetch(API_CONFIG.adminLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        token = data.token;
        showMessage(messageEl, 'Login successful!', 'success');
        loginForm.style.display = 'none';
        loadLeads();
        loadReviews();
      } else {
        showMessage(messageEl, data.error || 'Login failed.', 'error');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      showMessage(messageEl, 'Unable to login. Try again later.', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });

  // Load leads
  async function loadLeads() {
    if (!token) return;
    try {
      const res = await fetch(API_CONFIG.adminLeads, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.leads)) {
        leadsContainer.innerHTML = data.leads
          .map(
            (l) => `<div class="lead-card">
                <p>${l.name} - ${l.email} - ${l.phone || 'No phone'}</p>
                <p>Message: ${l.message || '-'}</p>
              </div>`
          )
          .join('');
      } else {
        leadsContainer.innerHTML = '<p>No leads found.</p>';
      }
    } catch (err) {
      console.error('Error loading leads:', err);
      leadsContainer.innerHTML = '<p>Unable to load leads.</p>';
    }
  }

  // Load reviews
  async function loadReviews() {
    if (!token) return;
    try {
      const res = await fetch(API_CONFIG.adminReviews, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.reviews)) {
        reviewsContainer.innerHTML = data.reviews
          .map(
            (r) => `<div class="review-card">
                <p>"${r.review}"</p>
                <p>- ${r.name}</p>
                <button data-id="${r.id}" class="approve-btn">Approve</button>
              </div>`
          )
          .join('');

        // Add approve button events
        document.querySelectorAll('.approve-btn').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            try {
              const res = await fetch(`${API_CONFIG.adminReviews}/${id}/approve`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                btn.textContent = 'Approved';
                btn.disabled = true;
              }
            } catch (err) {
              console.error('Error approving review:', err);
            }
          });
        });
      } else {
        reviewsContainer.innerHTML = '<p>No reviews pending approval.</p>';
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      reviewsContainer.innerHTML = '<p>Unable to load reviews.</p>';
    }
  }

  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    setTimeout(() => (element.style.display = 'none'), 5000);
  }
});