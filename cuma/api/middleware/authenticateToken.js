import jwt from 'jsonwebtoken';
import * as AuthUtils from '../utils/auth-utils.js';

const serverPath = "http://localhost:" + (process.env.PORT || 3000);
const authBackendPath = "/api/authentication";

/**
 * Authenticate the accessToken cookie to allow user access to protected routes.
 * 
 * If accessToken exist, verify the accessToken and authenticate.
 * If accessToken is missing or failed verification, use refreshToken to issue a new accessToken.
 * If both accessToken and requestToken are missing, then user need to authenticate again to issue new accessToken and refreshToken.
 * 
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function authenticateToken(req, res, next) {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
        try {
            const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedAccessToken;
            console.log('Authenticated')
            return next();
        } catch (error) {
            console.log("Error verifying access token:", error);
        };
    } else if (refreshToken) {
        try {
            // Call api to refresh the access token using refreshToken
            const url = new URL(serverPath + authBackendPath + "/refresh-token");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });

            // Validate token refresh response
            const result = await response.json();
            if (!response.ok || !result.accessToken) {
                console.log("Failed to refresh token:", result.message || "Unknown error");
                return res.redirect('/login');
            };

            // Verify the new access token and store in cookie
            const decodedAccessToken = jwt.verify(result.accessToken, process.env.ACCESS_TOKEN_SECRET);
            AuthUtils.createAccessTokenCookie(res, result.accessToken);

            // Add user info to api request
            req.user = decodedAccessToken;
            console.log('Authenticated with refreshed token');
            return next();

        } catch (error) {
            console.log("Error refreshing Token: ", error);
            return res.redirect('/login');
        };

    } else {
        return res.redirect("/login");
    };
}
export default authenticateToken;
