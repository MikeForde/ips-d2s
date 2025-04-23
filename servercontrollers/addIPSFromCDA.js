const { convertCDAToSchema } = require('./servercontrollerfuncs/convertCDAToSchema');
const { upsertIPSRecord } = require('./MySQLHelpers/upsertIPSRecord');

async function addIPSFromCDA(req, res) {
    try {
        // Extract parsed CDA JSON from request body
        const cdaJSON = req.body;

        // Convert CDA JSON to IPS schema
        const ipsRecord = convertCDAToSchema(cdaJSON);

        // Add IPS record to MySQL and get the Mongo formatted response
        const mongoFormattedIPS = await upsertIPSRecord(ipsRecord);

        // emit the new/updated record
        const io = req.app.get('io');
        if (io) {
            io.emit('ipsUpdated', mongoFormattedIPS);
        }

        res.status(201).json(mongoFormattedIPS);
    } catch (err) {
        console.error('Error processing CDA:', err);
        res.status(400).send('Error processing CDA XML');
    }
}

module.exports = { addIPSFromCDA };