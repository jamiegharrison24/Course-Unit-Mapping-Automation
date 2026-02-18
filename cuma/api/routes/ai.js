/**
 * This file handles the API request for querying Gemini AI.
 * API pathname: /api/ai
 *
 * This API enables the comparison of units by querying the Gemini AI model.
 */

import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialise the Google Generative AI client using the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

// Specify the generative model to be used (Gemini 1.5 Flash)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * POST /compareUnits
 *
 * This route queries Gemini AI to determine the best matching unit Y to a given unit X, from a set of units [Y, Z, ...].
 * The AI is prompted to analyse the similarity between a source unit and multiple comparison units, returning a score
 * for each comparison unit in the range [1,10].
 *
 * Request Body:
 * - unitSRC: An object representing the source unit X, containing unitTitle and unitDescription.
 * - unitsToCompare: An object representing the units to be compared, with each key being a unit code (e.g., "FIT5137"),
 *   and each value being an object containing unitTitle and unitDescription.
 *
 * Example Request Body:
 * {
 *    "unitSRC": {
 *        "FIT3171": {
 *            "unitTitle": "Databases",
 *            "unitDescription": "This unit will provide an introduction to the concepts of database design and usage and the related issues of data management..."
 *        }
 *    },
 *    "unitsToCompare": {
 *        "FIT5137": {
 *            "unitTitle": "Advanced database technology",
 *            "unitDescription": "This unit examines advanced database technology. This unit particularly covers three main types of advanced database technologies..."
 *        },
 *        "FIT5129": {
 *            "unitTitle": "Cyber operations",
 *            "unitDescription": "An effective cybersecurity practitioner requires knowledge from multiple disciplines, including computer science, mathematics..."
 *        }
 *    }
 * }
 *
 * Response:
 * - Returns a JSON object with keys being the unit codes and their respective values being an integer score in the range [1,10].
 *
 * Example Response:
 * {
 *    "FIT5137": 8,
 *    "FIT5129": 5
 * }
 *
 * Status Codes:
 * - 200: Success, returns the JSON response with similarity scores.
 * - 500: Internal Server Error, if any server-side errors occur during processing.
 */
router.post("/compareUnits", async (req, res) => {
  try {
    // Extract the source unit and comparison units from the request body
    const unitSRC = req.body.unitSRC;
    const unitsToCompare = req.body.unitsToCompare;

    // Construct the prompt to be sent to the AI model for comparison
    const prompt =
      "Please analyse the similarity between the selected home unit and all possible target units.\n" +
      "Selected home unit: " + JSON.stringify(unitSRC) + "\n" +
      "All possible target units: " + JSON.stringify(unitsToCompare) + "\n" +
      "Please provide your analysis results in the format of a JSON object.\n" +
      "The keys of the JSON object should be the unit code of each of the possible target units, and the values should be the similarity score between the selected home unit and the possible target unit.\n" +
      "The similarity score should be an integer in range [1,10] inclusive, with 10 being extremely similar and 1 being not similar at all.\n" +
      "Do not include anything other than the pure JSON object code. For example, do not provide '```json' at the start of the JSON object code.\n" +
      "Do not provide any other text aside from the JSON object code."

    // Query the AI model with the constructed prompt
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    return res.json(text);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
