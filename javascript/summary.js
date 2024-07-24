const BASE_URL = "https://join-7b4c8-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchData() {
    let response = await fetch(BASE_URL + "tasks.json");
    let responseAsJson = await response.json();
    console.log(responseAsJson);
}