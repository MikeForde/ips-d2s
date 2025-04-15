// Desc: Controller function to convert CDA JSON to IPS JSON format
const { convertCDAToSchema } = require('./servercontrollerfuncs/convertCDAToSchema');
const { pickIPSFormat } = require('../utils/ipsFormatPicker');

async function convertCDAToIPS(req, res) {
    try {
        // Extract parsed CDA JSON from request body
        const cdaJSON = req.body;

        // Convert CDA JSON to IPS schema
        const ipsRecord = convertCDAToSchema(cdaJSON);
        const generateBundleFunction = pickIPSFormat(req.headers['x-ips-format']);
        const ipsBundle = generateBundleFunction(ipsRecord);
        res.json(ipsBundle);
    } catch (error) {
        console.error('Error converting CDA to IPS FHiR JSON format:', error);
        res.status(500).send('Error converting CDA to IPS FHiR JSON format');
    }
}

module.exports = { convertCDAToIPS };