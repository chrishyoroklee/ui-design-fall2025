/* Create new task */
function addTask(teammateName, task, date){
    mainContent = document.getElementById("main-content");

    //Remove the placeholder if it exists
    placeholder = document.getElementById("task-placeholder");
    if (placeholder){
        placeholder.remove();
    }

    //See if teammate section already exists
    let teammateSection = document.querySelector(`[teammate="${teammateName}"]`);

    if (!teammateSection) {
        teammateSection = document.createElement("div");
        teammateSection.className = "content";
        teammateSection.setAttribute("teammate", teammateName);

        const newH2 = document.createElement("h2");
        newH2.textContent = teammateName;

        const taskWrapper = document.createElement("div");
        taskWrapper.className = "task-wrapper";

        teammateSection.append(newH2, taskWrapper);
        mainContent.appendChild(teammateSection);
    }

    const taskWrapper = teammateSection.querySelector(".task-wrapper");
    const individualTask = document.createElement("div");
    individualTask.className = "tasks";

    const taskText = document.createElement("text");
    taskText.textContent = task;

    const checkboxDetails = document.createElement("div");
    checkboxDetails.className = "checkbox-details";

    const checkboxText = document.createElement("span");
    checkboxText.textContent = `Due: ${date || "No date set"}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    /*append children to its parents*/
    checkboxDetails.append(checkboxText, checkbox);
    individualTask.append(taskText, checkboxDetails);
    taskWrapper.appendChild(individualTask);
}
//2012-05-24 2025-09-18
function compareDate(date, currDate){
    if (!date) {
        return false;
    }

    const inputDate = Number(date.slice(8,10));
    const inputMonth = Number(date.slice(5,7));
    const inputYear = Number(date.slice(0, 4));

    const todaysDate = currDate.getDate();
    const todaysMonth = currDate.getMonth()+1;
    const todaysYear = currDate.getFullYear();

    if (inputMonth < 1 || inputMonth > 12 || inputDate < 1 || inputDate > 31) {
        return false;
    }

    if (inputYear > todaysYear) {
        return true;
    } 
    else if (inputYear < todaysYear) {
        return false;
    } 
    //same year cases
    else {
        if (inputMonth > todaysMonth) {
            return true;
        } else if (inputMonth < todaysMonth) {
            return false;
        } 
        //same year, same month
        else {
            return inputDate >= todaysDate;
        }  

    }
}

//Add back the placeholder if all tasks are cleared
function showPlaceholder(){
    const mainElement = document.getElementById("main-content");
    if (mainElement.children.length == 0) {
        const placeholder = document.createElement('div');
        placeholder.id = "task-placeholder";
        placeholder.textContent = "No tasks right now. Please add a teammate and assign a task";
        mainElement.appendChild(placeholder);
    }
}

document.addEventListener("DOMContentLoaded", function(){
    const assignButton = document.getElementById("assign-button");
    const selectElement = document.getElementById("selectId");
    const taskInput = document.getElementById("input-task");
    const dateInput = document.getElementById("input-date");

    assignButton.addEventListener("click", function() {
        const teammateName = selectElement.value;
        const task = taskInput.value;
        const date = dateInput.value;

        /*make sure input date is after today's date*/
        const currDate = new Date();
        const checkDate = compareDate(date, currDate);
        console.log(checkDate);
        // make sure teammateName, task, date is chosen
        if (teammateName && task && date && checkDate) {
            addTask(teammateName, task, date);
            // Clear inputs after successful addition
            taskInput.value = '';
            dateInput.value = '';
            selectElement.selectedIndex = 0; 
        } else {
            alert("Please select a teammate, enter a task, and enter a correct date to continue");
        }
        
    });
});