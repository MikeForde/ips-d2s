const zlib = require('zlib');

// Caps decompressed output so a small malicious payload can't expand into a
// multi-GB allocation (zip/gzip bomb) and exhaust server memory.
const DEFAULT_MAX_DECOMPRESSED_BYTES = 20 * 1024 * 1024; // 20MB

/**
 * Compress data into Gzip format
 * @param {Buffer | string} data - The data to be compressed (can be JSON, text, or XML)
 * @returns {Promise<Buffer>} - The compressed gzip data
 */
function gzipEncode(data) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8');
        zlib.gzip(buffer, (err, compressedData) => {
            if (err) {
                return reject(err);
            }
            resolve(compressedData);
        });
    });
}

/**
 * Decompress Gzip data
 * @param {Buffer} compressedData - The compressed gzip data
 * @returns {Promise<string>} - The decompressed data as a string
 */
function gzipDecode(compressedData, maxOutputLength = DEFAULT_MAX_DECOMPRESSED_BYTES) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(compressedData, { maxOutputLength }, (err, decompressedData) => {
            if (err) {
                if (err.code === 'ERR_BUFFER_TOO_LARGE') {
                    err.statusCode = 413;
                }
                return reject(err);
            }
            resolve(decompressedData.toString('utf-8'));
        });
    });
}

module.exports = { gzipEncode, gzipDecode, DEFAULT_MAX_DECOMPRESSED_BYTES };