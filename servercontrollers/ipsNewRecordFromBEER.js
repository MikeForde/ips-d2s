// servercontrollers/ipsNewRecord.js
const { IPSModel } = require('../models/IPSModel');
const { parseBEER } = require('./servercontrollerfuncs/convertIPSBEERToSchema');
const { MongoToSQL } = require('./MySQLHelpers/MongoToSQL');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function addIPSFromBEER(req, res) {
    // Extract IPS Bundle from request body
    const ipsBEER = req.body;
    console.log(req.body);

    const delimiter = req.query.delim || 'newline';

    try {
        // Convert IPS BEER to desired schema
        const ipsRecord = parseBEER(ipsBEER, delimiter);
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

module.exports = { addIPSFromBEER };

