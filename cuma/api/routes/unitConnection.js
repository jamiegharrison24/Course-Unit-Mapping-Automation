// this file handles the api request for interacting with mongoDB
// database name: universities

import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import User from '../models/UserSchema.js';
const router = express.Router();

const unitsCollectionName = "testUnits"


router.post('/add', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user){
            return res.status(404).json({ error: "User not found" });
        }

        // Access the MongoDB client from the request object
        const client = req.client;
        const database = client.db('CUMA');
        const units = database.collection(unitsCollectionName);
        const { universityNameA, unitCodeA, universityNameB, unitCodeB } = req.body;

            if (universityNameA == universityNameB && unitCodeA == unitCodeB) {
                return res.status(404).json({ error: 'Cannot add connection to self, ' + unitCodeA + " == " + unitCodeB });
            }
            // Check if unitCodes exists
            const unitA = await units.findOne({ universityName: universityNameA, "unitCode": unitCodeA });
            const unitB = await units.findOne({ universityName: universityNameB, "unitCode": unitCodeB });

            if (!unitA) {
                return res.status(404).json({ error: universityNameA + ", " + unitCodeA + ' not found' });
            }
            if (!unitB) {
                return res.status(404).json({ error: universityNameB + ", " + unitCodeB + ' not found' });
            }
            if (user.connections) {
                // const anyConnectionToB = await units.findOne({ universityName: universityNameA, "unitCode": unitCodeA, "connections": unitB._id });
                const anyConnectionToB = user.connections.find(connection => connection.unitAId.toString() == unitA._id && connection.unitBId.toString() == unitB._id);

                // Add connection to B
                const anyConnectionToA = user.connections.find(connection => connection.unitAId.toString() == unitB._id && connection.unitBId.toString() == unitA._id);

                if (anyConnectionToA || anyConnectionToB) {
                    return res.status(400).json({ result: "Connection already exists between these units (" + unitCodeA + " & " + unitCodeB + ")", status: 400 });
                } 
            }
            user.connections.push({ unitAId: unitA._id, unitBId: unitB._id });
            await user.save();
            res.json({ status: "Success" });
        
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete user connection
router.post('/delete', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Access the MongoDB client from the request object
        const client = req.client;
        const database = client.db('CUMA');
        const units = database.collection(unitsCollectionName);
        const { universityNameA, unitCodeA, universityNameB, unitCodeB } = req.body;

            if (universityNameA == universityNameB && unitCodeA == unitCodeB) {
                return res.status(404).json({ error: 'Cannot delete connection to self, ' + unitCodeA + " == " + unitCodeB });
            }
            // Check if unitCodes exists
            const unitA = await units.findOne({ universityName: universityNameA, "unitCode": unitCodeA });
            const unitB = await units.findOne({ universityName: universityNameB, "unitCode": unitCodeB });

            if (!unitA) {
                return res.status(404).json({ error: universityNameA + ", " + unitCodeA + ' not found' });
            }
            if (!unitB) {
                return res.status(404).json({ error: universityNameB + ", " + unitCodeB + ' not found' });
            }

            if (user.connections == null) {
                return res.status(400).json({ result: "There already exists no connection between these units (" + unitCodeA + " & " + unitCodeB + ")", status: 400 });
            }
            const connectionIndex = user.connections.findIndex(connection => 
                (connection.unitAId.equals(unitA._id) && connection.unitBId.equals(unitB._id)) ||
                (connection.unitAId.equals(unitB._id) && connection.unitBId.equals(unitA._id))
            );
    
            if (connectionIndex === -1 || (!anyConnectionToA && !anyConnectionToB)) {
                return res.status(400).json({ result: "There already exists no connection between these units (" + unitCodeA + " & " + unitCodeB + ")", status: 400 });
            }
    
            user.connections.splice(connectionIndex, 1);
            await user.save();
            return res.json({ status: "Success" });
        
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * This endpoint retrieves all connections of a user
 */
router.get("/getAllUserConnections", authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const client = req.client;
        const db = client.db("CUMA");
        const unitsConnection = db.collection(unitsCollectionName);

        const userConnections = await resolveConnections(unitsConnection, user.connections);
        return res.status(200).json({ connections: userConnections });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


/**
* This endpoint retrieves specific connections of a unit for user
*
* URL param payloads:
* {
*   sourceUni: str
*   unitCode: str
*   targetUni: str
* }
*
* Returns JSON response:
* code: 200 - if no error
* code: 400 - if missing parameters
* code: 404 - if any is not found
* code: 500 - if server error or other errors occurred
*/
router.get("/getSpecific", authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Get the query parameters and check if they are provided
        const { sourceUni, unitCode } = req.query;
        if (!sourceUni || !unitCode) {
            return res.status(400).json({ error: "sourceUni and unitCode must be provided" });
        }

        // Access the MongoDB client from the request object and get the collection
        const client = req.client;
        const db = client.db("CUMA");
        const unitsCollection = db.collection(unitsCollectionName);

        // Find the unit in the collection
        const unit = await findUnit(unitsCollection, sourceUni, unitCode);
        if (!unit) {
            return res.status(404).json({ error: `University: ${sourceUni}, Unit: ${unitCode}, Not Found!` });
        }

        // Find connections of the unit for the user 
        const otherUnitsIds = user.connections
        .filter(connection => connection.unitAId.equals(unit._id) || connection.unitBId.equals(unit._id))
        .map(connection => connection.unitAId.equals(unit._id) ? connection.unitBId : connection.unitAId);

        // Resolve IDs to units
        const resolvedConnections = await resolveIdsToUnits(unitsCollection, otherUnitsIds);
        // Return the filtered connections
        return res.status(200).json({ connections: resolvedConnections });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// Helper functions
/**
 * Utility function to retrieve a unit from the database.
 * @param {object} collection - MongoDB collection object.
 * @param {string} universityName - The name of the university.
 * @param {string} unitCode - The code of the unit.
 * @returns {object|null} - The unit document or null if not found.
 */
async function findUnit(collection, universityName, unitCode) {
    return await collection.findOne({ universityName, unitCode });
}


/**
 * Utility function to retrieve unit connections.
 * @param {object} collection - MongoDB collection object.
 * @param {Array} connectionIds - Array of connection IDs.
 * @returns {Array} - Resolved connections.
 */
async function resolveIdsToUnits(collection, connectionIds) {
    return await collection.find({ _id: { $in: connectionIds } }).toArray();
}

/**
 * Utility function to resolve ObjectIds in connections using the database collection to units's data
 * Format of each connection returned in the list
    {
        "universityNameA": "testUniversity",
        "unitCodeA": "TEST1830",
        "unitAId": ObjectId
        "universityNameB": "Monash",
        "unitCodeB": "MAT1830"
        "unitBId": ObjectId
    } 
 * @param {Object} unitsCollection database collection to retrieve unit data from
 * @param {Object} objectIdConnections list of {"unitAId": ObjectId, "unitBId": ObjectId}
 * @returns list of connections (shown format above)
 */
async function resolveConnections(collection, objectIdConnections) {
    // Create array of dictionaries
    if (!objectIdConnections) {
        return null;
    }

    const connectionPromises = objectIdConnections.map(async (objectIdConnection) => {
        const unitAId = objectIdConnection.unitAId;
        const unitBId = objectIdConnection.unitBId;
        if (unitAId && unitBId) {
            const unitA = await collection.findOne({ _id: unitAId });
            const unitB = await collection.findOne({ _id: unitBId });

            if (unitA && unitB) {
                const universityNameA = unitA.universityName;
                const unitCodeA = unitA.unitCode;
                const universityNameB = unitB.universityName;
                const unitCodeB = unitB.unitCode;

                return {
                    universityNameA: universityNameA,
                    unitCodeA: unitCodeA,
                    unitAId: unitAId,
                    universityNameB: universityNameB,
                    unitCodeB: unitCodeB,
                    unitBId: unitBId
                };
            }
        }
        return null;
    });
    return (await Promise.all(connectionPromises)).filter(connection => connection !== null);
}



// /**
//  * Utility function to retrieve the email of the user.
//  * @param {Object} req request
//  * @returns 
//  */
// function getEmail(req) {
//     // No user detected
//     if (!req.user.email) {
//         return null;
//     }

//     // Local login
//     return req.user.email;
// }


// async function getUser(req) {
//     // Get user's email
//     const userEmail = getEmail(req);
//     if (!userEmail) {
//         return null;
//     }
//     // Fetch user's connections using the email from the users collection
//     const db = req.client.db("CUMA");
//     const usersCollection = db.collection("users");
//     const user = await usersCollection.findOne({ email: userEmail });
    
//     // Check if user exists, if not return 404
//     if (!user) {
//         return null;
//     }
//     // Add connections array to database if it doesn't exist
//     if (!user.connections) {
//         await usersCollection.updateOne({ email: userEmail }, { $set: { connections: [] } });
//     }
//     return user;
// }

export default router;
