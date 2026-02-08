// public/reviews.js
document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.getElementById('reviews-container');
  const form = document.getElementById('review-form');
  const messageEl = document.getElementById('review-message');

  // Fetch approved reviews
  async function loadReviews() {
    try {
      const res = await fetch(API_CONFIG.reviewsApproved);
      const data = await res.json();

      if (res.ok && Array.isArray(data.reviews)) {
        reviewsContainer.innerHTML = data.reviews
          .map(
            (r) => `<div class="review-card">
                <p class="review-text">"${r.review}"</p>
                <p class="review-author">- ${r.name}</p>
              </div>`
          )
          .join('');
      } else {
        reviewsContainer.innerHTML = '<p>No reviews available yet.</p>';
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      reviewsContainer.innerHTML = '<p>Unable to load reviews.</p>';
    }
  }

  loadReviews();

  // Submit new review
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('review-name').value.trim(),
      email: document.getElementById('review-email').value.trim(),
      review: document.getElementById('review-text').value.trim(),
    };

    if (!formData.name || !formData.email || !formData.review) {
      showMessage(messageEl, 'All fields are required.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(API_CONFIG.reviewSubmit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showMessage(messageEl, 'Thank you! Your review is submitted for approval.', 'success');
        form.reset();
        loadReviews(); // Optionally reload approved reviews
      } else {
        showMessage(messageEl, data.error || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showMessage(messageEl, 'Unable to submit review. Please try again later.', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });

  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    setTimeout(() => (element.style.display = 'none'), 5000);
  }
});