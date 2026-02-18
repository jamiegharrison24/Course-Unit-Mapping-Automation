function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        alert('Email cannot be empty.');
        return false;
    }

    if (!emailPattern.test(email)) {
        alert('Invalid email format');
        return false;
    }

    return true;
}

function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
        alert('Password cannot be empty.');
        return false;
    }

    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long, contain at least one letter, one number, and one special character');
        return false;
    }

    return true;
}

function submitPasswordResetRequest(e) {
    e.preventDefault();
    // Get the input token value
    const email = document.getElementById('email-input').value;
    if (validateEmail(email)) {
        // Request MFA Enables
        Backend.Auth.requestPasswordReset(email).then(response => {
            if (response.status === 404) {
                alert("Error " + response.status + ": " + response.error)
            } else if (response.status === 200) {
                // redirect to request password success page
                window.location.href = "/login/request-password-reset-success";
            } else {
                alert("Error : " + response.error)
            }
        }).catch(error => {
            console.error("An error occurred:", error);
            alert("An error occurred: " + error.message);
        });
    } 
}

function validatePasswordResetLinkRenderForm() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    Backend.Auth.validateResetPasswordLink(token, email).then( response => {
        if (response.status === 200) {
            console.log
            document.getElementById('pw-new-form').style.display = 'block';
            document.getElementById('pw-new-error-form').style.display = 'none';
        } else {
            document.getElementById('pw-new-form').style.display = 'none';
            document.getElementById('pw-new-error-form').style.display = 'block';
            document.getElementById('pw-new-error-message').textContent = response.error;
        }
    }).catch(error => {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message);
    });
}

function submitNewPasswordRequest(e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    
    const newPassword = document.getElementById('reset-password').value;
    if (validatePassword(newPassword)) {
        Backend.Auth.updateNewPassword(token, email, newPassword).then(response => {
            if(response.status === 200) {
                window.location.href = '/reset-password-success';
            } else {
                alert("Error " + response.status + ": " + response.error)
            }
        }).catch(error => {
            console.error("An error occurred:", error);
            alert("An error occurred: " + error.message);
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => { 
    // Get the current URL path
    const path = window.location.pathname;

    if (path === '/reset-password') {
        validatePasswordResetLinkRenderForm();
    }

    const submitPWReq = document.getElementById('pw-req-submit-btn');
    if (submitPWReq) {
        submitPWReq.addEventListener('click', submitPasswordResetRequest);
    }

    const resetPWAgain = document.getElementById('pw-reset-again-btn');
    if (resetPWAgain) {
        resetPWAgain.addEventListener('click', () => {
            window.location.href = '/login/request-password-reset';
        });
    }

    const submitNewPassword = document.getElementById('pw-new-submit-btn');
    if (submitNewPassword) {
        submitNewPassword.addEventListener('click', submitNewPasswordRequest);
    }

    const returnLogin = document.getElementById('return-login-btn');
    if (returnLogin) {
        returnLogin.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }
});