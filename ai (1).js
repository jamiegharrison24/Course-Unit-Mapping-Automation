import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import User from '../models/UserSchema.js';
import gemini from '../../ai/geminiTest.js';
const router = express.Router();


// For testing 
const CLIENT = "CUMA_TEST";
// const CLIENT = "CUMA";
const TRANSFER_PLAN_COLLECTION = "transferPlans";

async function getTransferPlanDBCollection(req) {
  const client = req.client;
  const database = client.db(CLIENT);
  return database.collection(TRANSFER_PLAN_COLLECTION);
}

/**
 * Utility function to retrieve the email of the user.
 * @param {Object} req request
 * @returns 
 */


function getEmail(req) {
    // No user detected
    if (!req.user.email) {
        return null;
    }

    // Local login
    return req.user.email;
}

async function getUser(req) {
    const userEmail = getEmail(req);
    if (!userEmail) return null;

    const db = req.client.db(CLIENT);
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) return null;

    if (!user.connections) {
    await usersCollection.updateOne({ email: userEmail }, { $set: { connections: [] } });
    }
    return user;
}

// Create a new transfer plan
// Create a new transfer plan
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) return res.status(403).json({ error: "User not found" });

        const transferPlansCollection = await getTransferPlanDBCollection(req);
        const { createPlannerForm } = req.body;

        // Input validation
        if (!createPlannerForm || !createPlannerForm.planName || !createPlannerForm.course || !createPlannerForm.studyYear || !createPlannerForm.studyPeriod || !createPlannerForm.transferUniversity) {
            return res.status(400).json({ error: 'Invalid or missing fields in createPlannerForm' });
        }

        // Check if a record exists for the current user
        const existingUserTransferPlans = await transferPlansCollection.findOne({ user: user.email });

        // Create the new transfer plan object
        const newPlan = {
            createdAt: new Date(),
            updatedAt: new Date(),
            homeUniversity: "Monash",
            courseLevel: createPlannerForm.courseLevel,
            course: createPlannerForm.course,
            studyYear: createPlannerForm.studyYear,
            studyPeriod: createPlannerForm.studyPeriod,
            transferUniversity: createPlannerForm.transferUniversity,
            name: createPlannerForm.planName,
            unitMappings: []
        };

        if (!existingUserTransferPlans) {
            // If the user doesn't have any transfer plans, create a new user record with the new transfer plan
            const newTransferPlan = {
                user: user.email,
                transferPlans: [newPlan]
            };

            await transferPlansCollection.insertOne(newTransferPlan);

            return res.status(201).json({
                message: 'New Transfer Plan created successfully',
                transferPlan: newPlan,
            });
        } else {
            // Check if a transfer plan with the same name already exists
            const existingTransferPlan = existingUserTransferPlans.transferPlans.find(plan => plan.name === createPlannerForm.planName);

            if (existingTransferPlan) {
                return res.status(400).json({ error: 'Transfer Plan with this name already exists. Choose a different name.' });
            }

            // Update 'updatedAt' field of all existing transfer plans
            existingUserTransferPlans.transferPlans.forEach(plan => {
                plan.updatedAt = new Date();
            });

            // Add the new plan to the existing user's transferPlans array
            existingUserTransferPlans.transferPlans.push(newPlan);

            // Update the user's document in the collection
            await transferPlansCollection.updateOne(
                { user: user.email },
                {
                    $set: {
                        transferPlans: existingUserTransferPlans.transferPlans
                    }
                }
            );

            return res.status(201).json({
                message: 'New Transfer Plan added successfully',
                transferPlan: newPlan,
            });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Get all transfer plans
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) return res.status(403).json({ error: "User not found" });

        const transferPlansCollection = await getTransferPlanDBCollection(req);
        const userTransferPlans = await transferPlansCollection.findOne({ user: user.email });

        // If no transfer plans exist for the user, return an empty array
        const transferPlans = userTransferPlans && userTransferPlans.transferPlans
            ? userTransferPlans.transferPlans
            : [];

        return res.status(200).json({
            message: 'Successfully retrieved all transfer plans',
            transferPlans: transferPlans,
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific transfer plan by name
router.get('/plan/:name', authenticateToken, async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) return res.status(403).json({ error: "User not found" });

        const transferPlansCollection = await getTransferPlanDBCollection(req);
        const { name } = req.params;

        // Find the user's transfer plan document
        const userTransferPlans = await transferPlansCollection.findOne({ user: user.email });

        // If no document exists for the user or no transferPlans array exists, return not found
        if (!userTransferPlans || !userTransferPlans.transferPlans) {
            return res.status(404).json({ error: "No transfer plans found for the user" });
        }

        // Find the specific transfer plan by name
        const specificTransferPlan = userTransferPlans.transferPlans.find(plan => plan.name === name);

        // If no specific transfer plan is found, return not found
        if (!specificTransferPlan) {
            return res.status(404).json({ error: `Transfer Plan with name '${name}' not found` });
        }

        // Return the specific transfer plan
        return res.status(200).json({
            message: 'Transfer Plan retrieved successfully',
            transferPlan: specificTransferPlan,
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Update the unitMappings of a specific transfer plan
router.put('/plan/:name', authenticateToken, async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) return res.status(403).json({ error: "User not found" });

        const { name } = req.params; // Corrected the parameter name
        const { unitMappings } = req.body;

        if (!unitMappings) {
            return res.status(400).json({ error: "unitMappings data is required." });
        }

        const transferPlansCollection = await getTransferPlanDBCollection(req);

        // Find the specific transfer plan document for the user
        const userTransferPlans = await transferPlansCollection.findOne({ user: user.email });

        if (!userTransferPlans || !userTransferPlans.transferPlans) {
            return res.status(404).json({ error: 'Transfer Plan not found.' });
        }

        // Find the specific plan by name
        const planIndex = userTransferPlans.transferPlans.findIndex(plan => plan.name === name);

        if (planIndex === -1) {
            return res.status(404).json({ error: 'Transfer Plan not found.' });
        }

        // Update only the unitMappings of the transfer plan
        userTransferPlans.transferPlans[planIndex].unitMappings = unitMappings;
        userTransferPlans.transferPlans[planIndex].updatedAt = new Date();

        // Update the document in the database
        await transferPlansCollection.updateOne(
            { user: user.email },
            { $set: { transferPlans: userTransferPlans.transferPlans } }
        );

        return res.status(200).json({
            message: 'Transfer Plan unitMappings updated successfully',
            transferPlan: userTransferPlans.transferPlans[planIndex],
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete a specific transfer plan
router.delete('/plan/:planName', authenticateToken, async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) return res.status(403).json({ error: "User not found" });

        const { planName } = req.params;

        const transferPlansCollection = await getTransferPlanDBCollection(req);

        // Attempt to remove the specific transfer plan by name
        const result = await transferPlansCollection.updateOne(
            { user: user.email },
            { $pull: { transferPlans: { name: planName } } }
        );

        // Check if any document was modified (i.e., if the transfer plan was found and deleted)
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Transfer Plan not found or already deleted.' });
        }

        return res.status(200).json({
            message: `Transfer Plan "${planName}" deleted successfully.`,
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/custom-unit', authenticateToken, async (req, res) => {
    /**
     * This endpoint inserts a unit into the database.
     * 
     *  requestbody payload = {
            "universityName": str, 
            "unitInfo": {
                "unitCode": "str",
                "unitName": "str",
                "unitDescription": "str",
                "unitType": "int",
                "unitLevel": "int",
                "creditPoints": "int",
            }
        }
     *
     * returns json response: 
     * code: 400 - if the university does not exist. Or if the unit already exists in the university (duplicates)
     * code: 200 - if successful
     * code: 500 - if server error or other errors occured
     */





    try {

        const user = await getUser(req);
        if (!user) return res.status(403).json({ error: "User not found" });
    
        const transferPlansCollection = await getTransferPlanDBCollection(req);
    
        // get request payload
        const query = req.body;
        const unitInfoReq = query.unitInfo;
        
        // check if the unit in the university already exists
        const unit = await transferPlansCollection.findOne({ 
            "customUnits" : {$elemMatch : { "unitCode": unitInfoReq.unitCode, "universityName": unitInfoReq.universityName }}
    
        });
    
        // if unit already exists, return error
        if (unit) {
            return res.status(400).json("unit already exists")
        }
    
           // call gemini to create keywords for the unit
           const aiGenUnitKeyword = await gemini(unitInfoReq.unitDescription)
    
    
        // Add the custom unit to the database
        const result = await transferPlansCollection.updateOne(
            { user: user.email },
            { 
                $push: {
                    customUnits: {
                        aiGenKeyWord: aiGenUnitKeyword,
                        ...unitInfoReq
                    }
                }
            }
        );    


        return res.status(200).json(result);
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getall-custom-units', authenticateToken, async (req, res) => {
    /**
     * returns json response: 
     * code: 400 - if the university does not exist. Or if the unit already exists in the university (duplicates)
     * code: 200 - if successful
     * code: 500 - if server error or other errors occured
     */





    try {

        const user = await getUser(req);
        if (!user) return res.status(403).json({ error: "User not found" });
    
        const transferPlansCollection = await getTransferPlanDBCollection(req);

        // get the request url params 
        const params = req.query;
    
        console.log(params.universityName)
        // Add the custom unit to the database

        const pipeline = [
            {
                "$match": { "user": user.email}
            },
            { "$unwind": "$customUnits" },
            {
                "$match": { "customUnits.universityName": params.universityName }
            },
            {
                "$project": {
                    "_id": 0,
                    "transferPlans": 0,
                    "user" : 0
                }
            }
        ];
        

        const result = await transferPlansCollection.aggregate(
            pipeline
        );    

        const resultsArray = await result.toArray()
        // Transforming the data to extract customUnits information
        const unitArray = resultsArray.map(item => item.customUnits);
        return res.status(200).json(unitArray);
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;
