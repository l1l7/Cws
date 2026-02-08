// public/reviews.js
import { ENDPOINTS } from './api-config.js';

async function fetchReviews() {
  try {
    const res = await fetch(ENDPOINTS.reviews);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const data = await res.json();
    displayReviews(data);
  } catch (err) {
    console.error(err);
    document.getElementById('reviews-container').innerHTML = '<p>Failed to load reviews.</p>';
  }
}

function displayReviews(reviews) {
  const container = document.getElementById('reviews-container');
  container.innerHTML = '';
  reviews.forEach(r => {
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `
      <h4>${r.name}</h4>
      <p>${r.message}</p>
      <small>${new Date(r.created_at).toLocaleDateString()}</small>
    `;
    container.appendChild(div);
  });
}

// Fetch reviews on page load
fetchReviews();