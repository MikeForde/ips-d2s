const { validate: isValidUUID } = require('uuid');
const { IPSModel } = require('../models/IPSModel');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

// Define the getIPSRaw function
async function getIPSRaw(req, res) {
  const id = req.params.id;
  let query;

  // Check if the provided ID is a valid UUID
  if (isValidUUID(id)) {
    // Search using packageUUID if it is a valid UUID
    query = IPSModel.findOne({ where: { packageUUID: id } });
  } else {
    // Otherwise, search by primary key (id)
    query = IPSModel.findByPk(id);
  }

  try {
    const ips = await query;

    if (!ips) {
      return res.status(404).json({ message: "IPS record not found" });
    }

    // Transform the IPS record to the desired format
    const transformedIps = await SQLToMongoSingle(ips);

    if (req.query.pretty === 'true') {
      // Return formatted JSON with indentation for readability
      const formattedJson = JSON.stringify(transformedIps, null, "\t");
      res.send(formattedJson);
    } else {
      // Return JSON without formatting
      res.json(transformedIps);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

// Define the getAllIPS function
function getAllIPS(req, res) {
  IPSModel.findAll()
    .then((ipss) => {
      res.json(ipss);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

module.exports = { getIPSRaw, getAllIPS };
