// middlewares/binaryDecryptMiddleware.js

const { decryptBinary } = require('../encryption/aesUtils');
const { gzipDecode } = require('../compression/gzipUtils');
const { readRawBody } = require('../utils/readRawBody');

/**
 * Middleware to handle raw binary (octet-stream) encrypted and compressed requests.
 */
async function binaryDecryptMiddleware(req, res, next) {
    const isBinary = req.headers['content-type'] === 'application/octet-stream';

    if (isBinary) {
        try {
            const rawData = await readRawBody(req);

            // Must be at least 32 bytes: 16 (IV) + 16 (MAC) + 0 or more for ciphertext
            if (rawData.length < 32) {
                throw new Error('Invalid binary payload: Too short to contain IV, MAC, and encrypted data.');
            }

            let decryptedBuffer = await decryptBinary(rawData);

            // Decompress the decrypted buffer (assuming gzip)
            decryptedBuffer = await gzipDecode(decryptedBuffer);

            // Convert final result to string
            req.body = decryptedBuffer.toString('utf8');
            next();
        } catch (error) {
            console.error('Error processing raw binary request:', error);
            return res.status(error.statusCode || 400).send(error.statusCode === 413 ? 'Request body too large.' : 'Invalid binary request data.');
        }
    } else {
        next();
    }
}

module.exports = binaryDecryptMiddleware;