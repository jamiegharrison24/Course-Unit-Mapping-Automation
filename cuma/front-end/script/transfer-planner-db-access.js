// CRUD functions to allow operation on Student Transfer Planner DB
// Must import into the html to use

// Create new student data
async function createTransferPlan(createPlannerForm) {
    try {
        const response = await Backend.TransferPlan.create(createPlannerForm);
        if (response.status === 201) {
            return response.result.transferPlan;
        } else {
            console.error("An error occurred:", response.result.error);
            alert("An error occurred: " + response.result.error);
            return null;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message);
        return null;
    }
}

// Get all of student transfer plan
async function getAllTransferPlans() {
    try {
        const response = await Backend.TransferPlan.getAll();
        if (response.status === 200) {
            const transferPlans = response.result.transferPlans || []; // Use 'transferPlans' as per backend response
            return transferPlans;
        } else {
            console.error(`Error ${response.status}: ${response.result.message}`);
            alert(`Error ${response.status}: ${response.result.message}`);
            return []; // Return an empty array if there is an error
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message);
        return [];
    }
}

// Get specific student transfer plan
async function getSpecificTransferPlan(plannerName) {
    try {
        const response = await Backend.TransferPlan.getSpecific(plannerName);
        if (response.status === 200) {
            return response.result.transferPlan;
        } else {
            console.error(`Error ${response.status}: ${response.result.error}`);
            alert(`Error ${response.status}: ${response.result.error}`);
            return null;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message);
        return null;
    }
}

// update specific student transfer plan
async function updateTransferPlan(planName, unitMappings) {
    return Backend.TransferPlan.update(planName, unitMappings)
        .then(response => {
            if (response.status === 200) {
                alert("Successfully updated the transfer plan.");
                return response.result.transferPlan;
            } else {
                alert("Error " + response.status + ": " + response.result.error);
                return null;
            }
        })
        .catch(error => {
            console.error("An error occurred:", error);
            alert("An error occurred: " + error.message);
            return null;
        });
}

// delet specific student transfer plan
async function deleteTransferPlan(planName) {
    try {
        const response = await Backend.TransferPlan.delete(planName);
        if (response.status === 200) {
            return true;
        } else {
            console.error(`Error ${response.status}: ${response.result.error}`);
            alert(`Error ${response.status}: ${response.result.error}`);
            return false;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message);
        return false;
    }
}
