let unitConnections = {};
let selectedUnitCode = null;
let isEditMode = false; // Track whether we're in add or edit mode
let foreignUnit = [];
const default_university = "Monash";


// Toggle the "Add Unit" form visibility
function toggleAddUnitForm() {
    const addUnitForm = document.getElementById('add-unit-form');
    const displayStyle = addUnitForm.style.display;

    // Toggle visibility
    if (displayStyle === 'none' || displayStyle === '') {
        addUnitForm.style.display = 'block';
    } else {
        addUnitForm.style.display = 'none';
        isEditMode = false; // Reset to add mode when hiding the form
        clearUnitForm();
    }
}


// Toggle the "Add Connection" form visibility
function toggleAddConnectionNewUnitForm() {
    const addConnectionForm = document.getElementById('add-connection-form');
    addConnectionForm.style.display = addConnectionForm.style.display === 'none' || addConnectionForm.style.display === '' ? 'block' : 'none';
}


// Reset input fields including select dropdowns
function clearUnitForm() {
    document.getElementById('form-unit-name').value = '';
    document.getElementById('form-unit-code').value = '';
    document.getElementById('form-unit-type').value = '';
    document.getElementById('form-unit-credit').value = '';
    document.getElementById('form-unit-level').value = '';
    document.getElementById('form-unit-overview').value = '';

    const unitType = document.getElementById('form-unit-type');
    unitType.selectedIndex = 0;
}


function clearConnectionForm() {
    document.getElementById('form-connection-name').value = '';
    document.getElementById('form-connection-institution').value = '';
    document.getElementById('form-connection-type').value = '';
    document.getElementById('form-connection-credit').value = '';
    document.getElementById('form-connection-level').value = '';
    document.getElementById('form-connection-overview').value = '';

    const connectionType = document.getElementById('form-connection-type');
    connectionType.selectedIndex = 0;
}


