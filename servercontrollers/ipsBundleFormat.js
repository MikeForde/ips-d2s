const { IPSModel } = require('../models/IPSModel');
const { generateIPSBundle } = require('./servercontrollerfuncs/generateIPSBundle');
const { validate: isValidUUID } = require('uuid');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

function getIPSBundle(req, res) {
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

    // Execute the query
    query.then(async (ips) => {
        if (!ips) {
            return res.status(404).json({ message: "IPS record not found" });
        }

        // Transform the IPS record to the desired format
        const transformedIps = await SQLToMongoSingle(ips);

        // Constructing the JSON structure
        const bundle = generateIPSBundle(transformedIps);

        res.json(bundle);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
}

module.exports = { getIPSBundle };
