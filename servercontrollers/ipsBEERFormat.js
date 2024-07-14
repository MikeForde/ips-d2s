const { IPSModel } = require('../models/IPSModel');
const { validate: isValidUUID } = require('uuid');
const { generateIPSBEER } = require('./servercontrollerfuncs/generateIPSBEER');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

// Define the getIPSBEER function
const getIPSBEER = async (req, res) => {
    const { id, delim } = req.params;
    let query;

    // Check if the provided ID is a valid UUID
    if (isValidUUID(id)) {
        // Search using packageUUID if it is a valid UUID
        query = IPSModel.findOne({ where: { packageUUID: id } });
    } else {
        // Otherwise, search by primary key (id)
        query = IPSModel.findByPk(id);
    }

    // Determine the delimiter based on the parameter
    const delimiterMap = {
        'semi': ';',
        'colon': ':',
        'pipe': '|',
        'at': '@',
        'newline': '\n'
    };
    const delimiter = delimiterMap[delim] || '\n';

    try {
        const ipsRecord = await query;

        // If the record is not found, return a 404 error
        if (!ipsRecord) {
            return res.status(404).send('IPS record not found');
        }

        // Transform the IPS record to the desired format
        const transformedIpsRecord = await SQLToMongoSingle(ipsRecord);

        // Convert the IPS record to BEER format
        const beerData = generateIPSBEER(transformedIpsRecord, delimiter);

        // Send the plain text response
        res.set('Content-Type', 'text/plain');
        res.send(beerData);
    } catch (error) {
        console.error('Error fetching IPS record:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Export the getIPSBEER function
module.exports = getIPSBEER;
