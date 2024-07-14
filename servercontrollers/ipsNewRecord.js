const { IPSModel } = require('../models/IPSModel');
const { MongoToSQL, MongoToSQLMany } = require('./MySQLHelpers/MongoToSQL');
const { SQLToMongoSingle, SQLToMongo } = require('./MySQLHelpers/SQLToMongo');

async function addIPS(req, res) {
    console.log("req.body", req.body);

    try {
        const transformedData = await MongoToSQL(req.body);
        const newIPS = await IPSModel.create(transformedData);

        // Convert back to Mongo format for response
        const mongoFormattedIPS = await SQLToMongoSingle(newIPS);

        res.json(mongoFormattedIPS);
    } catch (err) {
        res.status(400).send(err);
    }
}

async function addIPSMany(req, res) {
    console.log("req.body", req.body);

    try {
        const transformedDataArray = await MongoToSQLMany(req.body);
        const newIPSRecords = await IPSModel.bulkCreate(transformedDataArray);

        // Convert back to Mongo format for response
        const mongoFormattedIPSRecords = await SQLToMongo(newIPSRecords);

        res.json(mongoFormattedIPSRecords);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = { addIPS, addIPSMany };


