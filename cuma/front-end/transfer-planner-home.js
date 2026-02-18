// Set home university
DEFAULT_HOME_UNIVERSITY = "Monash"





// ---------- Transfer Planner Home ---------- //
const maxPlanners = 5;
const transferPlannerHome = document.getElementById("transfer-planner-home");
const plannerList = document.getElementById('planner-list');
const emptyMessage = document.getElementById('empty-message');
const createButton = document.getElementById('create-planner');
const createNewPlanModal = document.getElementById('create-new-plan');
const closeCreateNewPlanModal = document.getElementById('close-create-new-plan-modal');



// // Load existing planners from local storage or create sample data
let planners = null;
setupGreeting();
setupDate();
fetchAndPopulateTransferPlan();

// Retrieve user name and setup greetings
function setupGreeting() {
    const greeting = document.getElementById("greeting");
    Backend.Auth.getUserInfo()
    .then( response => {
        if (response.status === 200) {
            greeting.textContent = `Hello, ${response.data.firstName}!`;
        } else {
            greeting.textContent = `Hello, Student!`;
        }
    })
    .catch(error => {
        console.log(error);
        greeting.textContent = `Hello, Student!`;
    });
}

// Setup with today's date
function setupDate() {
    // Display today's date
    const dateElement = document.getElementById('date');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString(undefined, options);
}

// Fetch the data and populate the transfer list
function fetchAndPopulateTransferPlan() {
    (async () => {
        try {
            planners = await getAllTransferPlans();
            renderPlanners();
        } catch (error) {
            console.error("An error occurred while fetching planners:", error);
        }
    })();
}

// Render the list of Planners
function renderPlanners() {
    plannerList.innerHTML = '';

    if (planners.length === 0) {
        emptyMessage.classList.remove('hidden');
        plannerList.classList.add('hidden');
    } else {
        emptyMessage.classList.add('hidden');
        plannerList.classList.remove('hidden');

        planners.forEach((planner, index) => {
            const plannerItem = document.createElement('div');
            plannerItem.className = 'planner-item';
            plannerItem.innerHTML = `
                <span>${planner.name}</span>
                <div class="dates-and-delete">
                    <span id="last-update">Last Update: ${formatDateTime(planner.updatedAt)}</span>
                    <button>🗑️</button>
                </div>
            `;

            // Redirect when the planner item (excluding the delete button) is clicked
            plannerItem.addEventListener("click", () => {
                window.location.href = `/transfer-plans/planner?name=${planner.name}`;
            });

            // Add event listener to the delete button
            const deleteButton = plannerItem.querySelector('button');
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the click event from bubbling up
                deletePlanner(index);    // Call your delete function
            });

            plannerList.appendChild(plannerItem);
        });
    }
}

// Util - Covert and formate date time from iso
function formatDateTime(dateTime) {
    const date = new Date(dateTime);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Format and return the date and time
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// delete planner ui and from db
function deletePlanner(index) {
    const plannerName = planners[index].name;

    const deleteButton = document.querySelectorAll('.planner-item button')[index];
    deleteButton.disabled = true; // Disable button to prevent multiple clicks

    // deletes from db
    (async () => {
        try {
            await deleteTransferPlan(plannerName);
            
            // delete from list and re-render
            planners.splice(index, 1);
            renderPlanners();
        } catch (error) {
            console.error("An error occurred while deleting the transfer plan:", error);
            deleteButton.disabled = false; // Re-enable the button if the deletion fails
        }
    })();
}

// Create new planner button logic
createButton.addEventListener('click', () => {
    // Populate university transfer options
    setUpTransferUniOptions();
    createNewPlanModal.classList.remove('hidden');
});

// Set up Universities to choose from
async function setUpTransferUniOptions() {
    const selectElement = document.getElementById("transfer-university");

    Backend.Unit.getAllOtherUni(DEFAULT_HOME_UNIVERSITY)
        .then(otherUniversities => {

            otherUniversities.forEach(universityObj => {
                const { universityName } = universityObj;
                const option = document.createElement("option");
                option.value = universityName; // Set the value attribute
                option.textContent = universityName; // Set the displayed text

                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            // Log and handle the error (e.g., showing an error message to the user)
            console.error("Error fetching other universities:", error);
            alert("Failed to load universities. Please try again later.");
        });
}

// ---------- Create New Planner Logic ---------- //
const createNewPlanContainer = document.getElementById("create-new-plan");
const courseLevel = document.getElementById('course-level');
const course = document.getElementById('course');
const studyYear = document.getElementById('study-year');
const studyPeriod = document.getElementById('study-period');
const transferUniversity = document.getElementById('transfer-university');
const planName = document.getElementById('plan-name');

// close modal logic
closeCreateNewPlanModal.addEventListener('click', () => {
    // clear value from selector and input
    courseLevel.selectedIndex = 0;
    course.selectedIndex = 0;
    studyYear.selectedIndex = 0;
    studyPeriod.selectedIndex = 0;
    transferUniversity.selectedIndex = 0;
    planName.value = "";

    // hide the modal
    createNewPlanModal.classList.add('hidden');
});

// On Create new Transfer plan form submit update database and configure then show the planner
document.querySelector('.transfer-plan-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Create an object to store the data
    const formData = {
        courseLevel: courseLevel.value,
        course: course.value,
        studyYear: studyYear.value,
        studyPeriod: studyPeriod.value,
        transferUniversity: transferUniversity.value,
        planName: planName.value
    };

    // Create new entry in database
    (async () => {
        try {
            let newTransferPlan = null;
            newTransferPlan = await createTransferPlan(formData);
            window.location.href = `/transfer-plans/planner?name=${newTransferPlan.name}`;
        } catch (error) {
            console.error("An error occurred while creating the transfer plan:", error);
        }
    })();
});