const config = {
    // This will be updated after backend deployment
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'  // Development API URL
      : 'https://tickr-e5nm.onrender.com'  // Will update this later
  };