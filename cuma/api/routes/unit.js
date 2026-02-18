/**
 * this file handles the api request for interacting with mongoDB
 * database name: units
 * API pathname: /api/unit
 *
 */

// TODO: enforce unique on the mongo database

import express from 'express';
import mongoErrorCode from '../mongoErrorCode.js';
import authenticateToken from '../middleware/authenticateToken.js';
import gemini from '../../ai/geminiTest.js';
import authorize from '../middleware/authorize.js';
import dotenv from "dotenv";

const router = express.Router();

const collectionName = "testUnits";

dotenv.config();

router.get("/getAllFromUni", authenticateToken, async (req, res) => {
  /**
   * This endpoint retrieves all the units available in a university
   *
   * url param payloads = {
   *   universityName: str
   * }
   *
   * returns json response =
   * code: 200 - if no error
   * code: 500 - if server error or other errors occured
   *
   */

  try {
    // get the client
    const client = req.client;

    // get the request url params
    const params = req.query;

    //get the database and the collection
    const database = client.db("CUMA");
    const units = database.collection(collectionName);

    //get all the units, then join connections to unit objects
    const allUnits = await units.aggregate([
      {
        $match: {
          universityName: params.universityName,
        },
      },
      {
        $unwind: { path: "$connections", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: collectionName,
          localField: "connections",
          foreignField: "_id",
          as: "connections",
        },
      },
      {
        $unwind: { path: "$connections", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id", // Group by the unique identifier of each document
          universityName: { $first: "$universityName" },
          unitCode: { $first: "$unitCode" },
          unitName: { $first: "$unitName" },
          unitDescription: { $first: "$unitDescription" },
          unitType: { $first: "$unitType" },
          unitLevel: { $first: "$unitLevel" },
          creditPoints: { $first: "$creditPoints" },
          course: { $first: "$course" },
          faculty: { $first: "$faculty" },
          offering: { $first: "$offering" },
          handBookURL: { $first: "$handBookURL" },
          connections: { $push: "$connections" }, // Restore the connections array
        },
      },
    ]);
    const result = await allUnits.toArray();

    // get connections
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});

router.post(
  "/",
  authenticateToken,
  authorize(["course_director"]),
  async (req, res) => {
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
      // Access the MongoDB client from the request object
      const client = req.client;
      const database = client.db("CUMA");

      // get request payload
      const query = req.body;
      const universityNameReq = query.universityName;
      const unitInfoReq = query.unitInfo;

      // get the collection
      const units = database.collection(collectionName);

      // check if the unit in the university already exists
      const unit = await units.findOne({
        unitCode: unitInfoReq.unitCode,
        universityName: universityNameReq,
      });

      // if unit already exists, return error
      if (unit) {
        return res.status(400).json("unit already exists");
      }

      // call gemini to create keywords for the unit
      const aiGenUnitKeyword = await gemini(unitInfoReq.unitDescription);

      // add the unit
      const result = await units.insertOne({
        universityName: universityNameReq,
        aiGenKeyWord: aiGenUnitKeyword,
        ...unitInfoReq,
      });

      return res.status(200).json(result);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/retrieveUnit", authenticateToken, async (req, res) => {
  /**
      This endpoint retrieves a unit from a specific university
      
    url param payloads = {
        universityName: str
        unitCode: str
      }
      
      returns json response = 
      code: 200 - if no error
      code: 500 - if server error or other errors occured
     **/
  try {
    const client = req.client;
    const { universityName, unitCode } = req.query;

    if (!universityName || !unitCode) {
      return res
        .status(400)
        .json({ error: "Both university and unitcode must be provided" });
    }

        const db = client.db('CUMA');
        const collection = db.collection(collectionName);

    const unit = await collection.findOne({
      universityName: universityName,
      unitCode: unitCode,
    });

    if (unit) {
      res.json(unit);
    } else {
      res.status(404).json({
        error: `University: ${universityName}, Unit: ${unitCode}, Not Found!`,
      });
    }
  } catch {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get('/:id', (req, res) => {
//     // Handle GET request to retrieve data by ID
// });

// router.post('/', (req, res) => {
//     // Handle POST request to add new data
// });

router.put(
  "/:unitCode",
  authenticateToken,
  authorize(["course_director"]),
  async (req, res) => {
    /**
     * This endpoint modify a unit base on "unitcode"
     * 
     *  requestbody payload = {
            "universityName": str, 
            "newUnitInfo": {
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
      // get client
      const client = req.client;

      // get requestBody
      const universityName = req.body.universityName;
      var newUnitInfo = req.body.newUnitInfo;

      // Extract the unitcode from request parameters
      const unitCode = req.params.unitCode;

      // mongoDB
      const database = client.db("CUMA");
      const units = database.collection(collectionName);

      // gemini
      var aiGenKeyWord = null;
      if (newUnitInfo.unitDescription) {
        aiGenKeyWord = await gemini(newUnitInfo.unitDescription);
        newUnitInfo = {
          ...newUnitInfo,
          aiGenKeyWord: aiGenKeyWord,
        };
      }

      // update the unit
      const result = await units.updateOne(
        {
          unitCode: unitCode,
          universityName: universityName,
        },
        { $set: newUnitInfo }
      );

      // if the unitCode does not exist
      if (result.matchedCount === 0) {
        return res.status(400).json("This unit does not exist");
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      //handle error
      if (error.code === mongoErrorCode.DUPLICATION) {
        return res
          .status(400)
          .json(
            "This modification duplicates the unitcode with existing data "
          );
      }
    }
  }
);

router.delete(
  "/:unitCode",
  authenticateToken,
  authorize(["course_director"]),
  async (req, res) => {
    // Handle DELETE request to delete unit by unitCode
    try {
      // get client
      const client = req.client;

      // Extract the unitcode from request parameters
      const unitCode = req.params.unitCode;

      // mongoDB
      const database = client.db("CUMA");
      const units = database.collection(collectionName);

      // update the unit
      const result = await units.deleteOne({ unitCode: unitCode });

      // if the unitCode does not exist
      if (result.deletedCount === 0) {
        return res.status(400).json("This unit does not exist");
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

router.get("/getAllNotInUni", authenticateToken, async (req, res) => {
  /**
   * This endpoint retrieves all the units available in a university
   *
   * url param payloads = {
   *   universityName: str
   * }
   *
   * returns json response =
   * code: 200 - if no error
   * code: 500 - if server error or other errors occured
   *
   */

  try {
    // get the client
    const client = req.client;

    // get the request url params
    const params = req.query;

    //get the database and the collection
    const database = client.db("CUMA");
    const units = database.collection(collectionName);

        //get all the units
        const allUnits = await units.find({ universityName: { $ne: params.universityName } });;
        const result = await allUnits.toArray()
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
    }
})

// Get all university names that are not the one in input
router.get('/getAllOtherUni', authenticateToken, async (req, res) => {
    try {
        // get the client
        const client = req.client;

        // get the request url params 
        const { universityName } = req.query;

        if (universityName == null) {
            return res.status(404).json({ error: "Ensure you provide universityName" });
        }

        //get the database and the collection
        const database = client.db("CUMA");
        const units = database.collection(collectionName);

        //get all the units
        const otherUniversities = await units.aggregate([
            {
                $match: { universityName: { $ne: universityName } } // Filter out "Monash University"
            },
            {
                $group: {
                    _id: "$universityName" // Group by universityName to get unique names
                }
            },
            {
                $project: {
                    _id: 0, universityName: "$_id" // Return a clean list of university names
                }
            }
        ])
        const result = await otherUniversities.toArray()
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
    }
})



export default router;
