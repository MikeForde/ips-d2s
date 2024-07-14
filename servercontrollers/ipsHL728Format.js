const { IPSModel } = require('../models/IPSModel');
const { validate: isValidUUID } = require('uuid');
const { generateIPSHL72_8 } = require('./servercontrollerfuncs/generateIPSHL72_8');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

// Define the getIPSHL72_8 function
const getIPSHL72_8 = async (req, res) => {
    const { id } = req.params;
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
            return res.status(404).send('IPS record not found');
        }

        // Transform the IPS record to the desired format
        const transformedIpsRecord = await SQLToMongoSingle(ipsRecord);

        // Convert the IPS record to HL7 2.8 format
        const hl728Data = generateIPSHL72_8(transformedIpsRecord);

        // Send the plain text response
        res.set('Content-Type', 'text/plain');
        res.send(hl728Data);
    } catch (error) {
        console.error('Error fetching HL7 2.8 record format:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Export the getIPSHL72_8 function
module.exports = getIPSHL72_8;

