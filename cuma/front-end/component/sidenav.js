

const sidenav = document.createElement("template");

var navOpen = true

style = `
    /* Sidebar Styling */
    .sidebar {
        position: fixed;
        left: 0;
        bottom: 0;
        top: 75px;
        background-color: #f4f6f9;
        width: 200px;
        z-index: 100;
        padding-top: 10px;
        border-right: 1px solid lightgray;
        border-top: 0;
        border-left: 0;
        border-bottom: 0;
        transition: background-color 0.3s, color 0.3s;
    }

    .sidebar.dark-mode {
        background-color: #333; /* Dark Mode Background for Sidebar */
        color: #e0e0e0; /* Sidebar text color in dark mode */
    }

    .sidebar-link {
        padding: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: rgb(80, 80, 80);
        font-size: 20px;
        transition: background-color 0.3s, color 0.3s;
        text-decoration: none;
        width: 100%;
    }

    .sidebar-link.dark-mode {
        color: #e0e0e0; /* Light text color for dark mode */
    }

    .sidebar-link:hover {
        background-color: rgba(154, 179, 251, 0.5);
        border-radius: 10px;
    }

    .sidebar-link.dark-mode:hover {
        background-color: rgba(255, 255, 255, 0.1); /* Lighten hover effect in dark mode */
        color: #ffffff; /* Ensure hover text is visible */
    }

    .sidebar-img {
        height: 30px;
        width: 30px;
        margin-right: 10px;
    }

    .sidebar-img.dark-mode {
        filter: invert(1); /* Invert image colors for dark mode */
    }

    /* Button Styling */
    body button.openbtn {
        background-color: transparent;
        margin: 0;
    }

    body button.closebtn {
        margin-bottom: 0;
        align-self: flex-end;
        padding: 0;
        font-size: x-large;
        color: black;
        background-color: transparent;
    }

    body button.closebtn:hover {
        color: #3b90d5;
        background-color: transparent;
    }

    nav .closebtn-block {
        display: flex;
        justify-content: flex-end;
    }

    nav #sidebar-content {
        display: block;
        padding: 10px;
        width: 150px;
    }

    /* Apply Hover Effect and Transitions */
    .sidebar a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: rgb(80, 80, 80);
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        padding: 15px;
        font-size: 18px;
        width: 100%;
    }

    .sidebar-link:hover {
        background-color: rgba(154, 179, 251, 0.5);
        border-radius: 10px;
    }

    .sidebar-img {
        margin-right: 10px;
        width: 30px;
        height: 30px;
    }

    /* Header Styling */
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        transition: background-color 0.3s, color 0.3s;
    }

    header.dark-mode {
        background-color: #1f1f1f; /* Dark Mode Background for Header */
        color: #e0e0e0; /* Dark mode text color for header */
    }

    .burger-bar-icon {
        width: 40px;
        height: 40px;
        margin-right: 20px;
        transition: filter 0.3s;
    }

    .burger-bar-icon.dark-mode {
        filter: invert(1); /* Invert Image Colors for Dark Mode */
    }

    .user-info {
        margin-left: auto;
        text-align: right;
        color: rgb(80, 80, 80);
    }

    .user-info.dark-mode {
        color: rgb(200, 200, 200); /* Dark Mode Text Color */
    }

    /* Dark Mode Body Background and Text */
    body {
        background-color: white;
        color: black;
        transition: background-color 0.3s, color 0.3s;
    }

    body.dark-mode {
        background-color: #121212;
        color: #ffffff;
    }

    /* Light Mode (default) */
    .profile-info, .profile-details {
        background-color: white;
        color: black;
        padding: 20px;
        margin: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Dark Mode */
    body.dark-mode .profile-info,
    body.dark-mode .profile-details {
        background-color: #1f1f1f; /* Dark background for profile sections */
        color: #ffffff; /* White text color */
        box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1); /* Softer shadow for dark mode */
    }

    body.dark-mode input {
        background-color: #333; /* Dark background for inputs */
        color: white; /* White text color */
    }

    body.dark-mode button {
        background-color: #444;
        color: white;
    }

    body.dark-mode .profile-detail-element h3 {
        color: #ffffff; /* White heading color in dark mode */
    }
`

