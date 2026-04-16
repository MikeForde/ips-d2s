# IPS SERN D2S

IPS SERN D2S is a SERN-stack application for creating, storing, converting, validating, viewing, and exchanging International Patient Summary style data.

The backend stores records in MySQL via Sequelize, but many API responses intentionally keep the older Mongo-style JSON shape used by the frontend and other compatibility paths.

## Overview

This repository contains:

- A Node.js/Express backend in the repo root
- A React client in `client/`
- A MySQL-backed data model for IPS records and supporting SNOMED GPS lookup data
- REST, GraphQL, Swagger, Socket.IO, and gRPC entry points
- Format conversion pipelines for IPS/NPS, NHS SCR, EPS, BEER, HL7 v2.x, CDA, XML, QR, NFC, XMPP, and TAK flows

## Current Highlights

- CRUD operations for IPS records stored in MySQL
- Conversion between SQL-backed records and Mongo-style JSON payloads
- FHIR bundle generation for:
  - Expanded IPS
  - NPS / unified IPS
  - NHS SCR IPS
  - EPS
  - legacy IPS output
- Conversion endpoints for:
  - BEER
  - HL7 2.x
  - CDA XML
  - FHIR XML
  - plain text / human-readable output
- Schema validation endpoints and UI for:
  - NPS
  - NPS NFC split bundles
  - NHS SCR
  - EPS
- SNOMED GPS search and picklist APIs used by the editor UI
- Static QR, animated QR generation, and animated QR reading
- NFC-oriented split payload demos
- External exchange tooling including XMPP and TAK integrations
- GraphQL endpoint layered over the REST/controller surface

## Repository Layout

```text
.
|-- server.js                 Express app entry point
|-- graphql/                 GraphQL schema and resolvers
|-- models/                  Sequelize models
|-- servercontrollers/       REST/controller logic and converters
|-- schema/                  Validation routes and JSON Schemas
|-- client/                  React application
|-- tak/                     TAK integration
|-- xmpp/                    XMPP integration
|-- proto/                   gRPC server
```

## Prerequisites

- Node.js
- npm
- MySQL

## Installation

Install server dependencies from the repository root:

```bash
npm install
```

Install client dependencies:

```bash
npm install --prefix client
```

## Environment Variables

Create a `.env` file in the repository root.

Required for normal database-backed use:

```env
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_HOST=localhost
```

Useful optional settings:

```env
PORT=5049
DB_SYNC=false
REACT_APP_API_BASE_URL=http://localhost:5049
INTERNAL_GRAPHQL_REST_BASE_URL=http://127.0.0.1:5049

# Optional integrations
TAK_HOST=
XMPP_ROOM=
XMPP_DOMAIN=
HTTP20_ONLY_PORT=8585
```

Notes:

- `DB_SYNC=true` enables Sequelize schema alteration on startup. Use that carefully.
- The React client uses `client/package.json` proxy settings by default in local development.
- `REACT_APP_API_BASE_URL` is only needed when the client is not talking to the same origin.

## Running Locally

Start both the backend and the React dev server:

```bash
npm run dev
```

This runs:

- `npm run server` in the root for the Express backend
- `npm run client` in the root for the React app in `client/`

You can also run them separately:

```bash
npm run server
npm run client
```

Default local URLs:

- App API: `http://localhost:5049`
- React dev server: `http://localhost:3000`
- Swagger UI: `http://localhost:5049/docs`
- GraphQL: `http://localhost:5049/graphql`
- GraphQL Playground: `http://localhost:5049/playground`

## Production Build

Build the React client:

```bash
npm run build --prefix client
```

The Express app serves the built client from `client/build`.

Start the server:

```bash
npm start
```

## API Surface

The application exposes several interfaces:

- REST endpoints from `server.js`
- Swagger/OpenAPI docs at `/docs`
- GraphQL at `/graphql`
- GraphQL Playground at `/playground`
- Socket.IO for live client updates
- gRPC server startup from `proto/grpcServer.js`

### Key REST Areas

