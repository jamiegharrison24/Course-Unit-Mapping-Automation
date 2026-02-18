export default style = `
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
        transition: background-color 0.3s;
    }

    .sidebar.dark-mode {
        background-color: #333; /* Dark Mode Background for Sidebar */
    }

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
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 15px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: rgb(80, 80, 80);
        font-size: 20px;
        transition: background-color 0.3s, color 0.3s;
        text-decoration: none;
    }

    .sidebar-link.dark-mode {
        color: #e0e0e0; /* Light text color for dark mode */
    }

    .sidebar-link:hover {
        background-color: #e0e0e0;
        color: rgb(50, 50, 50);
    }

    .sidebar-link.dark-mode:hover {
        background-color: rgba(255, 255, 255, 0.1); /* Lighten hover effect in dark mode */
        color: #ffffff; /* Ensure hover text is visible */
    }

    .sidebar-img {
        height: 30px;
        margin-right: 10px;
        display: inline-block;
        vertical-align: middle;
        transition: filter 0.3s;
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

    nav button.sidebar-button {
        width: 100%;
        margin-top: 10px;
        margin-bottom: 5px;
        margin-left: 5px;
    }

    nav button.sidebar-button:hover {
        background-color: #3b90d5;
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
        font-size: 20px;
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

    /* Dark Mode for Buttons */
    .sidebar-button.dark-mode {
        background-color: #444;
        color: white;
    }

    .sidebar-button.dark-mode:hover {
        background-color: #3b90d5;
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