// Timer Variables
let timer;
let seconds = 0;
let timeLimitSeconds = 0; // To store the user-defined time limit

// Start the Timer
function startTimer() {
    stopTimer(); // Ensure no duplicate timers
    const timeLimitInput = document.getElementById("time-limit").value;

    // Convert selected minutes to seconds
    timeLimitSeconds = parseInt(timeLimitInput, 10) * 60;

    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer-container").textContent = formatTime(seconds);

        // Check if time limit is reached
        if (timeLimitSeconds > 0 && seconds >= timeLimitSeconds) {
            triggerTimeLimitAlert();
            stopTimer(); // Stop the timer once the limit is reached
        }
    }, 1000);
}

// Stop the Timer
function stopTimer() {
    clearInterval(timer); // Stop the interval
}

// Reset the Timer
function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById("timer-container").textContent = "00:00"; // Reset display
    document.getElementById("alert-message").style.display = "none"; // Hide alert
}

// Format Time to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Trigger Time Limit Alert
function triggerTimeLimitAlert() {
    const alertMessage = document.getElementById("alert-message");
    alertMessage.style.display = "block"; // Show the alert
    alertMessage.textContent = "Time's Up!"; // Customize the alert text
}


// Format Time to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Trigger Time Limit Alert
function triggerTimeLimitAlert() {
    const alertMessage = document.getElementById("alert-message");
    alertMessage.style.display = "block"; // Show the alert
    alertMessage.textContent = "Time's Up!"; // Customize the alert text

    // Optional: Add a flashing effect or sound
    alertMessage.classList.add("flash");

    // Optional: Play a sound when the alert triggers
    const alertSound = new Audio('alert.mp3'); // Add a sound file in the same directory
    alertSound.play();
}

// Optional: Flashing Animation for Alert
setInterval(() => {
    const alertMessage = document.getElementById("alert-message");
    if (alertMessage.style.display === "block") {
        alertMessage.style.opacity = alertMessage.style.opacity === "1" ? "0.5" : "1";
    }
}, 500);



// PDF.js Setup
let pdfDoc = null;
let currentPage = 1;
const canvas = document.getElementById("pdf-canvas");
const ctx = canvas.getContext("2d");

document.getElementById("file-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
            pdfDoc = pdf;
            currentPage = 1;
            renderPage(currentPage);
        });
    };
    reader.readAsArrayBuffer(file);
});

function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };
        page.render(renderContext);
    });
}

function prevPage() {
    if (currentPage <= 1) {
        alert("You're already on the first page!");
        return;
    }
    currentPage--;
    renderPage(currentPage);
}

function nextPage() {
    if (currentPage >= pdfDoc.numPages) {
        alert("You're already on the last page!");
        return;
    }
    currentPage++;
    renderPage(currentPage);
}

function loadPrebuiltPDF() {
    const selectedPDF = document.getElementById("prebuilt-pdfs").value;

    if (!selectedPDF) {
        alert("Please select a valid pre-built PDF.");
        return;
    }

    const pdfURL = selectedPDF; // Path from dropdown option

    // Load the PDF
    pdfjsLib.getDocument(pdfURL).promise.then((pdf) => {
        pdfDoc = pdf;
        currentPage = 1;
        renderPage(currentPage);
    }).catch((error) => {
        console.error("Error loading the selected PDF:", error);
        alert("Failed to load the selected PDF.");
    });
}

