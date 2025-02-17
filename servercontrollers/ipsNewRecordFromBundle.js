const { convertIPSBundleToSchema } = require('./servercontrollerfuncs/convertIPSBundleToSchema');
const { addIPSRecord } = require('./MySQLHelpers/addIPSRecord');

async function addIPSFromBundle(req, res) {
    // Extract IPS Bundle from request body
    try {
        // If the header fhirxml is set to "true", assume the payload is FHIR XML.
        // check if req.body is a string starting with "<" if needed
        if (
            req.body &&
            typeof req.body === 'object' &&
            !req.body.resourceType &&
            Object.keys(req.body).length === 1
        ) {
            req.body = convertFhirXmlToJson(req.body);
            console.log("Converted incoming FHIR XML to IPS JSON");
        }

        const ipsBundle = req.body;
        // Convert IPS Bundle to desired schema
        const ipsRecord = convertIPSBundleToSchema(ipsBundle);

        console.log(ipsRecord);

        // Add IPS record to MySQL and get the Mongo formatted response
        const mongoFormattedIPS = await addIPSRecord(ipsRecord);

        res.json(mongoFormattedIPS);
    } catch (error) {
        console.error("Error in addIPSFromBundle:", error);
        res.status(500).json({ error: "Failed to add IPS record" });
    }
}

module.exports = { addIPSFromBundle };

