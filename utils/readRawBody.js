// Reads a request's raw body into a Buffer, aborting once it exceeds maxBytes.
// Used by the decrypt/decompress middlewares, which run before express.json()
// and so would otherwise bypass the app's BODY_LIMIT entirely.

const DEFAULT_MAX_BODY_BYTES = 5 * 1024 * 1024; // 5MB, mirrors server.js BODY_LIMIT

function readRawBody(req, maxBytes = DEFAULT_MAX_BODY_BYTES) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let total = 0;
        let settled = false;

        req.on('data', (chunk) => {
            if (settled) return;
            total += chunk.length;
            if (total > maxBytes) {
                settled = true;
                req.destroy();
                const err = new Error(`Request body exceeds maximum allowed size of ${maxBytes} bytes`);
                err.statusCode = 413;
                reject(err);
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            if (settled) return;
            settled = true;
            resolve(Buffer.concat(chunks));
        });
        req.on('error', (err) => {
            if (settled) return;
            settled = true;
            reject(err);
        });
    });
}

module.exports = { readRawBody, DEFAULT_MAX_BODY_BYTES };
