// xmpp/xmppIPSPlainText.js

const { resolveId } = require('../utils/resolveId');
const { generateXMPPPlainText } = require('../servercontrollers/servercontrollerfuncs/generateXMPPPlainText');

/**
 * Helper to format a Date object as "yyyy-mm-dd HH:MM:SS"
 * (e.g. 2024-08-05 06:33:26)
 */
// function formatTimestamp(dateObj) {
//   // Convert to ISO string, then parse out date/time
//   const iso = dateObj.toISOString();         // e.g. "2024-08-05T06:33:26.123Z"
//   const datePart = iso.substring(0, 10);     // "2024-08-05"
//   const timePart = iso.substring(11, 19);    // "06:33:26"
//   return `${datePart} ${timePart}`;
// }

/**
 * Fetch an IPS record by ID and convert it to a plain text string
 * in your desired format.
 */
async function getIPSPlainText(id) {
  // 1) Resolve the ID and fetch the IPS record
  const ipsRecord = await resolveId(id);
  if (!ipsRecord) {
    return null; // Not found
  }

  // Transform the IPS record to the desired format
  const transformedIps = await SQLToMongoSingle(ips);

  // 2) Construct a plain text output
  return generateXMPPPlainText(transformedIps);
}

module.exports = {
  getIPSPlainText,
};