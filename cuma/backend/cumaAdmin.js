const cumaBackendPath = "/api/cuma-admin/"

Backend.Admin.getAllUsers = async function () {
    try {
        const url = new URL(serverPath + cumaBackendPath + "users");

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log({ result: result, status: response.status });
        return { result: result, status: response.status };
    } catch (error) {
        console.log("Error:", error);
    }

};

Backend.Admin.getUser = async function (userId) {
    try {
        const url = new URL(serverPath + cumaBackendPath + "users/" + userId);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log({ result: result, status: response.status });
        return { result: result, status: response.status };
    } catch (error) {
        console.log("Error:", error);
    }

}

Backend.Admin.approveUserRole = async function (userId) {
    try {
        const url = new URL(serverPath + cumaBackendPath + "approve-user/" + userId);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log({ result: result, status: response.status });
        return { result: result, status: response.status };
    } catch (error) {
        console.log("Error:", error);
    }
}

Backend.Admin.rejectUserRole = async function (userId) {
    try {
        const url = new URL(serverPath + cumaBackendPath + "reject-user/" + userId);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log({ result: result, status: response.status });
        return { result: result, status: response.status };
    } catch (error) {
        console.log("Error:", error);
    }
}

Backend.Admin.updateUserRole = async function (userId, role) {
    try {
        const url = new URL(serverPath + cumaBackendPath + "users/update-role/" + userId);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({role: role }),
        });
        const result = await response.json();
        console.log({ result: result, status: response.status });
        return { result: result, status: response.status };
    } catch (error) {
        console.log("Error:", error);
    }
}

Backend.Admin.deleteUser = async function (userId) {
    try {
        const url = new URL(serverPath + cumaBackendPath + "users/" + userId);

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log({ result: result, status: response.status });
        return { result: result, status: response.status };
    } catch (error) {
        console.log("Error:", error);
    }
}