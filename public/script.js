// ----------------------------
// Global Navigation
// ----------------------------
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
}

// ----------------------------
// Contact Form Submission
// ----------------------------
const contactForm = document.getElementById('contact-form');
const contactMessageEl = document.getElementById('contact-message');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      phone: document.getElementById('contact-phone').value.trim(),
      message: document.getElementById('contact-message-text').value.trim()
    };

    // Validate required fields
    if (!formData.name || !formData.email) {
      showMessage(contactMessageEl, 'Name and Email are required.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const response = await fetch('/api/lead-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showMessage(contactMessageEl, 'Thank you! We will contact you soon.', 'success');
        contactForm.reset();
      } else {
        showMessage(contactMessageEl, data.error || 'Failed to submit. Try again.', 'error');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      showMessage(contactMessageEl, 'Unable to submit. Try again later.', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

// ----------------------------
// Helper Functions
// ----------------------------
function showMessage(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = 'form-message ' + type;
  el.style.display = 'block';

  setTimeout(() => {
    el.style.display = 'none';
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}