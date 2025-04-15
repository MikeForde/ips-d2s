const { v4: uuidv4 } = require('uuid');
const { resolveId } = require('../utils/resolveId');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');
const { generateIPSBundleLegacy } = require('./servercontrollerfuncs/generateIPSBundleLegacy');

async function getIPSLegacyBundle(req, res) {
    const id = req.params.id;

    try {
        const ips = await resolveId(id);

        if (!ips) {
            return res.status(404).json({ message: "IPS record not found" });
        }

        // Transform the IPS record to the desired format
        const transformedIps = await SQLToMongoSingle(ips);

        // Constructing the JSON structure
        const bundle = generateIPSBundleLegacy(transformedIps);

        res.json(bundle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { getIPSLegacyBundle };
