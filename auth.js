const unitConnectionBackendPath = "/api/unitConnection"

/*
    unitConnectionInfo:

    E.g. req.body =
    {
        "universityNameA": "testUniversity",
        "unitCodeA": "TEST1830",
        "universityNameB": "Monash",
        "unitCodeB": "MAT1830"
    } 

    works with post request to /api/unitConnection
*/
/**
 * Adds unit connection
 * @param {Object} unitConnectionInfo Information about connection (as structured above)
 * @returns error message or success message
 */
Backend.UnitConnection.add = async function (unitConnectionInfo) {
    return await Backend.UnitConnection.update(unitConnectionInfo, "/add");
}

/**
 * Deletes unit connection
 * @param {Object} unitConnectionInfo Information about connection (as structured above)
 * @returns error message or success message
 */
Backend.UnitConnection.delete = async function (unitConnectionInfo) {
    return await Backend.UnitConnection.update(unitConnectionInfo, "/delete");
}

/**
 * Updates unit connections (either adding or delete a connection)
 * @param {Object} unitConnectionInfo Information about connection (as structured above)
 * @param {String} subpath subpath (add or delete)
 * @returns error message or success message
 */
Backend.UnitConnection.update = async function (unitConnectionInfo, subpath) {
    try {
        const response = await fetch(serverPath + unitConnectionBackendPath + subpath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(unitConnectionInfo),
        });
        return response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

/**
 * Fetches unit connections from the source university for specific user
 * If target university is specified, fetches the specific connection between source and target universities.
 * @param {string} sourceUni - The source university name.
 * @param {string} unitCode - The unit code.
 * @param {string|null} [targetUni=null] - The target university name (optional).
 * @returns {Promise<object>} The unit connection result.
 */
Backend.UnitConnection.getUnitConnection = async function (sourceUni, unitCode) {
    // Validate parameters
    if (sourceUni == null || unitCode == null) {
        return;
    }

    // Build parameters object
    const params = { sourceUni, unitCode };
    const subpath = "/getSpecific";

    try {
        // Construct the URL with query parameters
        const url = new URL(serverPath + unitConnectionBackendPath + subpath);
        url.search = new URLSearchParams(params).toString();

        // Fetch the response
        const response = await fetch(url);

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse and log the result
        return response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

Backend.UnitConnection.getAllUserConnections = async function () {
    try {
        const response = await fetch(serverPath + unitConnectionBackendPath + "/getAllUserConnections");
        return response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}
