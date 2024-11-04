const axios = require('axios');

async function postIPSBundle(req, res) {
  const ipsBundle = req.body;

  try {
    const response = await axios.post('https://4202xiwc.offroadapps.dev:62444/Fhir/ips/json', ipsBundle);
    //const response = await axios.post('https://ips-d2s-uksc-medsnomed-medsno.apps.ocp1.azure.dso.digital.mod.uk/ipsbundle/', ipsBundle);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { postIPSBundle };
