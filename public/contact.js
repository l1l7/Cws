// public/contact.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const messageEl = document.getElementById('contact-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      phone: document.getElementById('contact-phone').value.trim(),
      message: document.getElementById('contact-message-text').value.trim(),
    };

    if (!formData.name || !formData.email) {
      showMessage(messageEl, 'Name and email are required.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(API_CONFIG.leadSubmit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showMessage(messageEl, 'Thank you! Your message has been sent.', 'success');
        form.reset();
      } else {
        showMessage(messageEl, data.error || 'Failed to send message.', 'error');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      showMessage(messageEl, 'Unable to submit form. Please try again later.', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
});

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `form-message ${type}`;
  element.style.display = 'block';
  setTimeout(() => (element.style.display = 'none'), 5000);
}