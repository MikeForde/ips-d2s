const { resolveId } = require('../utils/resolveId');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');
const { generateIPSBundleUnified } = require('./servercontrollerfuncs/generateIPSBundleUnified');

async function getIPSUnifiedBundle(req, res) {
    const id = req.params.id;

    try {
        const ipssql = await resolveId(id);

        if (!ipssql) {
            return res.status(404).json({ message: "IPS record not found" });
        }

        // Transform the IPS record to the desired format
        const ips = await SQLToMongoSingle(ipssql);

        // Construct the JSON structure
        const bundle = generateIPSBundleUnified(ips);

        res.json(bundle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { getIPSUnifiedBundle };