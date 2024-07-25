const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchTasksFromDatabase() {
    let response = await fetch(BASE_URL + "tasks.json");
    let responseAsJson = await response.json();
    console.log(responseAsJson);
}

function getNumberOfToDos(responseAsJson) {
    
    
    /*
    task.id = taskId;
    console.log(responseAsJson.taskId.position);

    for (let i = 0; i < responseAsJson.length; i++) {
        const element = array[i];
        
    }
    */
}

function getNumberOfDone(responseAsJson) {

}

function getNumberOfUrgent(responseAsJson) {

}

function getDateOfUpcomingDeadline(responseAsJson) {

}

function getNumberOfTasksInBoard(responseAsJson) {

}

function getNumberOfTasksInProgress(responseAsJson) {

}

function getNumberOfAwaitingFeedback(responseAsJson) {

}