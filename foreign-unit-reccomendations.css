const form = document.getElementById('scan-url-form');

const scanButton = document.getElementById('scan-url-button');

    const waitingScreen = `
            <div class="waiting-screen" id="waiting-screen">
            <div class="spinner" id="spinner"></div>
            <p id="waiting-screen-text">Loading, please wait...</p>
            <button disabled id="waiting-screen-done-button" onclick="closeWaitingScreen()">Done</button>
            </div>
    `

// Add event listener to the button
scanButton.addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the value of the URL input
    const urlInput = document.getElementById('url').value;
    

    const mainPage = document.getElementById("main");
    mainPage.innerHTML += waitingScreen

    // Check if the input is not empty
    if (urlInput.trim() !== "") {

        // insert waiting screen


        // call web scraper
        Backend.Misc.scrapeDomestic(urlInput)
    } else {
        alert("Input is empty.")
    }


    


})

function closeWaitingScreen() {
    // const screen = document.getElementById("waiting-screen")
    // screen.remove()

    window.location.reload()
}