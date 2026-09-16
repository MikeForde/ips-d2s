// middlewares/basicAuthMiddleware.js
//
// Gates the entire app behind a single shared HTTP Basic Auth credential.
// This is not per-user identity - it's a low-friction way to keep an
// internet-facing demo (no fixed IP to allowlist, no appetite for full
// auth in the frontend) from being wide open to anonymous scanners/bots.
// The browser handles the credential prompt natively, so no frontend
// changes are needed.

const crypto = require('crypto');

const REALM = 'ips-d2s';

function timingSafeStringEqual(a, b) {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');

    if (bufA.length !== bufB.length) {
        // Still run a comparison of matching length so a missing/short guess
        // doesn't return measurably faster than a same-length wrong guess.
        crypto.timingSafeEqual(bufA, bufA);
        return false;
    }

    return crypto.timingSafeEqual(bufA, bufB);
}

function basicAuthMiddleware(req, res, next) {
    const expectedUser = process.env.BASIC_AUTH_USER;
    const expectedPassword = process.env.BASIC_AUTH_PASSWORD;

    if (!expectedUser || !expectedPassword) {
        console.error('BASIC_AUTH_USER / BASIC_AUTH_PASSWORD are not configured - refusing all requests.');
        return res.status(503).send('Server is not configured.');
    }

    const authHeader = req.headers.authorization || '';
    const [scheme, encoded] = authHeader.split(' ');

    if (scheme === 'Basic' && encoded) {
        let decoded = '';
        try {
            decoded = Buffer.from(encoded, 'base64').toString('utf8');
        } catch {
            decoded = '';
        }

        const separatorIndex = decoded.indexOf(':');
        if (separatorIndex !== -1) {
            const user = decoded.slice(0, separatorIndex);
            const password = decoded.slice(separatorIndex + 1);

            if (timingSafeStringEqual(user, expectedUser) && timingSafeStringEqual(password, expectedPassword)) {
                return next();
            }
        }
    }

    res.set('WWW-Authenticate', `Basic realm="${REALM}"`);
    return res.status(401).send('Authentication required.');
}

module.exports = basicAuthMiddleware;
