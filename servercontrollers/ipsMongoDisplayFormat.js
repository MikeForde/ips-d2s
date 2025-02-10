const { resolveId } = require('../utils/resolveId');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function getMongoFormatted(req, res) {
  const {id} = req.params;

  try {
    // Resolve the ID and fetch the IPS record
    const ips = await resolveId(id);

    // If the record is not found, return a 404 error
    if (!ips) {
        return res.status(404).send('IPS record not found');
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
        dosage: med.dosage,
        system: med.system,
        code: med.code,
        status: med.status
      })),
      allergies: transformedIps.allergies.map(allergy => ({
        name: allergy.name,
        criticality: allergy.criticality, 
        date: allergy.date,
        system: allergy.system,
        code: allergy.code
      })),
      conditions: transformedIps.conditions.map(condition => ({
        name: condition.name,
        date: condition.date,
        system: condition.system,
        code: condition.code
      })),
      observations: transformedIps.observations.map(observation => ({
        name: observation.name,
        date: observation.date,
        value: observation.value,
        system: observation.system,
        code: observation.code,
        valueCode: observation.valueCode,
        bodySite: observation.bodySite
      })),
      immunizations: transformedIps.immunizations.map(immunization => ({
        name: immunization.name,
        system: immunization.system,
        date: immunization.date,
        code: immunization.code,
        status: immunization.status
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
