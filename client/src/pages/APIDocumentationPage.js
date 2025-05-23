import React from 'react';
import { Table, Container, Alert } from 'react-bootstrap';

function APIDocumentationPage() {
  // Define the API endpoints information
  const apiEndpoints = [
    { method: 'POST', endpoint: '/ips', description: 'Create a new IPS record.', request: 'MongoDb JSON object representing the new IPS record.', response: 'MongoDb JSON object of the created IPS record.' },
    { method: 'POST', endpoint: '/ipsmany', description: 'Create multiple IPS records.', request: 'Array of MongoDb JSON objects representing the new IPS records', response: 'Array of MongoDb JSON objects of the created IPS records.' },
    { method: 'POST', endpoint: '/ipsbundle', description: 'Create IPS records from an IPS Bundle.', request: 'IPS Bundle - JSON', response: 'MongoDb - JSON as confirmation of record creation.' },
    { method: 'POST', endpoint: '/pushipsora', description: 'Push IPS data to an external ORA system.', request: 'IPS Bundle - JSON', response: 'Response from the ORA system.' },
    { method: 'POST', endpoint: '/pushipsnld', description: 'Push IPS data to an external NLD system.', request: 'IPS Bundle - JSON', response: 'Response from the NLD system.' },
    { method: 'POST', endpoint: '/ipsfrombeer', description: 'Create MongoDb IPS records from BEER format.', request: 'BEER - Plain Text', response: 'MongoDb - JSON as confirmation of record creation.' },
    { method: 'POST', endpoint: '/ipsfromcda', description: 'Create MongoDb IPS records from CDA XML format.', request: 'CDA - XML', response: 'MongoDb - JSON as confirmation of record creation.' },
    { method: 'POST', endpoint: '/ipsfromhl72x', description: 'Create MongoDb IPS records from HL7 2.x format.', request: 'HL7 2.x - Plain Text', response: 'MongoDb - JSON as confirmation of record creation.' },
    { method: 'POST', endpoint: '/convertmongo2beer', description: 'Convert MongoDB format to BEER format.', request: 'MongoDB - JSON', response: 'BEER - Plain Text' },
    { method: 'POST', endpoint: '/convertmongo2hl7', description: 'Convert MongoDB format to HL7 2.3 format.', request: 'MongoDB - JSON', response: 'HL7 2.3 - Plain Text' },
    { method: 'POST', endpoint: '/convertbeer2mongo', description: 'Convert BEER format to MongoDB format.', request: 'BEER - Plain Text', response: 'MongoDB - JSON' },
    { method: 'POST', endpoint: '/convertbeer2ips', description: 'Convert BEER format to IPS JSON format.', request: 'BEER - Plain Text', response: '*Unified IPS format - JSON' },
    { method: 'POST', endpoint: '/convertips2beer', description: 'Convert IPS JSON format to BEER format.', request: 'IPS Bundle - JSON', response: 'BEER - Plain Text' },
    { method: 'POST', endpoint: '/convertcdatoips', description: 'Convert CDA XML format to IPS JSON format.', request: 'CDA - XML', response: '*Unified IPS format - JSON' },
    { method: 'POST', endpoint: '/convertcdatobeer', description: 'Convert CDA XML format to BEER format.', request: 'CDA - XML', response: 'BEER - Plain Text' },
    { method: 'POST', endpoint: '/convertcdatomongo', description: 'Convert CDA XML format to MongoDB format.', request: 'CDA - XML', response: 'MongoDB - JSON' },
    { method: 'POST', endpoint: '/converthl72xtomongo', description: 'Convert HL7 2.x format to MongoDB format.', request: 'HL7 2.x - Plain Text', response: 'MongoDB - JSON' },
    { method: 'POST', endpoint: '/converthl72xtoips', description: 'Convert HL7 2.x format to IPS JSON format.', request: 'HL7 2.x - Plain Text', response: '*Unified IPS format - JSON' },
    { method: 'POST', endpoint: '/convertxml', description: 'Generic convert XML format to JSON format.', request: 'XML', response: 'JSON' },
    { method: 'POST', endpoint: '/convertfhirxml', description: 'Convert FHIR XML format to FHIR JSON format.', request: 'FHIR XML', response: 'FHIR JSON' },
    { method: 'GET', endpoint: '/ips/all', description: 'Retrieve all IPS records.', request: 'None.', response: 'Array of JSON objects representing IPS records.' },
    { method: 'GET', endpoint: '/ipsraw/:id', description: 'Retrieve raw IPS record by ID.', request: 'IPS record ID as URL parameter.', response: 'JSON object of the raw IPS record.' },
    { method: 'GET', endpoint: '/ipsmongo/:id', description: 'Retrieve IPS record in MongoDB format by ID.', request: 'IPS record ID as URL parameter.', response: 'MongoDB - JSON' },
    { method: 'GET', endpoint: '/ips/:id', description: 'Retrieve IPS record in expanded format by ID.', request: 'IPS record ID as URL parameter.', response: 'Expanded Composition IPS format- FHiR JSON' },
    { method: 'GET', endpoint: '/ipsbasic/:id', description: 'Retrieve IPS record in basic format by ID.', request: 'IPS record ID as URL parameter.', response: 'Basic format - Plain Text' },
    { method: 'GET', endpoint: '/ipsbeer/:id/:delim?', description: 'Retrieve IPS record in BEER format by ID with optional delimiter.', request: 'IPS record ID and optional delimiter as URL parameters.', response: 'BEER - Plain Text' },
    { method: 'GET', endpoint: '/ipshl72x/:id', description: 'Retrieve IPS record in HL7 2.3 format by ID.', request: 'IPS record ID as URL parameter.', response: 'HL7 2.3 - Plain Text' },
    { method: 'GET', endpoint: '/ipsxml/:id', description: 'Retrieve IPS record in expanded FHiR XML format by ID.', request: 'IPS record ID as URL parameter.', response: 'IPS Bundle - FHiR XML' },
    { method: 'GET', endpoint: '/ipslegacy/:id', description: 'Retrieve IPS record in legacy format by ID.', request: 'IPS record ID as URL parameter.', response: 'Legacy format of the IPS record - FHiR JSON' },
    { method: 'GET', endpoint: '/ipsunified/:id', description: 'Retrieve IPS record in compact unified format by ID.', request: 'IPS record ID as URL parameter.', response: 'Unified IPS format - FHiR JSON' },
    { method: 'GET', endpoint: '/ipsbyname/:name/:given', description: 'Retrieve expanded IPS FHiR by patient name and given name. Case insensitive.', request: 'Patient name and given name as URL parameters.', response: '*Unified IPS format - FHiR JSON' },
    { method: 'GET', endpoint: '/ips/search/:name', description: 'Search IPS records by patient name.', request: 'Patient name as URL parameter.', response: 'Array of JSON objects representing IPS records.' },
    { method: 'GET', endpoint: '/fetchipsora/:name/:givenName', description: 'Fetch IPS data from ORA by patient name and given name.', request: 'Patient name and given name as URL parameters.', response: 'JSON object from ORA system.' },
    { method: 'PUT', endpoint: '/ips/:id', description: 'Update an IPS record by ID.', request: 'Partial JSON object representing the updated IPS record.', response: 'MongoDB object of the updated IPS record - JSON' },
    { method: 'PUT', endpoint: '/ipsuuid/:uuid', description: 'Update an IPS record by UUID.', request: 'Partial JSON object representing the updated IPS record.', response: 'MongoDB object of the updated IPS record - JSON' },
    { method: 'DELETE', endpoint: '/ips/:id', description: 'Delete an IPS record by ID.', request: 'IPS record ID as URL parameter.', response: 'Confirmation of deletion.' },
    {
      method: 'GET',
      endpoint: '/xmpp/test-send-message',
      description: 'Send a test message to the configured XMPP group chat.',
      request: 'Optional query parameter ?msg=some text to customize the message',
      response: 'A text response indicating success.'
    },
    {
      method: 'POST',
      endpoint: '/xmpp/xmpp-post',
      description: 'Send a message to the XMPP group chat, optionally specifying a custom room.',
      request: 'JSON body: { "msg": "<message text>", "room": "<roomJid>" } (room is optional)',
      response: 'JSON response with status, the target room, and the message sent.'
    },
    {
      method: 'POST',
      endpoint: '/xmpp/xmpp-ips',
      description: 'Fetch an IPS record by ID and broadcast it (as plain text) to the configured XMPP group chat.',
      request: 'JSON body: { "id": "<IPS record ID>" }',
      response: 'JSON response confirming the record was retrieved and sent.'
    },
    {
      method: 'POST',
      endpoint: '/xmpp/xmpp-ips-private',
      description: 'Fetch an IPS record by ID and send it privately (type="chat") to a specific occupant.',
      request: 'JSON body: { "id": "<IPS record ID>", "from": "<occupant name or user>" }',
      response: 'JSON response confirming the record was retrieved and sent privately.'
    },
    {
      method: 'POST',
      endpoint: '/tak/test',
      description: 'Sends a test CoT message. A custom CoT message can be provided via the "cot" property in the JSON body.',
      request: 'JSON: { "cot": "<CoT XML message>" }',
      response: 'JSON: { "message": "<result>" }'
    },
    {
      method: 'POST',
      endpoint: '/tak/ips',
      description: 'Resolves an IPS record by id (either packageUUID or ObjectId), compresses it into a gzipped, Base64-encoded payload, and embeds it in the custom <ipsData> element of a CoT message.',
      request: 'JSON: { "id": "<IPS record ID or packageUUID>" }',
      response: 'JSON: { "message": "<result>", "cot": "<Complete CoT message with <ipsData> element>" }'
    },
    {
      method: 'GET',
      endpoint: '/tak/browser/:id',
      description: 'Returns an HTML page with nicely formatted IPS record details for display in a browser, using the IPS record identified by packageUUID.',
      request: 'URL parameter: id (IPS record ID/packageUUID)',
      response: 'HTML page with formatted IPS record details (patient info, medications, etc.)'
    }
  ];

  // Additional instructions for encryption, compression, and raw binary usage
  const encodingEncryptionInstructions = [
    {
      feature: 'AES-256 Encryption',
      incoming: (
        <>
          - Include header <code>X-Encrypted: true</code> for AES-256-encrypted requests.
          <br />- Encrypt your payload with AES-256 before sending.
          <br />- Default format is <code>hex</code> for <em>encryptedData</em>, <em>iv</em>, and <em>mac</em>.
          <br />- To send in Base64, include header <code>Content-Encoding: base64</code>.
        </>
      ),
      outgoing: (
        <>
          - Include header <code>Accept-Encryption: aes256</code> if you want the response encrypted.
          <br />- Default format is <code>hex</code>.
          <br />- To receive Base64, include <code>Accept-Encoding: base64</code>.
        </>
      ),
    },
    {
      feature: 'Combined (AES-256 + Gzip)',
      incoming: (
        <>
          - Use <code>Content-Encoding: gzip</code> <em>and</em> <code>X-Encrypted: true</code>.
          <br />- Compress your payload with gzip, then encrypt via AES-256.
          <br />- If using Base64, set <code>Content-Encoding: gzip, base64</code>.
        </>
      ),
      outgoing: (
        <>
          - Use <code>Accept-Encoding: gzip</code> <em>and</em> <code>Accept-Encryption: aes256</code>.
          <br />- The server gzips the response first, then encrypts.
          <br />- Add <code>base64</code> in <code>Accept-Encoding</code> if you need Base64 output.
        </>
      ),
    },
    {
      feature: 'Raw Binary (IV + MAC + Gzipped Data)',
      incoming: (
        <>
          - Set <code>Content-Type: application/octet-stream</code>.
          <br />- The payload <strong>must</strong> start with a 16-byte IV, followed by a 16-byte HMAC, and then the gzipped+encrypted data.
          <br />- The server will verify HMAC, decrypt using AES-256-CBC, then decompress.
          <br />- No JSON or Base64 fields are required in the body.
        </>
      ),
      outgoing: (
        <>
          - Set <code>Accept: application/octet-stream</code> to get a binary response.
          <br />- The server will compress, encrypt, and prepend 16-byte IV + 16-byte MAC to the payload.
          <br />- The response has <code>Content-Type: application/octet-stream</code>, and <code>X-Encrypted: true</code>.
          <br />- You can save this binary file and send it back in future requests.
        </>
      ),
    },
  ];

  return (
    <Container className="mt-5">
      <h2>API Documentation</h2>
      
      {/* Added Explanation of Documentation Endpoints */}
      <Alert variant="info">
        <h4>Developer Documentation Endpoints</h4>
        <p>
          For interactive REST API documentation and testing, please visit our Swagger UI at{' '}
          <a href="/docs" target="_blank" rel="noopener noreferrer"><code>/docs</code></a>.
        </p>
        <p>
          For interactive GraphQL API testing and introspection, please visit our Apollo GraphQL Playground at{' '}
          <a href="/playground" target="_blank" rel="noopener noreferrer"><code>/playground</code></a>.
        </p>
        <p>
          Note: These endpoints are enabled during development and may be restricted in production environments.
        </p>
      </Alert>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Description</th>
            <th>Request</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {apiEndpoints.map((endpoint, index) => (
            <tr key={index}>
              <td>{endpoint.method}</td>
              <td>{endpoint.endpoint}</td>
              <td>{endpoint.description}</td>
              <td>{endpoint.request}</td>
              <td>{endpoint.response}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="mt-5">Encoding and Encryption Usage</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Instructions for Incoming Requests</th>
            <th>Instructions for Outgoing Responses</th>
          </tr>
        </thead>
        <tbody>
          {encodingEncryptionInstructions.map((row, index) => (
            <tr key={index}>
              <td>{row.feature}</td>
              <td>{row.incoming}</td>
              <td>{row.outgoing}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="mt-5">*IPS Unified Format</h3>
      <p>
        The more expanded composition FHiR JSON format can be obtained instead for the marked API calls by using the optional header <code>x-ips-format: inter</code>. Likewise, the legacy format with <code>x-ips-format: legacy</code> is retained for comparison.
      </p>

      <h3 className="mt-5">TAK Endpoints</h3>
      <p>
        The <code>/tak/...</code> endpoints are used for TAK integration. Note that these features require a TAK server and that the <code>certs</code> folder contains the necessary truststore and client PEM files (converted from p12 files). The ability to view IPS data on ATAK or WinTAK platforms also depends on having the respective IPS plugin installed.
      </p>
    </Container>
  );
}

export default APIDocumentationPage;