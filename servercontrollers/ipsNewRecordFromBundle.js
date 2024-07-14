// servercontrollers/ipsNewRecord.js
const { IPSModel } = require('../models/IPSModel');
const { convertIPSBundleToSchema } = require('./servercontrollerfuncs/convertIPSBundleToSchema');
const { MongoToSQL } = require('./MySQLHelpers/MongoToSQL');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function addIPSFromBundle(req, res) {
    // Extract IPS Bundle from request body
    const ipsBundle = req.body;

    try {
        // Convert IPS Bundle to desired schema
        const ipsRecord = convertIPSBundleToSchema(ipsBundle);

        console.log(ipsRecord);

        // Convert to MySQL format
        const transformedData = await MongoToSQL(ipsRecord);

        // Create a new IPS record using the converted schema
        const newIPS = await IPSModel.create(transformedData);

        // Convert back to Mongo format for response
        const mongoFormattedIPS = await SQLToMongoSingle(newIPS);

        res.json(mongoFormattedIPS);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { addIPSFromBundle };

