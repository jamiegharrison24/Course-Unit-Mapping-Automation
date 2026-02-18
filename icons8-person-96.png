const header = document.createElement("template");

style = 
    `/* Light Mode (default) */

    /* header {
        background-color: #4da5f5;
        color: white;
        padding: 15px 30px;
        display: flex;
        flex-direction: column;
        width: 100px;
        height: 100%;
        position: absolute;
    }
    

    /* Dark Mode */
    header.dark-mode {
        background-color: #1f1f1f; /* Dark mode background */
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.5); /* Softer shadow for dark mode */
    }

    header.dark-mode h1 {
        color: #ffffff; /* White text for dark mode */
    }

    .burger-bar-icon.dark-mode {
        filter: invert(1); /* Invert the burger icon color for dark mode */
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        gap: 20px; 
    }
    
    .burger-bar-icon {
        width: 40px;
        height: 40px;
    }

    button{
        background-color: transparent;
        color: white;
        border: none;
        padding: 10px 10px;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover{
        background-color: #3b90d5;
    }
    
    .user-info {
        margin-left: auto; 
        text-align: right;
    }
    
    .profile-container {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }
    
    .profile-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .profile-details {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .profile-item {
        display: flex;
        align-items: center;
    }
    
    .profile-item label {
        font-weight: bold;
        margin-right: 10px;
    }
    
    .profile-item input {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px;
        font-size: 14px;
        width: 100%;
        max-width: 300px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    header {
        height: 75px;
        display: flex;
        flex-direction: row;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: rgb(104, 196, 244);
        z-index: 200;
        padding-left: 15px;
        align-items: center;
        box-shadow: 0px 5px 5px lightgray;
        transition: background-color 0.3s, color 0.3s;
    }

    button.app-name{
        color: white;
        background: transparent;
    }

    a {
        text-decoration: none;
        color: white;
    }
    
`


header.innerHTML = ` 
    <header>
    <style>${style}</style>
    <button onclick="toggleNav()" class="openbtn">
        <img src="images/1200px-Hamburger_icon.svg.webp" class="burger-bar-icon">
    </button>
    
    <a class="appname" href="/">
        <h1>CUMA</h1>
    </a>
            <!--Temporary info, please fix if required-->
    
    <div class="user-info"></div>
    
    </header>
`

class Header extends HTMLElement {
    constructor(){
        super();
        const shadow = this.attachShadow({mode: "open"});
        shadow.append(header.content.cloneNode(true));
    }



}

customElements.define("header-component", Header);