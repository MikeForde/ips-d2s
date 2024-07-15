const { parseBEER } = require('./servercontrollerfuncs/convertIPSBEERToSchema');
const { addIPSRecord } = require('./MySQLHelpers/addIPSRecord');

async function addIPSFromBEER(req, res) {
    // Extract IPS Bundle from request body
    const ipsBEER = req.body;
    console.log(req.body);

    const delimiter = req.query.delim || 'newline';

    try {
        // Convert IPS BEER to desired schema
        const ipsRecord = parseBEER(ipsBEER, delimiter);

        // Add IPS record to MySQL and get the Mongo formatted response
        const mongoFormattedIPS = await addIPSRecord(ipsRecord);

        res.json(mongoFormattedIPS);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { addIPSFromBEER };
