// public/contact.js
import { ENDPOINTS } from './api-config.js';

const form = document.getElementById('contact-form');
form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  };

  try {
    const res = await fetch(ENDPOINTS.leadSubmit, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit');
    alert('Message sent!');
    form.reset();
  } catch (err) {
    console.error(err);
    alert('Error sending message');
  }
});