const { IPSModel } = require('../models/IPSModel');
const { Op } = require('sequelize');
const {SQLToMongo} = require('./MySQLHelpers/SQLToMongo');

function getIPSSearch(req, res) {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ message: "Name query parameter is required" });
    }

    IPSModel.findAll({
        where: {
            patientName: {
                [Op.like]: `%${name}%`
            }
        }
    })
    .then(async (ipss) => {
        if (!ipss.length) {
            return res.status(404).json({ message: "No matching IPS records found" });
        }

        console.log(ipss);

        const transformedIpss = await SQLToMongo(ipss);

        console.log(transformedIpss);
        res.json(transformedIpss);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
}

module.exports = { getIPSSearch };
