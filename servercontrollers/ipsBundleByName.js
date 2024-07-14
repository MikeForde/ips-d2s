const { IPSModel } = require('../models/IPSModel');
const { generateIPSBundle } = require('./servercontrollerfuncs/generateIPSBundle');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');
const { Op } = require('sequelize');

async function getIPSBundleByName(req, res) {
    const { name, given } = req.params;

    try {
        // Search using case-insensitive matching
        const query = {
            where: {
                patientName: { [Op.iLike]: name },
                patientGiven: { [Op.iLike]: given }
            }
        };

        const ips = await IPSModel.findOne(query);

        if (!ips) {
            return res.status(404).json({ message: "IPS record not found" });
        }

        // Transform the IPS record to the desired format
        const transformedIps = await SQLToMongoSingle(ips);

        // Constructing the JSON structure
        const bundle = generateIPSBundle(transformedIps);

        res.json(bundle);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = { getIPSBundleByName };
