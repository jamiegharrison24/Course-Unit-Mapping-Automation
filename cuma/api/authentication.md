# CUMA Authentication Service Getting Started

## Overview

This is an Express.js-based authentication service for handling user registration, login, multi-factor authentication (MFA), password reset, and OAuth (Google) login. It uses JSON Web Tokens (JWT), bcrypt for password hashing, and Google OAuth for third-party authentication. This service also supports two-factor authentication (2FA) using the OTP authenticator and QR code generation.


## Key Features

1. **User Signup & Login**: 
   - Supports user signup with hashed password storage.
   - Login via email and password with JWT-based session management.
   - MFA (2FA) option with OTP via QR Code for added security.

2. **Google OAuth2 Integration**:
   - Google login using OAuth2 with access token retrieval and user profile information.

3. **Multi-Factor Authentication (MFA)**:
   - Allows users to enable MFA using an authenticator app, with QR code generation for setup.
   - Verifies OTP during login for enhanced security.

4. **Password Reset**:
   - Enables users to request a password reset link via email.
   - Verifies reset token and allows users to update their password securely.

5. **Token Management**:
   - Uses JWT tokens for access and refresh tokens.
   - Secure cookie storage for tokens.
   - Automatic token refresh when the access token expires.


## Setting Up Environment Variables

### Google OAuth Authentication Setup

To integrate Google OAuth, you must configure the Google Cloud Console:

1. **Create a New Project**: 
   - Go to Google Cloud Console and create a new project (e.g., `CumaLoginApp`).

2. **OAuth Consent Screen**: 
   - Implement the `OAuth Consent Screen` with relevant scopes.
   - Ensure the User Type is set to **Internal** if you want to restrict access to your organization.

3. **Create OAuth Credentials**: 
   - In the Credentials section, create a new credential for OAuth Client ID.
   - Set up the `Authorized JavaScript origins` and `Authorized Redirect URIs` appropriately.

4. **Retrieve Client Information**: 
   - Copy the `Client ID`, `Client Secret`, and the `Authorized Redirect URI`. 
   - Add these to your `.env` file as `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` respectively.

For more detailed information, [click here](https://support.google.com/cloud/answer/6158849).

**Note**: Ensure the `Authorized Redirect URI` in both Google Cloud Console and `.env` is correctly updated for both development and deployment environments. Replace `localhost` with your actual deployment domain name or address when moving to production.

---

### Reset Password Setup

To implement password reset functionality, you will need an email account or another email service to send password reset links. The current implementation uses a Gmail account:

1. **Create a New Gmail Account**: 
   - Create a Gmail account that will be used for sending password reset emails.

2. **Enable Two-Factor Authentication (2FA)**: 
   - Activate 2FA for the Gmail account and generate an App Password for secure access. 
   - For more information on setting up an App Password, [click here](https://support.google.com/mail/answer/185833).

3. **Update `.env` with Credentials**: 
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` to your `.env` file.

4. **Modify Reset Password Route if Needed**: 
   - Adjust the `processResetPasswordLink()` route as needed to meet your application’s requirements.

---

### Token Secret Setup

Token secrets are crucial for securely signing and verifying tokens, such as JSON Web Tokens (JWT), in the authentication system. To generate a token secret using Node.js `crypto`, follow these steps:

1. **Open Terminal**: 
   - Run `node` to open the Node.js REPL.

2. **Generate the Token Secret**: 
   - In the Node.js REPL, execute the following command:

     ```javascript
     require('crypto').randomBytes(64).toString('hex')
     ```

   - This will generate a random secret string. You can adjust the `randomBytes()` size to suit your security needs.

3. **Add the Secret to `.env`**: 
   - Copy the generated secret and add it to your `.env` file for the following fields:
     - `SESSION_TOKEN_SECRET`
     - `ACCESS_TOKEN_SECRET`
     - `REFRESH_TOKEN_SECRET`
     - `TEMPORARY_TOKEN_SECRET`

## Dependencies
- `Express`: Web framework for routing and middleware management.

- `bcryptjs`: For hashing passwords.

- `jsonwebtoken (JWT)`: For creating and verifying tokens.

- `Google OAuth`: Handles Google authentication and OAuth token management.

- `otplib`: For OTP generation (used in MFA).

- `qrcode`: For generating QR codes for MFA setup.

- `nodemailer`: For sending emails (used in password reset).

- `crypto`: Built-in module for generating random tokens.

## Endpoints

### Authentication Routes
- `POST /signup`: Registers a new user with an email, hashed password, and optional MFA setup.

- `POST /login`: Logs a user in using email and password. If MFA is enabled, a pending login session is created, requiring MFA verification.

- `POST /verify-mfa`: Verifies a user's MFA token during login.

- `POST /enable-mfa`: Enables MFA for a user by verifying the OTP.

### Google OAuth Routes
- `GET /google`: Redirects to Google OAuth login page.

- `GET /oauth2callback`: Callback for Google OAuth, where the user is authenticated and logged in.

### Password Reset Routes
- `POST /request-password-reset`: Sends a password reset link to the user's email.

- `POST /validate-password-reset-link`: Verifies the password reset token.

- `POST /update-new-password`: Allows the user to reset their password using a valid reset token.

### Token Management
- `POST /refresh-token`: Generates a new access token if a valid refresh token is provided.

- `GET /logout`: Logs the user out, clears tokens, and destroys the session.

### Security and Token Management
- **Password Hashing**: 
    - Passwords are hashed using bcrypt before storing them in the database.

- **JWT Tokens**:
    -  Access and refresh tokens are generated and stored in secure HTTP-only cookies.
    - Access tokens are short-lived (15 minutes) while refresh tokens last for 7 days.
    - Secure cookie settings ensure token safety in production.

- **Multi-Factor Authentication (MFA)**:
    - Users can enable MFA, where they need to verify their identity with an OTP generated from an authenticator app.
    - QR code generation is used to set up MFA.

## Future Improvements

- **Role-based Access Control (RBAC)**: Implement role-based permissions to secure different parts of the application.

- **Enhanced Email Templates**: Improve the email design for password reset and other communications.
Rate Limiting:

- **Add Rate-limiting Middleware**: To prevent brute-force attacks, especially on login and MFA verification routes.

- **Logging**: Implement better logging practices for tracking user activity and errors in production.