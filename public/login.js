document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');
  
    // Hardcoded credentials for demo (replace with real authentication)
    if (username === 'admin' && password === 'password') {
      errorDiv.style.display = 'none';
      // Redirect to the React app
      window.location.href = '/';
    } else {
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Invalid username or password';
    }
  });