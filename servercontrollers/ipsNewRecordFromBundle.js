const { convertIPSBundleToSchema } = require('./servercontrollerfuncs/convertIPSBundleToSchema');
const { addIPSRecord } = require('./MySQLHelpers/addIPSRecord');

async function addIPSFromBundle(req, res) {
    // Extract IPS Bundle from request body
    const ipsBundle = req.body;

    try {
        // Convert IPS Bundle to desired schema
        const ipsRecord = convertIPSBundleToSchema(ipsBundle);

        console.log(ipsRecord);

        // Add IPS record to MySQL and get the Mongo formatted response
        const mongoFormattedIPS = await addIPSRecord(ipsRecord);

        res.json(mongoFormattedIPS);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { addIPSFromBundle };

