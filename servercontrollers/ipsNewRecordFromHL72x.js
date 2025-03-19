// servercontrollers/ipsNewRecord.js
const { IPSModel } = require('../models/IPSModel');
const { parseHL72_xToMongo} = require('./servercontrollerfuncs/convertHL72_xToSchema');
const { addIPSRecord } = require('./MySQLHelpers/addIPSRecord');

async function addIPSFromHL72x(req, res) {
    // Extract IPS Bundle from request body
    const ipsHL72x = req.body;

    console.log(req.body);

    // Convert IPS BEER to desired schema
    try {
        const ipsRecord = parseHL72_xToMongo(ipsHL72x);

        console.log(ipsRecord);

        // Add IPS record to MySQL and get the Mongo formatted response
        const mongoFormattedIPS = await addIPSRecord(ipsRecord);

        res.json(mongoFormattedIPS);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { addIPSFromHL72x };