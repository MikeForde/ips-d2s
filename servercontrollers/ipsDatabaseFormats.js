const { resolveId } = require('../utils/resolveId');
const { IPSModel, Medication, Allergy, Condition, Observation, Immunization, Procedure } = require('../models/IPSModel');
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
        { model: Immunization, as: 'immunizations' },
        { model: Procedure, as: 'procedures' }
      ]
    });
    
    const mongoFormattedIPSs = await SQLToMongo(ipss);
    res.json(mongoFormattedIPSs);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

async function getAllIPSList(req, res) {
  try {
    const ipss = await IPSModel.find(
      {},
      { packageUUID: 1, "patient.given": 1,"patient.name": 1, _id: 0 }  // projection
    )
      .sort({ "patient.name": 1, "patient.given": 1 }) // optional but nice for UI
      .lean()
      .exec();

    const mongoFormattedIPSs = await SQLToMongo(ipss);

    // Optionally normalize fields to the exact shape you want on Android
    const list = mongoFormattedIPSs.map(x => ({
      packageUUID: x.packageUUID,
      given: x.patient?.given ?? "",
      name: x.patient?.name ?? ""
    }));

    res.json(list);
  } catch (error) {
    console.error("Error fetching IPS list:", error);
    res.status(400).send(error.message || "Invalid request");
  }
}

module.exports = { getIPSRaw, getAllIPS, getAllIPSList };
