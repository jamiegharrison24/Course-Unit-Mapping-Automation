const transferPlanBackendPath = "/api/transferPlan";


// Create new planner using the form data
Backend.TransferPlan.create = async function (createPlannerForm) {
  try {
    const url = new URL(serverPath + transferPlanBackendPath + "/create");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ createPlannerForm }),
    });

    const result = await response.json();

    return { result: result, status: response.status };

  } catch (error) {
    console.error("Error:", error);
    return { result: null, status: 500, error: error.message };
  }
};

// Get all the existing planners from the database
Backend.TransferPlan.getAll = async function () {
  try {
    const url = new URL(serverPath + transferPlanBackendPath + "/all");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return { result: result, status: response.status };

  } catch (error) {
    console.error("Error fetching transfer plans:", error);
    return { result: null, status: 500, error: error.message };
  }
};

// Get one specific planner
Backend.TransferPlan.getSpecific = async function (plannerName) {
  try {
    const url = new URL(serverPath + transferPlanBackendPath + `/plan/${encodeURIComponent(plannerName)}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return { result: result, status: response.status };

  } catch (error) {
    console.error("Error:", error);
    return { result: null, status: 500, error: error.message };
  }
};

// Update an existing transfer plan using form data
Backend.TransferPlan.update = async function (planName, unitMappings) {
  try {
    const url = new URL(serverPath + transferPlanBackendPath + `/plan/${encodeURIComponent(planName)}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unitMappings }),
    });

    const result = await response.json();

    return { result: result, status: response.status };

  } catch (error) {
    console.error("Error:", error);
    return { result: null, status: 500, error: error.message };
  }
};

// Delete a transfer plan
Backend.TransferPlan.delete = async function (planName) {
  try {
    const url = new URL(serverPath + transferPlanBackendPath + `/plan/${encodeURIComponent(planName)}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return { result: result, status: response.status };

  } catch (error) {
    console.error("Error:", error);
    return { result: null, status: 500, error: error.message };
  }
};

// add persistent custom units in the transfer plan
Backend.TransferPlan.addCustomUnit = async function (unitInfo) {
  
  try {
    const url = new URL(serverPath + transferPlanBackendPath + `/custom-unit`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({unitInfo }),
    });

    const result = await response.json();

    return { result: result, status: response.status };

  } catch (error) {
    console.error("Error:", error);
    return { result: null, status: 500, error: error.message };
  }
};


// add persistent custom units in the transfer plan
Backend.TransferPlan.getAllCustomUnitsFrom = async function (universityName) {

  console.log("called")

  const params = {"universityName": universityName}

  try {
    const url = new URL(serverPath + transferPlanBackendPath + "/getall-custom-units");
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url, {
      method: "GET"
    });

    const result = await response.json();

    return { result: result, status: response.status };

  } catch (error) {
    console.error("Error:", error);
    return { result: null, status: 500, error: error.message };
  }
};

