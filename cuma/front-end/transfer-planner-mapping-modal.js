

// var definition
// other variables will be referenced from transfer-planner-home.js and transfer-planner-mapping.js
var homeUniversity = ""
var targetUniversity = ""

const currentCourse = {
    "courseCode": "SFTWRENG01",
    "courseName": "Software engineering"
};





function openModal(){
    overlay.style.display = "block";
    const addCustomUnitModal = document.getElementById("add-custom-unit-modal");
    addCustomUnitModal.style.display = "block";
    // overlay.style.display = "block";


}



async function addCustomUnit(){
        // Collect input values
        const unitName = document.getElementById('form-unit-name').value.trim();
        const unitCode = document.getElementById('form-unit-code').value.trim();
        const unitType = document.getElementById('form-unit-type').value.trim();
        const unitCredit = document.getElementById('form-unit-credit').value.trim();
        const unitLevel = document.getElementById('form-unit-level').value.trim();
        const unitOverview = document.getElementById('form-unit-overview').value.trim();
        const unitLearningOutcome = document.getElementById('form-learning-outcome').value.trim();
    
        // Ensure fields are filled out
        if (!unitName || !unitCode || !unitType || !unitCredit || !unitLevel || !unitOverview || !unitLearningOutcome) {
            alert("Please fill out all fields.");
            return;
        }

        const customUnit = 
            {
                "universityName": getUniName(),
                "unitCode": unitCode,
                "unitName": unitName,
                "unitDescription": unitOverview,
                "unitType": unitType,
                "unitLevel": unitLevel,
                "creditPoints": unitCredit,
                "learningOutcome":unitLearningOutcome,
                "course": [
                    currentCourse
                ],
                "offering": ["semester 1", "semester 2"],
                "handBookURL": null,
                "connections": [],
                "isCustomUnit": true
            }

        console.log(getUniName());

        // add to unitList
        allUnits.push(customUnit)
        
        // re-render all the units
        renderUnitsInModal(slotIDForModal, allUnits)

        await Backend.TransferPlan.addCustomUnit(customUnit).then(response => {
            if (!handleResponse(response)) {
                // if no error
                closeCustomUnitModal("unit-added")
            }
        });

}

function closeCustomUnitModal(confirmTextType) {

    var confirmText = ""
    
    if (confirmTextType === "cancel"){
        confirmText = "Changes in this modal won't be saved. Are you sure you want to close this modal?"
    }
    else if (confirmTextType === "unit-added"){
        confirmText = "This unit has been added"
    }


    const addCustomUnitModal = document.getElementById("add-custom-unit-modal");
    
    if (addCustomUnitModal.style.display != "none"){
        // confirm the user if they want to close the modal
        const confirmPrompt = confirm(confirmText)
        if (confirmPrompt)
        {
            overlay.style.display = "none";
            addCustomUnitModal.style.display = "none";
        }else{
            overlay.style.display = "block"
        }

    }
}

function handleResponse(response) {
    /**
     * Handles the response from the API based on the response status code
     * It displays the error on the web tier (front-end) if there is an error
     * 
     * Input - 
     *  response: {
     *    result: str,  
     *    code: int
     *  }
     * 
     * Returns 
     * 1 - if there's an error in the response
     * 0 - if there's no error
     * 
     */
    if (response.status == 400) {
        alert("Error: " + response.result)
        return 1
    } else if (response.ok != null && !response.ok) {
        // If response is not OK, handle the error status
        alert(response.error);
        return 1
    }
    return 0
}

overlay.addEventListener('click', () => {
    closeCustomUnitModal("cancel");
})