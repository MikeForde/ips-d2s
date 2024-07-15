const { convertCDAToSchema } = require('./servercontrollerfuncs/convertCDAToSchema');
const { addIPSRecord } = require('./MySQLHelpers/addIPSRecord');

async function addIPSFromCDA(req, res) {
    try {
        // Extract parsed CDA JSON from request body
        const cdaJSON = req.body;

        // Convert CDA JSON to IPS schema
        const ipsRecord = convertCDAToSchema(cdaJSON);

        // Add IPS record to MySQL and get the Mongo formatted response
        const mongoFormattedIPS = await addIPSRecord(ipsRecord);

        res.status(201).json(mongoFormattedIPS);
    } catch (err) {
        console.error('Error processing CDA:', err);
        res.status(400).send('Error processing CDA XML');
    }
}

module.exports = { addIPSFromCDA };