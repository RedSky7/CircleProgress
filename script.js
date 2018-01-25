// CONSTANTS

// Main canvas for colorful circle progresses
const canvas = document.getElementById("canvas");
// Background canvas for circle progresses backgrounds
const background = document.getElementById("background-canvas");

const addButton = document.getElementById("addButton");

const context = canvas.getContext("2d");
const backgroundContext = background.getContext("2d");

// Colors red, yellow, green, blue, violet
const colors = [ "#ff5050", "#ff9933",  "#33cc33", "#0099ff", "#9966ff"];


// GLOBAL VARIABLES

let CIRCLE_WIDTH = 75;
let BUTTON_WIDTH = 40;
let DIFF = 105;

let active = -1;
let everything;
let j = 0;


// CLASSES

class Container {
    constructor() {
        this.circles = [];
    }

    // Add a circle progress to array
    add(progress) {
        this.circles.push(progress);
    }

    // Draw circle progress for each circle
    draw() {
        context.translate(-512, -512);
        context.clearRect(0, 0, 1024, 1024);
        context.translate(512, 512);

        for(let i = this.circles.length - 1; i >= 0; i--) {
            this.circles[i].draw(i, 470 - ((this.circles.length - 1 - i) * (400 / this.circles.length)));
        }
    }

    // Draw background parts of the circle progress for each circle
    drawBackgrounds() {

        backgroundContext.translate(-512, -512);
        backgroundContext.clearRect(0, 0, 1024, 1024);
        backgroundContext.translate(512, 512);

        for(let i = this.circles.length - 1; i >= 0; i--) {
            this.circles[i].drawBackground(i, 470 - ((this.circles.length - 1 - i) * (400 / this.circles.length)));
        }
    }

    drawLegend() {
        let table = document.getElementById("legendTable");
        // Remove all of the table rows
        while(table.hasChildNodes()) {
            table.removeChild(table.firstChild);
        }

        // For each circle progress add a table row with data
        for(let i = this.circles.length - 1; i >= 0; i--) {
            let row = table.insertRow(-1);

            row.innerHTML = "<tr>" +
                                "<th>$" + this.circles[i].price + "</th>" +
                                "<td style='background-color:" + colors[i % colors.length] +"; width:10px; height:5px;'></td>" +
                                "<td>" +this.circles[i].title + "</td>" +
                            "</tr>";
        }
    }
}

class CircleProgress {
    constructor(radius, title, min, max, step) {
        this.radius = radius;

        this.min = min;
        this.max = max;
        this.step = step;

        this.progress = 0;

        this.title = title;

        this.price = min;
    }

    // Get the range of the circle progress
    getRange() {
        return Math.abs(this.min - this.max);
    }

