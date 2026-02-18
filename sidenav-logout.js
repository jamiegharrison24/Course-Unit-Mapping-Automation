// Function to render MFA QR code
function renderMFAQRCode() {
    // Request MFA setup
    Backend.Auth.setupMFA().then(response => {
        console.log(response);
        if (response.status === 201) {
            // Extract the imageURL and set the QR Code
            const { imageUrl, secret, email } = response;
            const qrCodeImage = document.getElementById('qrcode');
            const accountNameText = document.getElementById('mfa-acc-name')
            const secretKeyText = document.getElementById('mfa-secret-key');
            if (imageUrl && qrCodeImage) {
                qrCodeImage.src = imageUrl;
                accountNameText.textContent += email;
                secretKeyText.textContent += secret;
            }
        } else {
            alert("Error " + response.status + ": " + response.error);
        }
    }).catch(error => {
        console.error("An error occurred:", error);
        // Handle the error, e.g., show an error message to the user
    });
}

// Function to handle signup form submission
function handleVerifyTOTP(e) {
    e.preventDefault();

    // Get the input token value
    const token = document.getElementById('totp-code').value;
    
    // Request MFA Enable
    Backend.Auth.enableMFA(token).then(response => {
        if (response.status === 200) { // Assuming backend uses 200 for success
            alert("Success: " + response.message);
            window.location.href = "/";
        } else {
            alert("Error " + response.status + ": " + response.error);
            window.location.href = "/login";
        }
    }).catch(error => {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message);
    });
}

function handleSkipMFA(e) {
    e.preventDefault();
    
    Backend.Auth.skipMFA().then(response => {
        if (response.status === 200) {
            window.location.href = response.nextStep;
        } else {
            alert("Error " + response.status + ": " + response.error);
        }
    }).catch(error => {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Get the current URL path
    const path = window.location.pathname;

    if (path === '/signup/mfa-setup-qr'){
        // Render MFA QR Code immediately
        renderMFAQRCode();
    }

    const enableMFA = document.getElementById('signup-mfa-enable');
    if (enableMFA) {
        enableMFA.addEventListener('click', () => {
            window.location.href = '/signup/mfa-setup-qr';
        });
    }

    const skipMFA = document.getElementById('signup-mfa-skip');
    if (skipMFA) {
        skipMFA.addEventListener('click', handleSkipMFA);
    }

    const continueMFA = document.getElementById('mfa-setup-continue');
    if (continueMFA) {
        continueMFA.addEventListener('click', () => {
            window.location.href = '/signup/mfa-verify-totp';
        });
    }

    const verifyTOTP = document.getElementById('mfa-verify-totp');
    if (verifyTOTP) {
        verifyTOTP.addEventListener('click', handleVerifyTOTP);
    }
});
