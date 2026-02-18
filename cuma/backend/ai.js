const aiPath = "/api/ai";

Backend.AI.AIMatch = async function (unitSRC, unitsToCompare) {
  /**
   * Makes a POST request to the server-side Gemini AI API to compare units.
   *
   * @param {Object} unitSRC - The source unit object to be compared.
   * @param {Object} unitsToCompare - The set of units to compare against the source unit.
   *
   * The `unitSRC` and `unitsToCompare` parameters should each be an object where:
   * - The keys are unit codes (e.g., "FIT3171").
   * - The values are objects containing the unit's title and description.
   *
   * @returns {Promise<Object>} - A promise that resolves to an object containing:
   *   - `result`: The JSON response from the AI comparison, with unit codes as keys and similarity scores as values.
   *   - `status`: The HTTP status code of the response.
   *
   * If an error occurs during the request, the function will log the error to the console.
   */

  try {
    const url = new URL(serverPath + aiPath + "/compareUnits");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unitSRC: unitSRC,
        unitsToCompare: unitsToCompare,
      }),
    });

    const statusCode = response.status;
    const result = await response.json();
    return { result: result, status: statusCode };
  } catch (error) {
    console.log("Error:", error);
  }
};
