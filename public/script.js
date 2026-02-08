// Example main JS for contact forms or other general features

async function submitLead(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    message: form.message.value,
  };

  const res = await fetch(`${API_BASE}/lead-submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (json.success) {
    alert('Thank you! Your submission has been received.');
    form.reset();
  } else {
    alert('Error: ' + (json.error || 'Something went wrong'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const leadForm = document.querySelector('#lead-form');
  if (leadForm) leadForm.addEventListener('submit', submitLead);
});