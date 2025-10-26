 //Submits form data without page refresh

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  
  if (!form) {
    return;
  }
  
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    
    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('formMessage');
      
      if (result.success) {
        messageDiv.innerHTML = '<p style="color: green;">✓ Message sent successfully!</p>';
        form.reset();
        
        setTimeout(function() {
          messageDiv.innerHTML = '';
        }, 5000);
      } else {
        messageDiv.innerHTML = '<p style="color: red;">✗ Error: ' + (result.error || 'Please try again.') + '</p>';
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      document.getElementById('formMessage').innerHTML = 
        '<p style="color: red;">Network error. Please check your connection and try again.</p>';
    }
  });
});