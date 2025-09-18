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

    const checkboxText = document.createElement("text");
    checkboxText.textContent = `Due: ${date || "No date set"}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    /*append children to its parents*/
    checkboxDetails.append(checkboxText, checkbox);
    individualTask.append(taskText, checkboxDetails);
    taskWrapper.appendChild(individualTask);
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

        if (teammateName && task) {
            addTask(teammateName, task, date);
        } else {
            alert("Please select a teammate and enter a task to continue");
        }
        
    });
});