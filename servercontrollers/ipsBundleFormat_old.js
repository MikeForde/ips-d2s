const { v4: uuidv4 } = require('uuid');
const { resolveId } = require('../utils/resolveId');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

// Helper function to check if a string contains a number
const containsNumber = (str) => /\d/.test(str);

async function getIPSLegacyBundle(req, res) {
    const id = req.params.id;

    try {
        const ips = await resolveId(id);

        if (!ips) {
            return res.status(404).json({ message: "IPS record not found" });
        }

        // Transform the IPS record to the desired format
        const transformedIps = await SQLToMongoSingle(ips);

        // Constructing the JSON structure
        const bundle = {
            resourceType: "Bundle",
            id: transformedIps.packageUUID, // First ID is the packageUUID
            timestamp: transformedIps.timeStamp, // Time stamp
            type: "collection",
            total: 2 + (transformedIps.medication.length * 2) + transformedIps.allergies.length + transformedIps.conditions.length + transformedIps.observations.length + transformedIps.immunizations.length, // Total resources
            entry: [
                {
                    resource: {
                        resourceType: "Patient",
                        id: uuidv4(), // Generate UUID for patient ID
                        name: [
                            {
                                family: transformedIps.patient.name,
                                text: `${transformedIps.patient.given} ${transformedIps.patient.name}`,
                                given: [transformedIps.patient.given, transformedIps.patient.given.charAt(0)],
                            },
                        ],
                        gender: transformedIps.patient.gender,
                        birthDate: transformedIps.patient.dob, // Date of birth
                        address: [
                            {
                                country: transformedIps.patient.nation, // Nationality
                            },
                        ],
                    },
                },
                {
                    resource: {
                        resourceType: "Practitioner",
                        id: uuidv4(), // Generate UUID for practitioner ID
                        name: [
                            {
                                text: transformedIps.patient.practitioner, // Practitioner name
                            },
                        ],
                    },
                },
                // Medication entries
                ...transformedIps.medication.flatMap((med) => [
                    {
                        resource: {
                            resourceType: "MedicationRequest",
                            id: uuidv4(), // Generate UUID for medication request ID
                            intent: "order",
                            medicationReference: {
                                reference: `urn:uuid:${uuidv4()}`, // Generate UUID for medication reference
                                display: med.name, // Medication name
                            },
                            authoredOn: med.date, // Date
                            dosageInstruction: [
                                {
                                    text: med.dosage, // Dosage
                                    // Other dosage instructions
                                },
                            ],
                        },
                    },
                    {
                        resource: {
                            resourceType: "Medication",
                            id: uuidv4(), // Generate UUID for medication ID
                            code: {
                                coding: [
                                    {
                                        display: med.name,
                                        system: med.system,
                                        code: med.code,
                                    },
                                ],
                            },
                        },
                    },
                ]),
                // Allergy entries
                ...transformedIps.allergies.map((allergy) => ({
                    resource: {
                        resourceType: "AllergyIntolerance",
                        id: uuidv4(), // Generate UUID for allergy ID
                        category: ["medication"],
                        criticality: "high",
                        code: {
                            coding: [
                                {
                                    display: allergy.name,
                                    system: allergy.system,
                                    code: allergy.code,
                                },
                            ],
                        },
                        onsetDateTime: allergy.date, // Onset date
                    },
                })),
                // Condition entries
                ...transformedIps.conditions.map((condition) => ({
                    resource: {
                        resourceType: "Condition",
                        id: uuidv4(), // Generate UUID for condition ID
                        code: {
                            coding: [
                                {
                                    display: condition.name,
                                    system: condition.system,
                                    code: condition.code,
                                },
                            ],
                        },
                        onsetDateTime: condition.date, // Onset date
                    },
                })),
                // Observation entries
                ...transformedIps.observations.map((observation) => {
                    const observationUUID = uuidv4();
                    let observationResource = {
                        resource: {
                            resourceType: "Observation",
                            id: observationUUID,
                            code: {
                                coding: [
                                    {
                                        display: observation.name,
                                        system: observation.system,
                                        code: observation.code,
                                    },
                                ],
                            },
                            effectiveDateTime: observation.date, // Effective date
                        }
                    };

                    if (observation.value) {
                        if (containsNumber(observation.value)) {
                            // Value contains a number, assume it's numerical value with units
                            const valueMatch = observation.value.match(/(\d+\.?\d*)(\D+)/);
                            if (valueMatch) {
                                observationResource.resource.valueQuantity = {
                                    value: parseFloat(valueMatch[1]),
                                    unit: valueMatch[2].trim(),
                                    system: "http://unitsofmeasure.org",
                                    code: valueMatch[2].trim()
                                };
                            }
                        } else {
                            // Value is just text, assume it's body site related
                            observationResource.resource.bodySite = {
                                coding: [
                                    {
                                        display: observation.value
                                    }
                                ]
                            };
                        }
                    }

                    return observationResource;
                }),
                // Immunization entries
                ...transformedIps.immunizations.map((immunization) => ({
                    resource: {
                        resourceType: "Immunization",
                        id: uuidv4(), // Generate UUID for immunization ID
                        status: "completed",
                        vaccineCode: {
                            coding: [
                                {
                                    system: immunization.system, // Immunization coding system
                                    code: immunization.name, // Immunization name/code
                                },
                            ],
                        },
                        occurrenceDateTime: immunization.date, // Immunization date
                    },
                })),
            ],
        };

        res.json(bundle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { getIPSLegacyBundle };
