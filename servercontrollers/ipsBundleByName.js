const { IPSModel } = require('../models/IPSModel');
const { pickIPSFormat } = require('../utils/ipsFormatPicker');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');
const { Op } = require('sequelize');

async function getIPSBundleByName(req, res) {
    const { name, given } = req.params;

    try {
        // Search using case-insensitive matching
        const query = {
            where: {
                patientName: { [Op.like]: `%${name}%` }, // Use LIKE operator
                patientGiven: { [Op.like]: `%${given}%` } // Use LIKE operator
            }
        };

        const ips = await IPSModel.findOne(query);

        if (!ips) {
            return res.status(404).json({ message: "IPS record not found" });
        }

        // Transform the IPS record to the desired format
        const transformedIps = await SQLToMongoSingle(ips);

        // Constructing the JSON structure
        const generateBundleFunction = pickIPSFormat(req.headers['x-ips-format']);
        const bundle = generateBundleFunction(transformedIps);
        if (!bundle) {
            return res.status(500).json({ message: "Error generating IPS bundle" });
        }

        res.json(bundle);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = { getIPSBundleByName };
