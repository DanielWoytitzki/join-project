const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

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





// AUSSTEHEND
/**
 * This function gets the date of the upcoming deadline
 * @param {object} tasks -  All tasks within the database
 * @returns 
 */
function getDateOfUpcomingDeadline(tasks) {
    let tasksArray = Object.values(tasks);
    return tasksArray.filter(task => task.priority === 'Urgent').length;
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

        
        let numberOfTasksInBoard = getNumberOfTasksInBoard(tasks);
        document.getElementById('tasksInBoard').innerHTML = numberOfTasksInBoard;
        
        let numberOfTasksInProgress = getNumberOfTasksInProgress(tasks);
        document.getElementById('tasksInProgress').innerHTML = numberOfTasksInProgress;
        
        let numberOfTasksAwaitingFeedback = getNumberOfTasksAwaitingFeedback(tasks);
        document.getElementById('tasksAwaitingFeedback').innerHTML = numberOfTasksAwaitingFeedback;

        console.log(numberOfTasksToDo, numberOfTasksDone, numberOfUrgentTasks, dateOfUpcomingDeadline, numberOfTasksInBoard, numberOfTasksInProgress, numberOfTasksAwaitingFeedback);
    }
}