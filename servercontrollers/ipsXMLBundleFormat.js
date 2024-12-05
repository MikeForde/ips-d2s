const { generateXMLBundle } = require('./servercontrollerfuncs/generateXMLBundle');
const { resolveId } = require('../utils/resolveId');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function getIPSXMLBundle(req, res) {
    const id = req.params.id;

    try {
        // Resolve the ID to find the appropriate IPS record
        const ipsRecord = await resolveId(id);

        if (!ipsRecord) {
            return res.status(404).json({ message: 'IPS record not found' });
        }

        // Transform the IPS record to the desired format
        const transformedIpsRecord = await SQLToMongoSingle(ipsRecord);

        // Constructing the XML structure
        const genXML = generateXMLBundle(transformedIpsRecord);

        res.set('Content-Type', 'application/xml');
        res.send(genXML);
    } catch (err) {
        console.error('Error fetching IPS XML bundle:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getIPSXMLBundle };
