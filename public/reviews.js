// Reviews page JS
async function loadReviews() {
  const container = document.querySelector('#reviews-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/reviews-approved`);
    const json = await res.json();

    container.innerHTML = '';

    if (json.reviews && json.reviews.length > 0) {
      json.reviews.forEach((r) => {
        const div = document.createElement('div');
        div.className = 'review-card';
        div.innerHTML = `
          <h3>${r.name}</h3>
          <p>Rating: ${r.rating} / 5</p>
          <p>${r.review}</p>
        `;
        container.appendChild(div);
      });
    } else {
      container.innerHTML = '<p>No reviews yet!</p>';
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Error loading reviews</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadReviews);