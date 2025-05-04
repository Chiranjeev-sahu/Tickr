document.addEventListener('DOMContentLoaded', () => {
    const toggleLoginLink = document.getElementById('toggle-login');
    const toggleSignupLink = document.getElementById('toggle-signup');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const signupUsernameInput = document.getElementById('signup-username');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorPopup = document.getElementById('close-error-popup');
    const errorMessageDisplay = document.getElementById('error-message');
    // const errorTitleDisplay = document.getElementById('error-title');

    function showError(message) {
        // errorTitleDisplay.textContent = title;
        errorMessageDisplay.textContent = message;
        errorPopup.style.display = "block";
    }

    closeErrorPopup.addEventListener('click', () => {
        errorPopup.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target === errorPopup) {
            errorPopup.style.display = "none";
        }
    })

    toggleLoginLink.addEventListener('click', (event) => {
        event.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    toggleSignupLink.addEventListener('click', (event) => {
        event.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = signupUsernameInput.value.trim();
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value.trim();

        // Client-side validation for signup
        if (!username) {
            showError('Please enter your username.');
            return;
        }
        if (!email) {
            showError('Please enter your email address.');
            return;
        } else if (!isValidEmail(email)) { //use helper
            showError('Please enter a valid email address.');
            return;
        }
        if (!password) {
            showError('Please enter your password.');
            return;
        } else if (password.length < 8) {
            showError('Password must be at least 8 characters long.');
            return;
        }

        const signupData = { username, email, password };

        fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        })
        .then(response => {
             if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Signup failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'User created successfully') {
                // alert('Account created successfully! Please log in.');
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                showError(data.message);
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
            showError('An error occurred during signup. Please try again.');
        });
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        // Client-side validation for login
        if (!email) {
            showError('Please enter your email address.');
            return;
        }  else if (!isValidEmail(email)) { //use helper
            showError('Please enter a valid email address.');
            return;
        }
        if (!password) {
            showError('Please enter your password.');
            return;
        }

        const loginData = { email, password };

        fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(response => {
             if (!response.ok) {
                  return response.json().then(data => {
                    throw new Error(data.message || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Login successful') {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                showError(data.message);
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            showError('An error occurred during login. Please try again.');
        });
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
