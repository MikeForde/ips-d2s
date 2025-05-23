const { convertIPSBundleToSchema } = require('./servercontrollerfuncs/convertIPSBundleToSchema');
const { convertFhirXmlToJson } = require('./servercontrollerfuncs/convertFHIRXMLtoJSON');

function convertIPSToMongo(req, res) {
  try {
    let ipsBundle;

    // 1) If we have a direct JSON object with resourceType 'Bundle', assume it's already JSON FHIR
    if (
      req.body &&
      typeof req.body === 'object' &&
      req.body.resourceType === 'Bundle'
    ) {
      console.log('Handling direct JSON request');
      ipsBundle = req.body;
    }

    // 2) Otherwise assume the request body has a "data" field containing JSON as a string
    else if (req.body && req.body.data) {
      console.log("Handling 'data' field with JSON string");
      ipsBundle = JSON.parse(req.body.data);
    }

    // 3) If there's only one key and no resourceType, assume we've been given FHIR XML (as JS object).
    //    We then convert it to JSON.
    else if (
      req.body &&
      typeof req.body === 'object' &&
      !req.body.resourceType &&
      Object.keys(req.body).length === 1
    ) {
      console.log('Handling XML -> JSON conversion');
      ipsBundle = convertFhirXmlToJson(req.body);
    }

    // If none of the above conditions matched, it’s an unexpected format
    else {
      throw new Error('Unrecognized request body format');
    }

    // Now convert the JSON "ipsBundle" to the NoSQL schema
    const ipsRecord = convertIPSBundleToSchema(ipsBundle);
    res.json(ipsRecord);

  } catch (error) {
    console.error('Error converting IPS to NoSQL:', error);
    res.status(500).send('Error converting IPS to NoSQL');
  }
}

module.exports = { convertIPSToMongo };