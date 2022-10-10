let tasks = [];
let changeTime = null; //This value is set here to prevent an infinite loop when checking a date function
dateBox.min = new Date().toLocaleDateString('en-CA');

function loadFromStorage() {
    const currentList = localStorage.getItem("tasks");
    if (currentList) {
        tasks = JSON.parse(currentList);
    }
    displayTasksList();
}

function displayTasksList() {
    const taskDiv = document.getElementById("taskDiv");
    let html = "";

    for (let i = tasks.length - 1; i >= 0; i--) {
        html += `
        <div id="boxDiv">
            <div id="taskDisplay${[i]}" style="background-image: url(./assets/image/Nots-image.png); background-size: 180px; height: 180px; padding-top: 40px;">
                <div><button onclick="deleteTask(this)" id="${i}" class="btn-close"></button></div>
                <div id="description">${tasks[i].description}</div>
                <div id="date">${tasks[i].date.substring(8, 10)}/${tasks[i].date.substring(5, 7)}/${tasks[i].date.substring(0, 4)}</div>
                <div id="time">${tasks[i].time}</div>
            </div>
        </div>`;
    }

    taskDiv.innerHTML = html;
}

function deleteTask(task) {
    const index = task.id;
    if (index > -1) {
        tasks.splice(index, 1);
    }
    const saveTasksList = JSON.stringify(tasks);
    localStorage.setItem("tasks", saveTasksList);

    displayTasksList();
    return tasks;
}

function getDateValueFromClient() {
    const dateBox = document.getElementById("dateBox");
    const dateValueFromClient = dateBox.value;
    const currentDate = new Date().toLocaleDateString('en-CA');

    if (dateValueFromClient === currentDate) {
        if (changeTime === true) { // If this hour has passed = true
            errorMessage();
        }
        return true;
    }
    else {
        errorDiv.innerHTML = null;
        return false;
    }
}

function getTimeValueFromClient() {
    const timeBox = document.getElementById("timeBox");
    const timeValueFromClient = timeBox.value;
    const currentTime = new Date().toLocaleTimeString('he-IL').substr(0, 5);

    if (timeValueFromClient < currentTime) {
        const currentDate = getDateValueFromClient();
        if (currentDate === true) {
            errorMessage();
        }
        changeTime = true; // changeTime is today = true
        return true;
    }
    else {
        changeTime = false;
        errorDiv.innerHTML = null;
        return false;
    }
}

function addTask() {
    event.preventDefault();

    const descriptionTextBox = document.getElementById("descriptionTextBox");
    const dateBox = document.getElementById("dateBox");
    const timeBox = document.getElementById("timeBox");

    const task = {
        description: descriptionTextBox.value,
        date: dateBox.value,
        time: timeBox.value
    };

    let currentDate = getDateValueFromClient(); // if current day is today = true
    let currentTime = getTimeValueFromClient(); // If this hour has passed = true

    if (currentDate === false || currentTime === false) {
        tasks.push(task);
        const saveTasksList = JSON.stringify(tasks);
        localStorage.setItem("tasks", saveTasksList);

        descriptionTextBox.value = null;
        dateBox.value = null;
        timeBox.value = null;
        changeTime = null;

        displayTasksList();
    }
    else {
        errorMessage();
    }
}

function errorMessage() {
    const errorDiv = document.getElementById("errorDiv");
    errorDiv.innerHTML = "* This time has already happened.";
}

function clearFrom() {
    errorDiv.innerHTML = null;
}

loadFromStorage();