sidenav.innerHTML = `
    <style>${style}</style>
    <nav class="sidebar" id="sidebar">
        <div id="sidebar-content">
            <a href="/transfer-plans" class="sidebar-link" id="planner-link">
                <img src="images/planner.png" class="sidebar-img" alt="Planner"> Planner
            </a>
            <a href="/mapping" class="sidebar-link" id="mapping-link">
                <img src="images/mapping.png" class="sidebar-img" alt="Mapping"> Mapping
            </a>
            <a href="/unit-info" class="sidebar-link" id="unit-info-link">
                <img src="images/bl_1645_Search_seo_magnifier_earth_globe_internet-512.webp" class="sidebar-img" alt="Unit Info"> Unit Info
            </a>
            <a href="/profile" class="sidebar-link" id="profile-link">
                <img src="images/icons8-person-96.png" class="sidebar-img" alt="Profile"> Profile
            </a>
            <a href="javascript:void(0)" class="sidebar-link" id="send-connections-link" onclick="userSendConnections()">
                <img src="images/email.png" class="sidebar-img" alt="Send Connections"> Send Connections
            </a>
            <a href="javascript:void(0)" class="sidebar-link" id="logout-link" onclick="userLogout()">
                <img src="images/logout.png" class="sidebar-img" alt="Logout"> Logout
            </a>
        </div>
    </nav>
`;

class Sidenav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(sidenav.content.cloneNode(true));
    }

    connectedCallback() {
        document.addEventListener('userInfoReady', (event) => {
            const user = event.detail;
            this.adjustVisibilityByRole(user.role);
        });

        const initialRole = localStorage.getItem('userRole');
        if (initialRole) {
            this.adjustVisibilityByRole(initialRole);
        }
    }

    adjustVisibilityByRole(role) {
        this.setupSideNav(role);
    }

    setupSideNav(role) {
        const elementsToHide = {
            'student': ['#mapping-link', '#add-unit-link', '#send-connections-link'],
            'general_user': ['#mapping-link', '#add-unit-link', '#send-connections-link'],
            'course_director': ['#planner-link']
        };

        Object.entries(elementsToHide).forEach(([key, selectors]) => {
            if (role === key) {
                selectors.forEach(selector => {
                    const element = this.shadowRoot.querySelector(selector);
                    if (element) element.style.display = 'none';
                });
            }
        });
    }

    static get observedAttributes() {
        return ["isopen"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "isopen"){
            if (newValue == "true"){
                this.shadowRoot.getElementById("sidebar").style.width = "200px";

                this.shadowRoot.getElementById("sidebar-content").style.display = "block";
            }
            else if (newValue == "false"){
                this.shadowRoot.getElementById("sidebar").style.width = "0";

                this.shadowRoot.getElementById("sidebar-content").style.display = "none";
            }
        }
    }


}



//handle nav stuff
function closeNav() {
    sidebar = document.querySelector("sidenav-component");
    sidebar.setAttribute("isopen", "false")
    document.getElementById("main").style.marginLeft= "0";
}

//handle nav stuff
function openNav() {
    const sidebar = document.querySelector("sidenav-component");
    sidebar.setAttribute("isopen", "true");

    document.getElementById("main").style.marginLeft= "200px";
}

// open and close navigation bar
function toggleNav() {
    if (navOpen) {
        closeNav();
        navOpen = false;
    } else {
        openNav();
        navOpen = true;
    }
    
}


document.addEventListener('DOMContentLoaded', () => {
    toggleNav();
})

customElements.define("sidenav-component", Sidenav);

