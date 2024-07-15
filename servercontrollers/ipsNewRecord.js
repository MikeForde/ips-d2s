const { addIPSRecord } = require('./MySQLHelpers/addIPSRecord');

async function addIPS(req, res) {
    console.log("req.body", req.body);

    try {
        const mongoFormattedIPS = await addIPSRecord(req.body);
        res.json(mongoFormattedIPS);
    } catch (err) {
        res.status(400).send(err);
    }
}

async function addIPSMany(req, res) {
    console.log("req.body", req.body);

    try {
        const createdIPSRecords = await Promise.all(
            req.body.map(async ipsData => {
                // Create IPS record and associated records
                return await addIPSRecord(ipsData);
            })
        );

        res.json(createdIPSRecords);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = { addIPS, addIPSMany };


