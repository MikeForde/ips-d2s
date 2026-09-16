const axios = require('axios');

// Approved external push targets.
// The client sends only the key - never the URL.
const endpointMap = {
  'ips-mern': 'https://ipsmern-dep.azurewebsites.net/ipsbundle',
  'nld': 'https://medicalcloud.orange-synapse.nl/api/fhir/1',
  'vitalsiq': 'https://4202xiwc.offroadapps.dev:62444/Fhir/ips/json',
};

async function postIPSBundleUnified(req, res) {
  const { ipsBundle, target, dataFormat, hl7Wrapper } = req.body;
  // Optionally, transform ipsBundle based on dataFormat if needed.

  const endpoint = endpointMap[target];

  if (!endpoint) {
    return res.status(400).json({ error: 'Invalid target endpoint' });
  }

  try {
    const response = await axios.post(endpoint, ipsBundle, {
      // Important SSRF defence:
      // don't allow an approved endpoint to redirect Axios somewhere internal.
      maxRedirects: 0,
      timeout: 10000,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { postIPSBundleUnified };