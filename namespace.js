import express from "express";
const router = express.Router();
import fs from 'fs';
import gemini from '../../ai/geminiTest.js';
import { run} from "./webscraper.js";

const collectionName = "testUnits";

router.post("/scrapeDomesticUnits", async (req, res) => {
    try {
      // Extract the source unit and comparison units from the request body
      const url = req.body.url;

      const output = await run(url, res);

      const result = await addToDatabase(req, output);
      
      res.write(JSON.stringify(result));

      res.end()
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }

});


async function addToDatabase(req, data) {
  const returnResults = {
    "unitsAdded": null,
    "unitsModified": null,
    "unitsUnchanged": null,
    "type" : "result"
  };

  // Read from unitdata.json
  // const data = fs.readFileSync('./unitData.json', 'utf8');
  // console.log(data)
  const jsonObject = JSON.parse(data);
  
  // Prepare data
  const unitData = jsonObject["units"];
  const courseCode = jsonObject["courseCode"];
  const universityName = jsonObject["University"]; 
  const courseData = {
    courseCode: courseCode,
    courseName: jsonObject["CourseTitle"]
  };

  // Access the MongoDB client from the request object
  const client = req.client;
  const database = client.db('CUMA');
  
  // Get the collection
  const units = database.collection(collectionName);



  try {

    // for (const [index, unit] of unitData.entries()) {
    //     const aiGenUnitKeyword = await gemini(unit.unitDescription + JSON.stringify(unit.learningOutcomes));
    //     unit["keywords"] = aiGenUnitKeyword;
    // }

    // Add the units
    const result = await units.insertMany(unitData, { ordered: false });

    // Return results
    returnResults.unitsAdded = result.insertedCount;
    returnResults.unitsModified = 0;
    returnResults.unitsUnchanged = 0;


  } catch (error) {
    if (error && error.writeErrors) {


      // Handle unique key errors
      const failedUnits = error.writeErrors.map(writeError => writeError.getOperation().unitCode.toString());
      
      // Define the filter for existing units
      const filter = {
        "unitCode": { $in: failedUnits }, // Check if unitCode is in the array of failedUnits
        "universityName": universityName, // Check if universityName is valid
        course: {
          $not: {
            $elemMatch: {
              courseCode: courseCode // Ensure no element in course array has courseCode
            }
          }
        }
      }; // Check if unit is already part of the course
      
      // Update data
      const update = {
        "$push": { "course": courseData }
      };


      // Update the units that already exist
      const modifyResult = await units.updateMany(filter, update); // Await the updateMany
    
      // Prepare the return result after the update
      returnResults.unitsAdded = error.result.insertedCount
      returnResults.unitsModified = modifyResult.modifiedCount;
      returnResults.unitsUnchanged = unitData.length - returnResults.unitsAdded - returnResults.unitsModified;

    }



  }

  return returnResults;
}










export default router;