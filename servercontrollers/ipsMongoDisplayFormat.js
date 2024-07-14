const { validate: isValidUUID } = require('uuid');
const { IPSModel } = require('../models/IPSModel');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function getMongoFormatted(req, res) {
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

    // Format the response data
    const formattedData = {
      packageUUID: transformedIps.packageUUID,
      timeStamp: transformedIps.timeStamp,
      patient: {
        name: transformedIps.patient.name,
        given: transformedIps.patient.given,
        dob: transformedIps.patient.dob,
        gender: transformedIps.patient.gender,
        practitioner: transformedIps.patient.practitioner,
        nation: transformedIps.patient.nation,
        organization: transformedIps.patient.organization
      },
      medication: transformedIps.medication.map(med => ({
        name: med.name,
        date: med.date,
        dosage: med.dosage
      })),
      allergies: transformedIps.allergies.map(allergy => ({
        name: allergy.name,
        criticality: allergy.criticality, 
        date: allergy.date
      })),
      conditions: transformedIps.conditions.map(condition => ({
        name: condition.name,
        date: condition.date
      })),
      observations: transformedIps.observations.map(observation => ({
        name: observation.name,
        date: observation.date,
        value: observation.value
      }))
    };

    if (req.query.pretty === 'true') {
      // Return formatted JSON with indentation for readability
      const formattedJson = JSON.stringify(formattedData, null, "\t");
      res.send(formattedJson);
    } else {
      // Return JSON without formatting
      res.json(formattedData);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = { getMongoFormatted };
