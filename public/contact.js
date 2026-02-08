// Contact page JS
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      phone: contactForm.phone.value,
      message: contactForm.message.value,
    };

    try {
      const res = await fetch(`${API_BASE}/lead-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.success) {
        alert('Message sent successfully!');
        contactForm.reset();
      } else {
        alert('Error: ' + (json.error || 'Try again later'));
      }
    } catch (err) {
      console.error(err);
      alert('Error sending message');
    }
  });
}