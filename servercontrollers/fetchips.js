const axios = require('axios');

// Approved external IPS endpoints.
// The client sends only the key - never the URL.
const endpointMap = {
  'ips-mern': 'https://ipsmern-dep.azurewebsites.net/ipsbyname',
  'vitalsiq': 'https://4202xiwc.offroadapps.dev:62444/Fhir/ips/json',
  'ips-sern-d2s': 'https://ips-d2s-uksc-medsnomed-medsno.apps.ocp1.azure.dso.digital.mod.uk/ipsbyname',
};

const getIPSBundleGeneric = async (req, res) => {
  const { target, name, givenName } = req.query;

  if (!target || !name || !givenName) {
    return res.status(400).json({
      error: 'Missing required query parameters'
    });
  }

  const endpoint = endpointMap[target];

  if (!endpoint) {
    return res.status(400).json({
      error: 'Invalid target endpoint'
    });
  }

  // Encode user-controlled path components so ?, #, / etc.
  // cannot alter the outgoing URL structure.
  const safeName = encodeURIComponent(name);
  const safeGivenName = encodeURIComponent(givenName);

  const fullUrl = `${endpoint}/${safeName}/${safeGivenName}`;

  console.log(`Fetching IPS data from target ${target}: ${fullUrl}`);

  try {
    const response = await axios.get(fullUrl, {
      // Important SSRF defence:
      // don't allow an approved endpoint to redirect Axios somewhere internal.
      maxRedirects: 0,
      timeout: 10000,
    });

    res.json(response.data);

  } catch (error) {
    console.error(
      `Error fetching IPS data from target ${target}:`,
      error.message
    );

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data
      });
    } else {
      res.status(500).json({
        error: error.message
      });
    }
  }
};

module.exports = { getIPSBundleGeneric };