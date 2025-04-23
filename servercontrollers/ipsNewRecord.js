const { upsertIPSRecord } = require('./MySQLHelpers/upsertIPSRecord');

async function addIPS(req, res) {
    console.log("req.body", req.body);

    try {
        const mongoFormattedIPS = await upsertIPSRecord(req.body);
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
                return await upsertIPSRecord(ipsData);
            })
        );

        // emit the new/updated record
        const io = req.app.get('io');
        if (io) {
            io.emit('ipsUpdated', createdIPSRecords);
        }

        res.json(createdIPSRecords);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = { addIPS, addIPSMany };


