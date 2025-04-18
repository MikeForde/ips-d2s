# IPS D2S Project

This project is a SERN (SQL, Express, React, Node.js) stack application designed to manage and manipulate IPS (International Patient Summary) records. It includes features to convert between Database Native, BEER, and IPS JSON formats, and supports various CRUD operations on IPS data. 

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
- [API Documentation](#api-documentation)
  - [POST Endpoints](#post-endpoints)
  - [GET Endpoints](#get-endpoints)
  - [PUT Endpoints](#put-endpoints)
  - [DELETE Endpoints](#delete-endpoints)
- [Gzip Support](#gzip-support)
- [AES-256 Support](#aes-256-encryption-support)
- [Client-Side Pages](#client-side-pages)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application allows healthcare providers to create, update, delete, and convert patient records stored in SQL (MySQL). The records can be converted into different formats, including BEER (Basic Emergency Exchange Record) and IPS JSON, to facilitate data sharing and interoperability.

## Features

- **CRUD Operations**: Create, Read, Update, Delete IPS records.
- **Format Conversion**: Convert IPS records between MongoDB, BEER, and IPS JSON formats.
- **API Endpoints**: Comprehensive set of endpoints to manage IPS records.
- **Responsive Frontend**: User-friendly interface for managing and converting records.
- **Search and Filter**: Find records by various attributes.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ips-d2s.git
   cd ips-d2s
   ```

2. Install server dependencies:

  ```bash
  cd server
  npm install
  ```

3. Install client dependencies:

  ```bash
  cd ../client
  npm install
  ```

4. Set up environment variables:

Create a .env file in the server directory with the following content with your own settings:
```
  DB_USER=
  DB_PASSWORD=
  DB_NAME=
  DB_HOST=host.docker.internal (if using docker MySQL instance)
  ```

5. Start the development server:

  ```bash
  cd ../server
  npm run dev
  ```

6. Start the React development server:

  ```bash
  cd ../client
  npm start
  ```

## API Documentation

### POST Endpoints

| Endpoint                        | Description                                         | Request Body                                                                                                    | Response                             |
|---------------------------------|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `/ips`                          | Add a new IPS record.                                | MongoDb IPS Record | The created IPS record.             |
| `/ipsmany`                      | Add multiple IPS records.                           | Multiple MongoDb IPS Records | Array of created IPS records.        |
| `/ipsbundle`                    | Add IPS records from a bundle.                      | IPS JSON Bundle | The created IPS record.              |
| `/pushipsora`                   | Push IPS records to an ORA system.                  | IPS JSON Bundle | Response from the ORA system.                      |
| `/pushipsnld`                   | Push IPS records to an ORA system.                  | IPS JSON Bundle | Response from the NLD system.                      |
| `/ipsfrombeer`                  | Add IPS records from BEER format.                   | BEER as Plain Text  | The created IPS record.              |
| `/ipsfromcda`                  | Add IPS records from CDA XML format.                   | CDA as XML  | The created IPS record.              |
| `/ipsfromhl72x`                  | Add IPS records from HL7 2.x format.                   | HL7 2.x as Plain Text  | The created IPS record.              |
| `/convertmongo2beer`            | Convert a MongoDB IPS record to BEER format.        | Mongo IPS Record | The BEER formatted data.             |
| `/convertmongo2hl7`             | Convert a MongoDB IPS record to HL7 2.3 format.     | Mongo IPS Record | The HL7 2.3 formatted data.          |
| `/convertbeer2mongo`            | Convert a BEER IPS record to MongoDB format.        | BEER as Plain Text  | MongoDB formatted data.              |
| `/convertbeer2ips`              | Convert a BEER IPS record to IPS JSON format.       | BEER as Plain Text | IPS JSON formatted data.             |
| `/convertips2beer`              | Convert an IPS JSON record to BEER format.          | IPS JSON Bundle | BEER formatted data.                 |
| `/convertcdatoips`              | Convert CDA XML format to IPS JSON Bundle.          | CDA XML Bundle | IPS JSON formatted data.             |
| `/convertcdatobeer`             | Convert CDA XML format to BEER format.              | CDA XML Bundle | BEER formatted data.                 |
| `/convertcdatomongo`             | Convert CDA XML format to MongoDb format.              | CDA XML Bundle | MongoDb - JSON                 |
| `/converthl72xtomongo`          | Convert HL7 2.x format to MongoDB format.           | HL7 2.x - Plain Text | MongoDB - JSON                       |
| `/converthl72xtoips`            | Convert HL7 2.x format to IPS JSON format.          | HL7 2.x - Plain Text | IPS Bundle - JSON                    |
| `/convertxml`            | Generic convert XML format to JSON format.          | XML | JSON                    |
| `/convertfhirxml`            | Convert FHiR XML format to FHiR JSON format.          | FHiR XML | FHiR JSON                    |

### GET Endpoints

| Endpoint                        | Description                                         | Response                              |
|---------------------------------|-----------------------------------------------------|---------------------------------------|
| `/ips/all`                      | Retrieve all IPS records.                           | Array of MongoDb IPS records.                 |
| `/ipsraw/:id`                   | Retrieve IPS record in default MongoDb format by ID.            | Default MongoDb IPS data.                         |
| `/ipsmongo/:id`                 | Retrieve IPS record in presentation format by ID.        | Presentation formatted IPS data.           |
| `/ips/:id`                      | Retrieve Expanded IPS JSON Bundle by its ID.                 | The Expanded IPS JSON Bundle format.           |
| `/ipsbasic/:id`                 | Retrieve basic IPS Bundle by ID.                    | Basic IPS data.                       |
| `/ipsbeer/:id/:delim?`          | Retrieve IPS Bundle in BEER format by ID.           | BEER formatted IPS data.              |
| `/ipshl72x/:id`          | Retrieve IPS Bundle in HL7 2.3 format by ID.           | HL7 2.3 formatted IPS data.              |
| `/ipsxml/:id`                   | Retrieve IPS Bundle in Expanded XML format by ID.            | Expanded XML formatted IPS data.               |
| `/ipslegacy/:id`                | Retrieve IPS Bundle in legacy format by ID.         | Legacy JSON formatted IPS data.       |
| `/ipsunified/:id`                | Retrieve IPS Bundle in compact unified format by ID.         | Compact unified JSON formatted IPS data.       |
| `/ipsbyname/:name/:given`       | Retrieve Expanded IPS Bundle by patient's name and given name. | The Expanded IPS JSON Bundle.                  |
| `/ips/search/:name`             | Search for IPS records by patient's name.           | Array of IPS records.                 |
| `/fetchipsora/:name/:givenName` | Fetch IPS record from ORA by patient's name and given name. | The IPS JSON Bundle.               |

### PUT Endpoints

| Endpoint                        | Description                                         | Request Body                                                                                                     | Response                             |
|---------------------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `/ips/:id`                      | Update an existing IPS record by its ID.            | MongoDb IPS Record - complete or partial| The updated IPS record.              |
| `/ipsuuid/:uuid`                | Update an existing IPS record by its UUID.          | MongoDb IPS Record - complete or partial  | The updated IPS record.              |

### DELETE Endpoints

| Endpoint                        | Description                                         | Response                              |
|---------------------------------|-----------------------------------------------------|---------------------------------------|
| `/ips/:id`                      | Delete an IPS record by its ID.                     | Status message.                       |

## Gzip Support

### Overview

This API supports gzip compression to optimize data transfer. 

- **Incoming Requests**: When sending gzip-encoded data, set the `Content-Encoding: gzip` header.
- **Outgoing Responses**: To receive gzip-encoded responses, set the `Accept-Encoding: gzip` header.

### Usage Instructions

#### For Requests

1. Compress your payload using gzip.
2. Include the header `Content-Encoding: gzip`.
3. Send the compressed payload.

#### For Responses

1. Set the header `Accept-Encoding: gzip`.
2. The API will return the response in gzip format if supported.

# AES-256 Encryption Support

## Overview

This API supports AES-256 encryption for secure data transfer.

- **Incoming Requests**: To send encrypted data, include the `x-encrypted: true` header and provide an encrypted payload.
- **Outgoing Responses**: To receive encrypted responses, include the `Accept-Encryption: aes256` header in your request.

## Base64 Encoding Option

To facilitate compatibility and efficient data transfer, the API supports returning encrypted data encoded in Base64 format. 

- **Incoming Requests**: To send in base64 format, include the header `Content-Encoding: base64` with the encrypted payload. Make sure both the data and the iv are in base64 not hex.
- **Outgoing Responses**: Use the header `Accept-Encoding: base64` The encrypted payload and IV will be returned as Base64-encoded strings.

## Usage Instructions

### For Requests

1. Encrypt your payload using AES-256 encryption with the provided key and IV.
2. Include the `x-encrypted: true` header.
3. Send the encrypted payload in the request body as a JSON with the elements: encryptedData and iv. 
4. Default format is hex strings for both elements. If you wish to send as base64 strings then use the `Content-Encoding: base64`.

### For Responses

1. Include the `Accept-Encryption: aes256` header in your request.
2. Optionally, include the `Accept-Encoding: base64` header to receive the encrypted data and iv encoded in Base64.
3. The response will be a JSON with two elements: encryptedData and iv.

## Raw Binary Format (IV + MAC + Gzipped Data) 
his API also supports sending and receiving raw binary data via application/octet-stream. This is useful when you want a single binary payload that includes:
1. A 16-byte IV (initialization vector).
2. A 16-byte MAC (HMAC-SHA256 for integrity).
3. The encrypted + gzipped data.

## Usage Instructions

### Incoming Requests (Raw Binary)
1. Set the header: `Content-Type: application/octet-stream`
2. The first 16 bytes of your binary payload must be the IV, the next 16 bytes must be the MAC, and the remainder is the AES-256-CBC-encrypted, gzip-compressed data. 
3. The server will:
  - Verify the MAC to check integrity.
  - Decrypt the payload using AES-256-CBC.
  - Decompress the result from gzip.

### Responses (Raw Binary)
1. Send a request with: `Accept: application/octet-stream`
2. The server will:
  - Take the plaintext response body.
  - Compress it with gzip.
  - Encrypt it using AES-256-CBC.
  - Compute the MAC for integrity.
  - Return a binary payload consisting of [16-byte IV] + [16-byte MAC] + [Encrypted Gzipped Data]
3. The response will have: 
- Content-Type: `application/octet-stream`
- X-Encrypted: true

## Client-Side Pages

| Page                 | Description                                                                                           |
|----------------------|-------------------------------------------------------------------------------------------------------|
| **Default Page**     | Add, edit, and search for current records. You can also search for records from the navigation bar.   |
| **API Page**         | View the various API GET endpoints, see their output, and download the output.                        |
| **QR Page**          | Produce various forms of QR codes and download them. Formats include IPS JSON, BEER, and others.      |
| **DMICP Page**       | Bulk upload IPS records produced in the SmartDoc format.                                              |
| **External API Pages** | GET and POST between the external webapps/servers and the IPS D2S WebApp.                                 |
| **About Pages**      | Information about IPS, the WebApp, the ChangeLog, and the API Documentation page.                     |

### Detailed Descriptions

1. **Default Page**
   - **Purpose:** Central page for managing IPS records. Users can add new records, edit existing records, and perform searches.
   - **Features:** 
     - Search for records directly from the page.
     - Perform CRUD operations on IPS records.

2. **API Page**
   - **Purpose:** Provides an interface for interacting with API GET endpoints.
   - **Features:** 
     - View available API endpoints.
     - Execute API calls and display the response.
     - Download the response data.
     - Includes the ability to encrypt and compress the response - base64

3. **QR Page**
   - **Purpose:** Generate and download QR codes for IPS records.
   - **Features:** 
     - Create QR codes in various formats including IPS JSON and BEER.
     - Download the generated QR codes.
     - Includes the ability to encrypt and compress the response - base64

4. **DMICP Page**
   - **Purpose:** Facilitates the bulk upload of IPS records in the SmartDoc format.
   - **Features:** 
     - Upload multiple IPS records simultaneously.
     - Supports the SmartDoc format for bulk data entry.

5. **External API Pages**
   - **Purpose:** Manage interactions with external IPS webApps/servers.
   - **Features:** 
     - GET and POST IPS records between pre-defined endpoints (or manually entered) and the IPS D2S WebApp.

6. **About Pages**
   - **Purpose:** Provide detailed information about the IPS system and the WebApp.
   - **Features:** 
     - Overview of IPS.
     - Information about the WebApp.
     - View the ChangeLog for recent updates.
     - Access the API Documentation page.

Each page in the application is designed to provide specific functionalities for managing and interacting with IPS records, ensuring a comprehensive and user-friendly experience.


## Technologies Used
- Frontend: React, React Bootstrap
- Backend: Node.js, Express
- Database: MySQL
- Other: Axios for HTTP requests, Sequelize for MySQL interaction


## Contributing
Contributions are welcome! Please read our contributing guidelines before you submit a pull request.


## License
This project is licensed under the MIT License. See the LICENSE file for details.