// Add or modify a unit
function addUnit() {
    const unitList = document.getElementById('unit-list');

    // Collect input values
    const unitName = document.getElementById('form-unit-name').value.trim();
    const unitCode = document.getElementById('form-unit-code').value.trim();
    const unitType = document.getElementById('form-unit-type').value.trim();
    const unitCredit = document.getElementById('form-unit-credit').value.trim();
    const unitLevel = document.getElementById('form-unit-level').value.trim();
    const unitOverview = document.getElementById('form-unit-overview').value.trim();
    const handbookURL = document.getElementById('form-handbookURL').value.trim();

    // Ensure fields are filled out
    if (!unitName || !unitCode || !unitType || !unitCredit || !unitLevel || !unitOverview || !handbookURL) {
        alert("Please fill out all fields.");
        return;
    }

    if (isEditMode) {
        // Modify existing unit
        const existingUnit = document.querySelector(`.unit[data-id='${selectedUnitCode}']`);
        if (existingUnit) {
            const newUnitBody = {
                "unitCode": unitCode,
                "unitName": unitName,
                "unitType": unitType,
                "unitLevel": unitLevel,
                "creditPoints": unitCredit,
                "unitDescription": unitOverview,
                "handBookURL": handbookURL
            }

            Backend.Unit.modify(default_university, selectedUnitCode, newUnitBody).then(response => {
                if (!handleResponse(response)) {
                    // if no error
                    repopulateResults()
                }
            });

            // existingUnit.dataset.name = unitName;
            // existingUnit.dataset.type = unitType;
            // existingUnit.dataset.credit = unitCredit;
            // existingUnit.dataset.level = unitLevel;
            // existingUnit.dataset.overview = unitOverview;

            // existingUnit.innerHTML = `
            //   <h4>${unitCode} - ${unitName}</h4>
            //   <p>Type: ${unitType}, Credits: ${unitCredit}, Level: ${unitLevel}</p>
            // `;
        }

        // Update the unitConnections if the unitCode was changed
        if (selectedUnitCode !== unitCode) {
            unitConnections[unitCode] = unitConnections[selectedUnitCode];
            delete unitConnections[selectedUnitCode];
        }

        selectedUnitCode = unitCode;
    } else {
        // add unit to mongoDB
        const unitBody = {
            "unitCode": unitCode,
            "unitName": unitName,
            "unitType": unitType,
            "unitLevel": unitLevel,
            "creditPoints": unitCredit,
            "unitDescription": unitOverview,
            "handBookURL": handbookURL
        }

        Backend.Unit.add(default_university, unitBody).then(response => {
            // handles any error
            if (handleResponse(response) == 0) {
                // if no error, then repopulate the result
                repopulateResults()
            }
        });
    }

    // Clear the input fields after adding or modifying
    clearUnitForm();

    // Hide the form again
    toggleAddUnitForm();

    // Refresh the displayed mapped units
    displayMappedUnits(selectedUnitCode);
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


async function repopulateResults() {
  const unitList = document.getElementById('unit-list');
  // remove all child units
  unitList.innerHTML = '';


  Backend.Unit.getAllUnitsFromUniversity(default_university)
  .then(UnitArray => 
    {
      for (const key in UnitArray)
      {
        // Create a new unit element
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit';

        // initialize unitDiv
        const unit = UnitArray[key];
        unitDiv.dataset.id = unit.unitCode;
        unitDiv.dataset.name = unit.unitName;
        unitDiv.dataset.type = unit.unitType;
        unitDiv.dataset.credit = unit.creditPoints;
        unitDiv.dataset.level = unit.unitLevel;
        unitDiv.dataset.overview = unit.unitDescription;
        unitDiv.dataset.universityName = unit.universityName;
        
        // Populate unit content
        unitDiv.innerHTML = `
        <h4>${unit.unitCode} - ${unit.unitName}</h4>
        <p>Type: ${unit.unitType}, Credits: ${unit.creditPoints}, Level: ${unit.unitLevel}</p>
        `;

        // Add click event to show details when clicked
        unitDiv.addEventListener('click', function () {
            selectUnit(unitDiv);
        });
        // Add the new unit to the list
        unitList.appendChild(unitDiv);
    }

    Backend.UnitConnection.getAllUserConnections().then(req => {
        if (req.connections && !req.error) {
            // Add the connections to the unitConnections object
            req.connections.map(connection => {
                const { unitAId, unitBId } = connection;
                if (unitAId && unitBId) {
                    // Add unit ids to both units if they don't exist
                    if (!unitConnections[unitAId]) {
                        unitConnections[unitAId] = [];
                    }
                    if (!unitConnections[unitBId]) {
                        unitConnections[unitBId] = [];
                    }
                    // Add the connection to both units ensuring no duplicates
                    if (!unitConnections[unitAId].includes(unitBId)) {
                        unitConnections[unitAId].push(unitBId);
                    }
                    if (!unitConnections[unitBId].includes(unitAId)) {
                        unitConnections[unitBId].push(unitAId);
                    }
                }
            });
        }
    });
    

    if (selectedUnitCode)
    {
      // Display the updated mapped units for the selected unit
      displayMappedUnits(selectedUnitCode);

    }


    })
  .catch(error => {
    console.error(error); // Handle errors here
  });
  
}


// Set form to edit mode with the selected unit's information
function modifyUnit() {
    if (!selectedUnitCode) {
        alert("No unit selected.");
        return;
    }

    const unitElement = document.querySelector(`.unit[data-id='${selectedUnitCode}']`);
    if (!unitElement) {
        alert("Invalid unit selected.");
        return;
    }

    // Populate form with existing values
    document.getElementById('form-unit-name').value = unitElement.dataset.name;
    document.getElementById('form-unit-code').value = unitElement.dataset.id;
    document.getElementById('form-unit-type').value = unitElement.dataset.type;
    document.getElementById('form-unit-credit').value = unitElement.dataset.credit;
    document.getElementById('form-unit-level').value = unitElement.dataset.level;
    document.getElementById('form-unit-overview').value = unitElement.dataset.overview;

    // Toggle the form and set to edit mode
    toggleAddUnitForm();
    isEditMode = true;
}


function deleteUnit() {
    if (!selectedUnitCode) {
        alert("No unit selected.");
        return;
    }

    // Confirm before deleting
    if (!confirm(`Are you sure you want to delete unit ${selectedUnitCode}?`)) {
        return;
    }

    // perform delete in mongodb
    Backend.Unit.delete(default_university, selectedUnitCode).then(response => {
        if (!handleResponse(response)) {
            // if no error, repopulate the data

            repopulateResults()
        }
    })

    delete unitConnections[selectedUnitCode];

    // Clear selected unit info
    selectedUnitCode = null;
    document.getElementById('display-unit-title').textContent = '';
    document.getElementById('display-unit-id').textContent = 'N/A';
    document.getElementById('display-unit-type').textContent = 'N/A';
    document.getElementById('display-unit-credits').textContent = 'N/A';
    document.getElementById('display-unit-level').textContent = 'N/A';
    document.getElementById('display-unit-description').textContent = 'Select a unit to see the details';
    document.getElementById('unit-connection-list').innerHTML = '<p>No mapped units available.</p>';

    // Hide the Modify and Delete buttons
    document.getElementById('modify-unit-button').style.display = 'none';
    document.getElementById('delete-unit-button').style.display = 'none';
}


function selectUnit(unitElement) {
    // Highlight the selected unit
    const units = document.querySelectorAll('.unit');
    units.forEach(unit => unit.classList.remove('selected'));
    unitElement.classList.add('selected');

    // Update the unit details section
    document.getElementById('display-unit-title').textContent = `${unitElement.dataset.id} - ${unitElement.dataset.name}`;
    document.getElementById('display-unit-id').textContent = unitElement.dataset.id;
    document.getElementById('display-unit-type').textContent = unitElement.dataset.type;
    document.getElementById('display-unit-credits').textContent = unitElement.dataset.credit;
    document.getElementById('display-unit-level').textContent = unitElement.dataset.level;
    document.getElementById('display-unit-description').textContent = unitElement.dataset.overview;

    // Set the current selected unit ID
    selectedUnitCode = unitElement.dataset.id;

    // Display mapped units for this selected unit
    displayMappedUnits(selectedUnitCode);

    // Show the Modify and Delete buttons
    document.getElementById('modify-unit-button').style.display = 'inline-block';
    document.getElementById('delete-unit-button').style.display = 'inline-block';
}


// Display mapped units for the given unit ID
function displayMappedUnits(unitCode) {
    const unitConnectionList = document.getElementById('unit-connection-list');
    unitConnectionList.innerHTML = '';

    const mappedUnitsSection = document.querySelector('.mapped-units');
    mappedUnitsSection.style.display = 'block';

    Backend.UnitConnection.getUnitConnection(default_university, unitCode).then(response => {
        if (response && response.connections) {
            response.connections.map(connection => {
                const connectionDiv = document.createElement('div');
                connectionDiv.className = 'connection';
                connectionDiv.innerHTML = `
              <h5>${connection.unitName}</h5>
              <p>Institution: ${connection.universityName}</p>
              <p>Type: ${connection.type}, Credits: ${connection.creditPoints}, Level: ${connection.unitLevel}</p>
              <p>${connection.unitDescription}</p>
          `;
                unitConnectionList.appendChild(connectionDiv);
            });
        }
        else {
            unitConnectionList.innerHTML = '<p>No mapped units available.</p>';
        }
    });
}


// Add a new unit connection
function addConnectionNewUnit() {
    if (!selectedUnitCode) {
        alert("Please select a course unit to add the connection to.");
        return;
    }

    // Collect input values
    const connectionName = document.getElementById('form-connection-name').value.trim();
    const connectionCode = document.getElementById('form-connection-code').value.trim();
    const connectionInstitution = document.getElementById('form-connection-institution').value.trim();
    const connectionType = document.getElementById('form-connection-type').value.trim();
    const connectionCredit = document.getElementById('form-connection-credit').value.trim();
    const connectionLevel = document.getElementById('form-connection-level').value.trim();
    const connectionOverview = document.getElementById('form-connection-overview').value.trim();

    // Ensure all fields are filled out
    if (!connectionName || !connectionCode || !connectionInstitution || !connectionType || !connectionCredit || !connectionLevel || !connectionOverview) {
        alert("Please fill out all fields.");
        return;
    }

    // Create new unit object
    const unitBody = {
        "unitCode": connectionCode,
        "unitName": connectionName,
        "unitType": connectionType,
        "unitLevel": connectionLevel,
        "creditPoints": connectionCredit,
        "unitDescription": connectionOverview
    }

    // Add new unit to DB
    Backend.Unit.add(connectionInstitution, unitBody).then(response => {
        // Handle error in adding new unit  
        if (handleResponse(response) == 0) {
            // Create unitConnectionInfo
            const unitConnectionInfo = {
                "universityNameA": connectionInstitution,
                "unitCodeA": connectionCode,
                "universityNameB": default_university,
                "unitCodeB": selectedUnitCode
            }

            // Add new connection to DB
            Backend.UnitConnection.add(unitConnectionInfo).then(response => {
                // Handel error in adding new connection
                // TODO: fix after
                    // Create a new connection object
                    const newConnection = {
                        name: connectionName,
                        code: connectionCode,
                        institution: connectionInstitution,
                        type: connectionType,
                        credit: connectionCredit,
                        level: connectionLevel,
                        overview: connectionOverview
                    };

                    // Add the new connection to the appropriate unit
                    if (unitConnections[selectedUnitCode]) {
                        unitConnections[selectedUnitCode].push(newConnection);
                    }

                    // Clear the input fields after adding
                    clearConnectionForm();

                    // Hide the form again
                    toggleAddConnectionNewUnitForm();

                    // Display the updated mapped units for the selected unit
                    repopulateResults()
                
                }

            );

        }
    });
}


// toggle add conection
function toggleAddConnection() {
    // close any exisiting add connection forms
    const addConnectionNewUnitSection = document.getElementById('add-connection-form');
    if (addConnectionNewUnitSection) {
        addConnectionNewUnitSection.style.display = 'none'
    }
    const addConnectionExistingUnitSection = document.getElementById('add-connection-existing-unit-form');
    if (addConnectionExistingUnitSection) {
        clearUnitSearchBarConnection()
        addConnectionExistingUnitSection.style.display = 'none'
    }

    // open add connection entry modal
    const addConnectionSection = document.getElementById('add-connection');
    addConnectionSection.style.display = addConnectionSection.style.display === 'none' || addConnectionSection.style.display === '' ? 'block' : 'none';
}


function toggleAddConnectionNewUnit() {
    // replace the current entry modal with add connection form (new unit) instead
    toggleAddConnection()
    toggleAddConnectionNewUnitForm()
}


function toggleAddConnectionExisitingUnit() {
    // replace the current entry modal with add connection form (existing unit) instead
    toggleAddConnection()
    toggleAddConnectionExistingUnitForm()
}


function toggleAddConnectionExistingUnitForm() {
    // replace the current entry modal with add connection form (new unit) instead
    const addConnectionExistingUnitForm = document.getElementById('add-connection-existing-unit-form');
    const displayStyle = addConnectionExistingUnitForm.style.display;

    // Toggle visibility
    if (displayStyle === 'none' || displayStyle === '') {
        addConnectionExistingUnitForm.style.display = 'block';
    } else {
        addConnectionExistingUnitForm.style.display = 'none';
        clearUnitSearchBarConnection()

    }

    showAllForeignUnits()
}


function clearUnitSearchBarConnection() {
    const searchConnectionBar = document.getElementById("unit-search-bar-connection");
    searchConnectionBar.innerHTML = '';
}


function showAllForeignUnits() {
    // foriegn connection
    const foreignUnitsSection = document.getElementById("foreign-unit-list")

    Backend.Unit.getAllUnitsNotInUniversity(default_university).then(UnitArray => {

        for (const key in UnitArray) {
            // Create a new unit element
            const unitDiv = document.createElement('div');
            unitDiv.className = 'foreign-unit';

            // initilise unitDiv
            const unit = UnitArray[key];
            unitDiv.dataset.id = unit.unitCode;
            unitDiv.dataset.name = unit.unitName;
            unitDiv.dataset.type = unit.unitType;
            unitDiv.dataset.credit = unit.creditPoints;
            unitDiv.dataset.level = unit.unitLevel;
            unitDiv.dataset.overview = unit.unitDescription;
            unitDiv.dataset.universityName = unit.universityName

            // Populate unit content
            unitDiv.innerHTML = `
          <h4>${unit.unitName}</h4>
          <p>Institution: ${unit.universityName}</p>
          <p>Type: ${unit.type}, Credits: ${unit.creditPoints}, Level: ${unit.unitLevel}</p>
          <p>${unit.unitDescription}</p>
        `;

            // Add click event to show details when clicked
            unitDiv.addEventListener('click', function () {
                addConnectionExistingUnit(unitDiv);
            });

            // Add the new unit to the list
            foreignUnitsSection.appendChild(unitDiv);
        }
    })
        .catch(error => {
            console.error(error); // Handle errors here
        });

}


function addConnectionExistingUnit(foeignUnitDiv) {
    if (!selectedUnitCode) {
        alert("Please select a course unit to add the connection to.");
        return;
    }

    const existingUnit = document.querySelector(`.unit[data-id='${selectedUnitCode}']`);

    const universityNameA = existingUnit.dataset.universityName;
    const unitCodeA = existingUnit.dataset.id;
    const universityNameB = foeignUnitDiv.dataset.universityName;
    const unitCodeB = foeignUnitDiv.dataset.id;

    //confirm 

    if (!confirm(`Confirm add unit "${unitCodeB}" as a connection to unit "${unitCodeA}"?`)) {
        return;
    }

    foeignUnitDiv.classList.remove("selected");

    const unitInfo = {
        "universityNameA": universityNameA,
        "unitCodeA": unitCodeA,
        "universityNameB": universityNameB,
        "unitCodeB": unitCodeB
    }

    Backend.UnitConnection.add(unitInfo).then(response => {
        handleResponse(response);
        repopulateResults();
    });
}

async function getTopThreeSimilarUnits() {
    const foreignUnitDescription = document.getElementById('foreign-unit-description').value.trim();

    // Check if the description is too short
    if (foreignUnitDescription.length < 100) { // Adjust the length threshold as needed
        alert("Please enter a longer unit description (at least 100 characters).");
        return;
    }

    if (!foreignUnitDescription) {
        alert("Please enter a unit description.");
        return;
    }

    // Fetch all units from Monash
    const monashUnits = await Backend.Unit.getAllUnitsFromUniversity(default_university);

    const similarityScores = [];

    function getSimilarity(s1, s2) {
        // Get similarity using cosine similarity
        const tokenize = text => {
            return text.toLowerCase().match(/\b(\w+)\b/g);
        };
        const termFreqMap = tokens => {
            const freqMap = {};
            tokens.forEach(token => {
                freqMap[token] = (freqMap[token] || 0) + 1;
            });
            return freqMap;
        };
        const addKeysToDict = (map, dict) => {
            for (let key in map) {
                dict[key] = true;
            }
        };
        const dotProduct = (mapA, mapB) => {
            let sum = 0;
            for (let key in mapA) {
                if (mapB.hasOwnProperty(key)) {
                    sum += mapA[key] * mapB[key];
                }
            }
            return sum;
        };
        const magnitude = map => {
            let sum = 0;
            for (let key in map) {
                sum += map[key] * map[key];
            }
            return Math.sqrt(sum);
        };
        const tokensA = tokenize(s1);
        const tokensB = tokenize(s2);

        const freqMapA = termFreqMap(tokensA);
        const freqMapB = termFreqMap(tokensB);

        const dict = {};
        addKeysToDict(freqMapA, dict);
        addKeysToDict(freqMapB, dict);

        const dotProd = dotProduct(freqMapA, freqMapB);
        const magnitudeA = magnitude(freqMapA);
        const magnitudeB = magnitude(freqMapB);

        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        return dotProd / (magnitudeA * magnitudeB);
    }

    // Iterate through Monash units and calculate similarity scores
    for (const key in monashUnits) {
        const unit = monashUnits[key];
        const similarity = getSimilarity(foreignUnitDescription, unit.unitDescription);
        similarityScores.push({ unit, similarity });
    }

    // Sort by similarity in descending order
    similarityScores.sort((a, b) => b.similarity - a.similarity);

    const recommendedUnitDiv = document.getElementById('recommended-unit');
    recommendedUnitDiv.innerHTML = ''; // Clear previous results

    // Display the top 3 most similar units
    const topThree = similarityScores.slice(0, 3);
    topThree.forEach(({ unit, similarity }, index) => {
        recommendedUnitDiv.innerHTML += `
            <div class="recommended-unit">
                <h4>${index + 1}. ${unit.unitCode} - ${unit.unitName}</h4>
                <p>Similarity Score: ${(similarity * 100).toFixed(2)}%</p>
                <p>Type: ${unit.unitType}, Credits: ${unit.creditPoints}, Level: ${unit.unitLevel}</p>
                <p>${unit.unitDescription}</p>
            </div>
        `;
    });

    if (topThree.length === 0) {
        recommendedUnitDiv.innerHTML = '<p>No similar units found.</p>';
    } else {
        recommendedUnitDiv.style.backgroundColor = '#e0f7fa';
    }
}

// Attach the function to the form submission
if (window.location.pathname.includes('foreign-unit-reccomendation.html')) {
    document.getElementById('foreign-unit-form').addEventListener('submit', function(event) {
        event.preventDefault();
        getTopThreeSimilarUnits();
    });
}


// call every render
document.addEventListener('DOMContentLoaded', () => {
    repopulateResults();
});


function editProfile() {
    // Get all the profile input fields
    const inputs = document.querySelectorAll('.profile-details input');
    
    // Enable editing by removing the 'readonly' attribute
    inputs.forEach(input => input.removeAttribute('readonly'));

    // Show Save button and hide Edit button
    document.getElementById('edit-button').style.display = 'none';
    document.getElementById('save-button').style.display = 'inline-block';
}

function saveProfile() {
    // Get all the profile input fields
    const inputs = document.querySelectorAll('.profile-details input');
    
    inputs.forEach(input => {
        console.log(`${input.id}: ${input.value}`);
    });
    
    // Disable editing by adding the 'readonly' attribute back
    inputs.forEach(input => input.setAttribute('readonly', 'readonly'));

    // Hide Save button and show Edit button
    document.getElementById('edit-button').style.display = 'inline-block';
    document.getElementById('save-button').style.display = 'none';
}