    // Draws a circle progress to canvas
    draw(position, newRad) {
        // Dinamically set the current radius to a new calculated radius
        this.radius = newRad;

        // Draw filled circle progress bar
        context.beginPath();
        context.globalAlpha=0.8;
        context.lineWidth = CIRCLE_WIDTH;
        context.strokeStyle = colors[position % colors.length];
        context.arc(0, 0, this.radius, 0, this.progress * 0.01 * 1.9 * Math.PI);
        context.stroke();


        // Draw circle progress button
        context.beginPath();
        context.lineWidth = 5;
        context.globalAlpha=1;
        context.fillStyle = "#EEEEEE";
        context.strokeStyle = "#BBBBBB";

        // Get the point where we will draw our button based on the progress (little cosmetical correction)
        let point = getPoint(0, 0, this.radius, this.progress * 0.01 * 1.9 * Math.PI);

        context.arc(point[0], point[1], BUTTON_WIDTH, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
    }

    // Draws background circle parts but only when a new circle progress is added
    drawBackground(position, newRad) {
        // Dinamically set the current radius to a new calculated radius
        this.radius = newRad;

        backgroundContext.lineWidth = CIRCLE_WIDTH;
        backgroundContext.strokeStyle = "#CCCCCC";

        // Split the circle progress to equal parts with the step incrementation
        let len = 1.9 * Math.PI / (this.getRange() / this.step);

        for(let i = 0; i - (0.3 * len) < 1.9 * Math.PI;  ) {
            backgroundContext.beginPath();
            backgroundContext.strokeStyle = "#CCCCCC";

            // Draw an arc with some extra white space which is 0.02 or 2%.
            backgroundContext.arc(0, 0, this.radius, Math.max(0, i - len + 0.02), Math.min( 1.9 * Math.PI, i));
            i += len;

            backgroundContext.stroke();
        }
    }


}

function getPoint(c1, c2, radius, angle) {
    return [c1 + Math.cos(angle) * radius, c2 + Math.sin(angle) * radius];
}


// INIT

function init() {
    // Rotate both canvases to align the start of the circle with PI/2
    context.translate(512, 512);
    context.rotate(-90 * Math.PI / 180);

    backgroundContext.translate(512, 512);
    backgroundContext.rotate(-90 * Math.PI / 180);
};


// MAIN EXAMPLE

function main() {
    everything = new Container();

    // Fill with some example circle progress bars
    everything.add(new CircleProgress(100 + (j++ * 90), "Health care",  0, 100, 1));
    everything.add(new CircleProgress(100 + (j++ * 90), "Entertainment",  0, 100, 1));
    everything.add(new CircleProgress(100 + (j++ * 90),  "Insurance",  0, 100, 1));

    // Draw backgrounds for each circle
    everything.drawBackgrounds();
    everything.draw();
    everything.drawLegend();
}


// MAIN PROGRAM CALL

init();
main();


// *********************
// USER INPUT
// *********************


// ADDING A NEW CIRCLE_PROGRESS

addButton.addEventListener("click", function(event) {

    let title = document.getElementById("newTitle").value;
    let step = document.getElementById("newStep").value;
    let minimum = document.getElementById("newMinimum").value;
    let maximum = document.getElementById("newMaximum").value;

    let errorCount = 0;
    let errors = document.getElementById("errors");
    while(errors.hasChildNodes()) {
        errors.removeChild(errors.firstChild);
    }
    if(!(parseInt(minimum) < parseInt(maximum))) {
        let error = document.createElement("span");
        error.innerHTML = "<span class='button button3'>" + "ERROR: Maximum cannot be equal, or greater than minimum." + "</span>";
        errors.appendChild(error);
        errorCount += 1;
    }
    if(!(Math.abs(parseInt(minimum) - parseInt(maximum)) > parseInt(step))) {
        let error = document.createElement("span");
        error.innerHTML = "<span class='button button3'>" + "ERROR: Step must be a number." + "</span>";
        errors.appendChild(error);
        errorCount += 1;
    }

    if(errorCount > 0)
        return;

    everything.add(new CircleProgress(100 + (j++ * 90),  title, minimum, maximum, step));

    let circlesCount = everything.circles.length;

    if(circlesCount > 4 && circlesCount < 12) {
        CIRCLE_WIDTH = 75 - (circlesCount - 4) * 10;
        DIFF = 105 - (circlesCount - 4) * 20;
        BUTTON_WIDTH = 40 - (circlesCount - 4) * 5;
    }

    everything.drawBackgrounds();
    everything.draw();
    everything.drawLegend();
});


// HANDLE MOVEMENT OF THE CIRCLE PROGRESS

function handleMovement(x, y) {
    // Calculate angles of current touch position relative to the circle center
    let angle1 = Math.atan2(0, -everything.circles[active].radius);
    let angle2 = Math.atan2(x, y);

    // Calculate the procentage of the circle
    let procent = ((angle1 - angle2) / (1.9 * Math.PI));

    // Calculate the new value based on the minimum, maximum and our current touch position
    let newValue = Math.round(procent * (Math.abs(everything.circles[active].min - everything.circles[active].max)) + parseInt(everything.circles[active].min));

    let diff = Math.abs(newValue - everything.circles[active].min);
    let halfStep = everything.circles[active].step / 2;

    // If our touch is closer to the previous value then go back
    if(diff % everything.circles[active].step < halfStep) {
        // New progress is the closest legal progress lower than the current touch based on step
        let newProgress = (newValue - (diff % everything.circles[active].step) - everything.circles[active].min) / everything.circles[active].getRange() * 100;
        if(newProgress > 100)
            return;
        everything.circles[active].progress = newProgress;
        // New price is the closest legal price value
        everything.circles[active].price = newValue - (diff % everything.circles[active].step);
        everything.draw();
        everything.drawLegend();
    }
    else {
        // New progress is the closest legal progress higher or equal to the current touch based on step
        let newProgress = (newValue + (everything.circles[active].step - (diff % everything.circles[active].step)) - everything.circles[active].min) / everything.circles[active].getRange() * 100;
        if(newProgress > 100)
            return;
        everything.circles[active].progress = newProgress;
        // New price is the closest legal price value
        everything.circles[active].price = newValue + (everything.circles[active].step - (diff % everything.circles[active].step));
        everything.draw();
        everything.drawLegend();
    }
}


// HANDLE MOUSE_DOWN || TOUCH_START

canvas.addEventListener("mousedown", startTouch);
canvas.addEventListener("touchstart", startTouch);

function startTouch(event) {

    var rect = canvas.getBoundingClientRect();

    // Get x and y coordinates of touch relative to the center of the circle
    // x = 0; y = 0 is the center of the circle
    let x = event.clientX - rect.left - (rect.width / 2);
    let y = event.clientY - rect.top - (rect.height / 2);

    let diff2 = 1024 / (rect.width - 10);

    for(let i = 0; i < everything.circles.length; i++) {
        // Get the radius of the most outer part of the circle
        let radius1 = Math.pow(everything.circles[i].radius - CIRCLE_WIDTH / 2, 2);

        // Get the radius of the most inner part of the circle
        let radius2 = Math.pow(everything.circles[i].radius + CIRCLE_WIDTH / 2, 2);
        let distance = Math.pow(x * diff2, 2) + Math.pow(y * diff2, 2);

        // If current touch distance is between the two
        if(distance > radius1 && distance < radius2)
        {
            // Set that the current circle is now active
            active = i;
            handleMovement(x, y);
        }
    }

}


// HANDLE MOUSE_MOVE || TOUCH_MOVE

canvas.addEventListener("mousemove", moveTouch);
canvas.addEventListener("touchmove", moveTouch);

function moveTouch(event) {
    // If none of the circles is active then end
    if(active == -1)
        return;

    // Prevent default scroll action
    event.preventDefault();
    //event.defaultPrevented;

    var rect = canvas.getBoundingClientRect();

    // Get x and y coordinates of touch relative to the center of the circle
    // x = 0; y = 0 is the center of the circle
    let x = 0;
    let y = 0;

    if(event.type == "mousemove") {
        x = event.clientX - rect.left - (rect.width / 2);
        y = event.clientY - rect.top - (rect.height / 2);
    }
    else {
        x = parseInt(event.changedTouches[0].clientX) - rect.left - (rect.width / 2);
        y = parseInt(event.changedTouches[0].clientY) - rect.top - (rect.height / 2);
    }

    handleMovement(x, y);
}


// HANDLE TOUCH_END || MOUSE_UP

canvas.addEventListener("mouseup", endTouch);
canvas.addEventListener("touchend", endTouch);

function endTouch(event) {
    // Set active circle to none
    active = -1;
}
