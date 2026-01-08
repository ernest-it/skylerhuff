// Form submission handler

document.addEventListener('DOMContentLoaded', function() {

  const form = document.getElementById('email-form');
  if (!form) return;

  const successMessage = document.querySelector('.form-success');
  const errorMessage = document.querySelector('.form-error');
  const submitButton = form.querySelector('button[type="submit"]');

  // Hide messages initially
  if (successMessage) successMessage.style.display = 'none';
  if (errorMessage) errorMessage.style.display = 'none';

  // Form submission handler
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Disable submit button to prevent double submission
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    // Hide any previous messages
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    // Get form data
    const formData = new FormData(form);

    try {
      // Send to Formspree
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        // Success - show success message and reset form
        if (successMessage) {
          successMessage.style.display = 'flex';
          // Scroll to message
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();

        // Re-enable button after delay
        setTimeout(() => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Request';
          }
        }, 3000);

      } else {
        // Error response from server
        throw new Error('Form submission failed');
      }

    } catch (error) {
      // Show error message
      if (errorMessage) {
        errorMessage.style.display = 'flex';
        // Scroll to message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Re-enable button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Request';
      }

      console.error('Form submission error:', error);
    }
  });

  // Real-time validation
  const inputs = form.querySelectorAll('input[required], textarea[required]');

  inputs.forEach(input => {
    // Validate on blur
    input.addEventListener('blur', function() {
      validateInput(this);
    });

    // Clear validation on focus
    input.addEventListener('focus', function() {
      this.classList.remove('invalid');
      removeErrorMessage(this);
    });
  });

  function validateInput(input) {
    if (!input.value.trim()) {
      input.classList.add('invalid');
      showErrorMessage(input, 'This field is required');
      return false;
    }

    // Email validation
    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add('invalid');
        showErrorMessage(input, 'Please enter a valid email address');
        return false;
      }
    }

    input.classList.remove('invalid');
    removeErrorMessage(input);
    return true;
  }

  function showErrorMessage(input, message) {
    // Check if error message already exists
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.textContent = message;
      return;
    }

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  }

  function removeErrorMessage(input) {
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  // Add CSS for validation states
  const validationStyle = document.createElement('style');
  validationStyle.textContent = `
    .form-group input.invalid,
    .form-group textarea.invalid {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      animation: slideInDown 0.3s ease;
    }

    button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(validationStyle);

});
