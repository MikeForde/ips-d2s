// servercontrollers/addIPSFromCDA.js
const { IPSModel } = require('../models/IPSModel');
const { convertCDAToSchema } = require('./servercontrollerfuncs/convertCDAToSchema');
const { MongoToSQL } = require('./MySQLHelpers/MongoToSQL');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function addIPSFromCDA(req, res) {
    try {
        // Extract parsed CDA JSON from request body
        const cdaJSON = req.body;

        // Convert CDA JSON to IPS schema
        const ipsRecord = convertCDAToSchema(cdaJSON);

        // Convert to MySQL format
        const transformedData = await MongoToSQL(ipsRecord);

        // Create a new IPS record using the converted schema
        const newIPS = await IPSModel.create(transformedData);

        // Convert back to Mongo format for response
        const mongoFormattedIPS = await SQLToMongoSingle(newIPS);

        res.status(201).json(mongoFormattedIPS);

    } catch (err) {
        console.error('Error processing CDA:', err);
        res.status(400).send('Error processing CDA XML');
    }
}

module.exports = { addIPSFromCDA };