- IPS CRUD and retrieval
- IPS bundle generation in multiple profiles
- Format conversion endpoints
- Schema validation endpoints
- SNOMED GPS lookup endpoints
- XMPP endpoints under `/xmpp`
- TAK endpoints under `/tak`

### Selected REST Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/ips/all` | Return all IPS records |
| `GET` | `/ips/list` | Lightweight IPS list |
| `GET` | `/ipsraw/:id` | Raw Mongo-style IPS JSON |
| `GET` | `/ipsmongo/:id` | Presentation-friendly JSON |
| `GET` | `/ips/:id` | Expanded IPS bundle |
| `GET` | `/ipsnhsscr/:id` | NHS SCR IPS bundle |
| `GET` | `/ipseps/:id` | EPS bundle |
| `GET` | `/nps/:id` | Unified/NPS bundle |
| `GET` | `/npsnfc/:id` | Split NFC-oriented NPS payload |
| `POST` | `/ips` | Create IPS record |
| `POST` | `/ipsbundle` | Create from bundle |
| `POST` | `/convertbeer2ips` | Convert BEER to IPS/NPS |
| `POST` | `/convertcdatoips` | Convert CDA XML to IPS/NPS |
| `POST` | `/converthl72xtoips` | Convert HL7 v2.x to IPS/NPS |
| `POST` | `/npsVal` | Validate NPS JSON |
| `POST` | `/ipsNhsScrVal` | Validate NHS SCR JSON |
| `POST` | `/epsVal` | Validate EPS JSON |
| `GET` | `/snomedgps/search` | SNOMED GPS search |
| `GET` | `/snomedgps/picklist/:tag` | SNOMED GPS picklist |

For the full current surface, use:

- Swagger UI: `/docs`
- Frontend API Documentation page
- `client/src/pages/APIDocumentationPage.js`

## GraphQL

GraphQL is mounted at `/graphql` and wraps much of the existing controller surface.

Examples available in the built-in playground include:

- `getAllIPS`
- `getIPSExpanded`
- `getIPSUnified`
- `getIPSByName`
- `addIPS`

## Frontend Pages

The current React app includes these main areas:

- Home/editor page for creating, editing, viewing, and searching patient records
- API page for testing retrieval endpoints and output formats
- Viewer page for payload inspection
- Static QR generation
- Animated QR generation
- Animated QR reader
- NFC reader tooling
- BEER tools page
- External GET/POST exchange pages
- JWE single-recipient and multi-recipient utilities
- Schema viewers for NPS, NHS SCR, and EPS
- Schema validator with NPS, NPS NFC, NHS SCR, and EPS modes
- API documentation, changelog, and about pages

The UI uses SNOMED GPS lookup endpoints to support clinically relevant term selection while preserving code/system values in edited records.

## Data Shape Notes

Although the backend is SQL-backed, much of the application still uses a Mongo-style JSON payload shape for compatibility with the existing React client and earlier MERN-based flows.

Typical record shape returned to the client looks like:

```json
{
  "_id": 123,
  "packageUUID": "uuid-value",
  "timeStamp": "2026-04-15T12:00:00.000Z",
  "patient": {
    "name": "Smith",
    "given": "John"
  },
  "medication": [],
  "allergies": [],
  "conditions": [],
  "observations": [],
  "immunizations": [],
  "procedures": []
}
```

This is intentional.

## Compression and Encryption

The API supports additional transport modes used by some interoperability and device flows:

- gzip request/response handling
- AES-256 encrypted request/response handling
- combined gzip + AES-256 flows
- raw binary payload mode via `application/octet-stream`

See the Swagger docs and frontend API documentation page for the current request header conventions.

## Additional Integrations

- XMPP messaging and IPS sharing
- TAK message generation and browser rendering
- gRPC server startup for additional integration flows
- Socket.IO update notifications for the React client

## Version

The UI and API are currently aligned to version `0_86`.

Recent notable additions include:

- NHS SCR bundle support
- EPS bundle support
- SNOMED GPS lookup integration
- NPS NFC split validation and preview flows
- animated QR reader support

## License

This project is licensed under the MIT License. See `LICENSE` for details.
