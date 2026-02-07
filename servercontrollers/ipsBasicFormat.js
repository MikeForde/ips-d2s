const { resolveId } = require('../utils/resolveId');
const { generateIPSBasic } = require('./servercontrollerfuncs/generateIPSBasic');

// Define the getIPSBasic function
async function getIPSBasic(req, res) {
    const id = req.params.id;
    
    try {
        // Resolve the ID and fetch the IPS record
        const ipsRecord = await resolveId(id);

        // If the record is not found, return a 404 error
        if (!ipsRecord) {
            return res.status(404).send('IPS record not found');
        }

         const basicText = generateIPSBasic(ipsRecord);

        res.set('Content-Type', 'text/plain');
        res.send(basicText);
    } catch (error) {
        console.error('Error fetching IPS record:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Export the getIPSBasic function
module.exports = { getIPSBasic };
