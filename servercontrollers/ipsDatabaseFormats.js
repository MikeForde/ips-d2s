const { resolveId } = require('../utils/resolveId');
const { IPSModel, Medication, Allergy, Condition, Observation, Immunization } = require('../models/IPSModel');
const { SQLToMongo } = require('./MySQLHelpers/SQLToMongo');

// Define the getIPSRaw function
async function getIPSRaw(req, res) {
  const id = req.params.id;
  let query;

  try {
    // Resolve the ID and fetch the IPS record
    const ips = await resolveId(id);

    if (!ips) {
        return res.status(404).json({ message: "IPS record not found" });
    }

    if (req.query.pretty === 'true') {
      // Return formatted JSON with indentation for readability
      const formattedJson = JSON.stringify(ips, null, "\t");
      res.send(formattedJson);
    } else {
      // Return JSON without formatting
      res.json(transformedIps);
    }
  } catch (err) {
    console.error("Error fetching IPS record:", error);
    res.status(400).send(error.message || "Invalid request");
  }
}

// Define the getAllIPS function
async function getAllIPS(req, res) {
  try {
    const ipss = await IPSModel.findAll({
      include: [
        { model: Medication, as: 'medications' },
        { model: Allergy, as: 'allergies' },
        { model: Condition, as: 'conditions' },
        { model: Observation, as: 'observations' },
        { model: Immunization, as: 'immunizations' }
      ]
    });
    
    const mongoFormattedIPSs = await SQLToMongo(ipss);
    res.json(mongoFormattedIPSs);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

module.exports = { getIPSRaw, getAllIPS };
