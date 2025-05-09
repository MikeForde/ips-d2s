// servercontrollers/ipsNewRecord.js
const { IPSModel } = require('../models/IPSModel');
const { parseHL72_xToMongo } = require('./servercontrollerfuncs/convertHL72_xToSchema');
const { upsertIPSRecord } = require('./MySQLHelpers/upsertIPSRecord');

async function addIPSFromHL72x(req, res) {
    // Extract IPS Bundle from request body
    const ipsHL72x = req.body;

    console.log(req.body);

    // Convert IPS BEER to desired schema
    try {
        const ipsRecord = parseHL72_xToMongo(ipsHL72x);

        console.log(ipsRecord);

        // Add IPS record to MySQL and get the Mongo formatted response
        const mongoFormattedIPS = await upsertIPSRecord(ipsRecord);

        // emit the new/updated record
        const io = req.app.get('io');
        if (io) {
            io.emit('ipsUpdated', mongoFormattedIPS);
        }

        res.json(mongoFormattedIPS);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { addIPSFromHL72x };