const { IPSModel } = require('../models/IPSModel');
const { generateXMLBundle } = require('./servercontrollerfuncs/generateXMLBundle');
const { validate: isValidUUID } = require('uuid');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function getIPSXMLBundle(req, res) {
    const id = req.params.id;
    let query;

    // Check if the provided ID is a valid UUID
    if (isValidUUID(id)) {
        // Search using packageUUID if it is a valid UUID
        query = IPSModel.findOne({ where: { packageUUID: id } });
    } else {
        // Otherwise, search by primary key (id)
        query = IPSModel.findByPk(id);
    }

    try {
        const ipsRecord = await query;

        // If the record is not found, return a 404 error
        if (!ipsRecord) {
            return res.status(404).json({ message: "IPS record not found" });
        }

        // Transform the IPS record to the desired format
        const transformedIpsRecord = await SQLToMongoSingle(ipsRecord);

        // Constructing the XML structure
        const genXML = generateXMLBundle(transformedIpsRecord);

        res.set('Content-Type', 'application/xml');
        res.send(genXML);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = { getIPSXMLBundle };
