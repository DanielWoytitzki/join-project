/*
const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";
*/


init();


/**
 * This function checks if an user or guest is logged in
 */
function checkIfUserOrGuest() {
    let userDetailsString = sessionStorage.getItem("userDetails");
    let userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

    let greetingText = checkLocalTime();

    if (userDetails && userDetails.status === "logged in") {
        let userDetailsName = userDetails.name;
        console.log(userDetailsName);
        
        document.getElementById("greeting").innerHTML = generateGreetingForUser(greetingText, userDetailsName);
    } else {
        document.getElementById("greeting").innerHTML = generateGreetingForGuest(greetingText);
    }
}


/**
 * This function generates the greeting for an user
 * @param {string} greetingText - Greeting text depending on the local time
 * @param {string} userDetailsName - Name of the user who is logged in
 * @returns HTML Code
 */
function generateGreetingForUser(greetingText, userDetailsName) {
    return `
        <h2>${greetingText},</h2>
        <span>${userDetailsName}</span>
    `;
}


/**
 * This function generates the greeting for a guest
 * @param {string} greetingText - Greeting text depending on the local time
 * @returns HTML Code
 */
function generateGreetingForGuest(greetingText) {
    return `
        <h2>${greetingText}</h2>
    `;
}


/**
 * This function checks the current local time
 */
function checkLocalTime() {
    var localDate = new Date();
    var currentLocalTime = localDate.getHours();
    return generateGreetingText(currentLocalTime);
}


/**
 * This function generates the greeting depending on the current local time
 * @param {number} currentLocalTime 
 */
function generateGreetingText(currentLocalTime) {
    let greetingText = '';

    if (currentLocalTime >= 5 && currentLocalTime < 12) {
        greetingText = 'Good morning';
    } else if (currentLocalTime >= 12 && currentLocalTime < 18) {
        greetingText = 'Good afternoon';
    } else {
        greetingText = 'Good evening';
    }

    return greetingText;
}


/**
 * This function fetches the tasks from the database
 * @returns An object, empty or filled with all tasks
 */
async function fetchTasksFromDatabase() {
    try {
        let response = await fetch(BASE_URL + "tasks.json");
        let tasks = await response.json();
        return tasks ? tasks : {};
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}


/**
 * This function gets the number of tasks "To-do"
 * @param {object} tasks -  All tasks within the database
 * @returns The length of the filtered tasksArray (Filter: position = ToDo) 
 */
function getNumberOfTasksToDo(tasks) {
    let tasksArray = Object.values(tasks);
    return tasksArray.filter(task => task.position === 'ToDo').length;
}


/**
 * This function gets the number of tasks "Done"
 * @param {object} tasks -  All tasks within the database
 * @returns The length of the filtered tasksArray (Filter: position = Done) 
 */
function getNumberOfTasksDone(tasks) {
    let tasksArray = Object.values(tasks);
    return tasksArray.filter(task => task.position === 'Done').length;
}


/**
 * This function gets the number of "Urgent" tasks
 * @param {object} tasks -  All tasks within the database
 * @returns The length of the filtered tasksArray (Filter: priority = Urgent) 
 */
function getNumberOfUrgentTasks(tasks) {
    let tasksArray = Object.values(tasks);
    return tasksArray.filter(task => task.priority === 'Urgent').length;
}


/**
 * This function gets the date of the upcoming deadline
 * @param {object} tasks - All tasks within the database 
 * @returns The date of the upcoming deadline (e. g. "Month Day, Year")
 */
function getDateOfUpcomingDeadline(tasks) {
    let tasksArray = Object.values(tasks);
    let datesOfTasksArray = [];

    for (let i = 0; i < tasksArray.length; i++) {
        var datesOfTasks = new Date(tasksArray[i].dueDate);
        datesOfTasksArray.push(datesOfTasks);
    }

    let sortedDatesOfTasksArray = datesOfTasksArray.sort((a, b) => a - b);

    var upcomingDate = sortedDatesOfTasksArray[0];

    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return upcomingDate.toLocaleDateString('en-US', options);
}


/**
 * This function gets the number of "tasks in board"
 * @param {object} tasks -  All tasks within the database
 * @returns The length of the tasksArray 
 */
function getNumberOfTasksInBoard(tasks) {
    let tasksArray = Object.values(tasks);
    return tasksArray.length;
}


/**
 * This function gets the number of "tasks in progress"
 * @param {object} tasks -  All tasks within the database
 * @returns The length of the filtered tasksArray (Filter: position = InProgress) 
 */
function getNumberOfTasksInProgress(tasks) {
    let tasksArray = Object.values(tasks);
    return tasksArray.filter(task => task.position === 'InProgress').length;
}


/**
 * This function gets the number of "awaiting feedback" tasks
 * @param {object} tasks -  All tasks within the database
 * @returns The length of the filtered tasksArray (Filter: position = AwaitFeedback) 
 */
function getNumberOfTasksAwaitingFeedback(tasks) {
    let tasksArray = Object.values(tasks);
    return tasksArray.filter(task => task.position === 'AwaitFeedback').length;
}


/**
 * This function initials the numbers
 */
async function init() {
    let tasks = await fetchTasksFromDatabase();
    if (tasks) {
        let numberOfTasksToDo = getNumberOfTasksToDo(tasks);
        document.getElementById('tasksToDo').innerHTML = numberOfTasksToDo;

        let numberOfTasksDone = getNumberOfTasksDone(tasks);
        document.getElementById('tasksDone').innerHTML = numberOfTasksDone;

        let numberOfUrgentTasks = getNumberOfUrgentTasks(tasks);
        document.getElementById('tasksUrgent').innerHTML = numberOfUrgentTasks;

        let dateOfUpcomingDeadline = getDateOfUpcomingDeadline(tasks);
        document.getElementById('upcomingDeadline').innerHTML = dateOfUpcomingDeadline;

        let numberOfTasksInBoard = getNumberOfTasksInBoard(tasks);
        document.getElementById('tasksInBoard').innerHTML = numberOfTasksInBoard;

        let numberOfTasksInProgress = getNumberOfTasksInProgress(tasks);
        document.getElementById('tasksInProgress').innerHTML = numberOfTasksInProgress;

        let numberOfTasksAwaitingFeedback = getNumberOfTasksAwaitingFeedback(tasks);
        document.getElementById('tasksAwaitingFeedback').innerHTML = numberOfTasksAwaitingFeedback;

        console.log(numberOfTasksToDo, numberOfTasksDone, numberOfUrgentTasks, dateOfUpcomingDeadline, numberOfTasksInBoard, numberOfTasksInProgress, numberOfTasksAwaitingFeedback);
    }
    checkIfUserOrGuest();
}


/**
 * This function forwards one to the board page
 */
function forwardToBoard() {
    window.location.href = 'board.html';
}