count = 1;
// ===== LOCAL STORAGE FUNCTIONS =====
function saveToLocalStorage() {
    try {
        const teammates = [];
        const tasks = [];
        
        // Get teammates from select dropdown
        const selectOptions = document.getElementById("selectId");
        const options = selectOptions.querySelectorAll('option');
        options.forEach(option => {
            if (option.value && option.value !== "") {
                teammates.push(option.value);
            }
        });
        
        // Get tasks from DOM
        const mainContent = document.getElementById("main-content");
        const teammateContents = mainContent.querySelectorAll('.content[teammate]');
        
        teammateContents.forEach(content => {
            const teammateName = content.getAttribute('teammate');
            const taskDivs = content.querySelectorAll('.tasks');
            
            taskDivs.forEach(taskDiv => {
                const taskSpan = taskDiv.querySelector('span');
                const checkbox = taskDiv.querySelector('input[type="checkbox"]');
                
                // Check if elements exist before accessing them
                if (taskSpan && checkbox) {
                    const taskText = taskSpan.textContent;
                    const dueDate = taskDiv.getAttribute('task-date');
                    
                    tasks.push({
                        text: taskText,
                        assignedTo: teammateName,
                        dueDate: dueDate,
                        completed: checkbox.checked
                    });
                }
            });
        });
        
        // Save to localStorage
        localStorage.setItem("teammates", JSON.stringify(teammates));
        localStorage.setItem("tasks", JSON.stringify(tasks));
        console.log("Saved to localStorage:", { teammates, tasks });
        
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

function loadFromLocalStorage() {
    const savedTeammates = localStorage.getItem("teammates");
    const savedTasks = localStorage.getItem("tasks");
    
    if (!savedTeammates && !savedTasks) {
        showPlaceholder();
        return;
    }
    
    const teammates = savedTeammates ? JSON.parse(savedTeammates) : [];
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    // Clear current state
    const mainContent = document.getElementById("main-content");
    const selectOptions = document.getElementById("selectId");
    mainContent.innerHTML = "";
    selectOptions.innerHTML = '<option value="" id="assign-option" selected>Assign to</option>';
    
    // Add teammates to select dropdown
    teammates.forEach(teammate => {
        const option = document.createElement("option");
        option.value = teammate;
        option.textContent = teammate;
        option.id = `option${count}`;
        count++;
        selectOptions.appendChild(option);
    });
    
    // Disable placeholder if teammates exist
    if (teammates.length > 0) {
        const assignOption = document.getElementById("assign-option");
        if (assignOption) {
            assignOption.disabled = true;
        }
    }
    
    // Sort teammates in dropdown
    if (teammates.length > 0) {
        sortSelect(selectOptions);
    }
    
    // Group tasks by teammate and recreate them
    const tasksByTeammate = {};
    tasks.forEach(task => {
        if (!tasksByTeammate[task.assignedTo]) {
            tasksByTeammate[task.assignedTo] = [];
        }
        tasksByTeammate[task.assignedTo].push(task);
    });
    
    // Recreate teammate sections and tasks
    Object.keys(tasksByTeammate).forEach(teammate => {
        tasksByTeammate[teammate].forEach(task => {
            recreateTask(teammate, task.text, task.dueDate, task.completed);
        });
    });
    
    // Show placeholder if no data
    if (teammates.length === 0 && tasks.length === 0) {
        showPlaceholder();
    }
}

function recreateTask(teammateName, taskText, date, isCompleted) {
    const mainContent = document.getElementById("main-content");
    
    // See if teammate section already exists
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
    individualTask.setAttribute("task-date", date);

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    
    // Apply line-through if completed
    if (isCompleted) {
        taskSpan.style.textDecoration = 'line-through';
    }

    const checkboxDetails = document.createElement("div");
    checkboxDetails.className = "checkbox-details";

    const checkboxText = document.createElement("span");
    checkboxText.textContent = `Due: ${date || "No date set"}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;

    /* mark completed tasks */
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            taskSpan.style.textDecoration = 'line-through';
        } else {
            taskSpan.style.textDecoration = 'none';
        }
        // Save when checkbox changes
        saveToLocalStorage();
    });

    checkboxDetails.append(checkboxText, checkbox);
    individualTask.append(taskSpan, checkboxDetails);
    taskWrapper.appendChild(individualTask);
}

function addTeammate(input){
    const newOption = document.createElement("option");
    newOption.textContent = input;
    newOption.id = `option${count}`;
    count++;

    const selectContainer = document.getElementById("selectId");
    selectContainer.appendChild(newOption);

    //Disable the placeholder once a teammate is added
    const assignOption = document.getElementById("assign-option");
    if (assignOption) {
        assignOption.disabled = true;
    }
}

function sortSelect(select){
    const assignOption = document.getElementById("assign-option");
    const currentSelectedValue = select.value;

    let options = Array.from(select.options).filter(opt => opt !== assignOption);
    options.sort((a, b) => a.textContent.localeCompare(b.textContent));

    select.innerHTML = ""; //clear html inside select

    if (assignOption){
        select.appendChild(assignOption);
    }
    options.forEach(option => select.appendChild(option));

    select.value = currentSelectedValue;
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

document.addEventListener("DOMContentLoaded", function() {
    //Load saved data when page loads
    loadFromLocalStorage();

    const addButton = document.getElementById("add-button");
    const inputField = document.getElementById("input1");

    addButton.addEventListener("click", function(){
        const inputText = inputField.value.trim();
        const selectContainer = document.getElementById("selectId");

        //empty input
        if (!inputText) {
            alert("Name cannot be empty");
            return;
        }
        //duplicate input
        const options = Array.from(selectContainer.options);
        const isHere = options.some(option => option.textContent == inputText);
        if (isHere){
            alert(`${inputText} alreays exists`);
            return;
        }
        
        addTeammate(inputText);
        sortSelect(selectContainer);
        inputField.value = "";

        //Save to localStorage at the end
        saveToLocalStorage();
    });

    const clearButton = document.getElementById("clear-button");

    /* Click clearCompleted button to remove checked checkboxes */
    clearButton.addEventListener("click", function(){
        const mainContent = document.getElementById("main-content");
        const checkboxes = Array.from(mainContent.querySelectorAll("input"));

        const teammateSections = new Set();

        checkboxes.forEach(checkbox => {
            if (checkbox.checked){
                // Find the parent .tasks div and remove it
                const taskDiv = checkbox.closest('.tasks');
                const teammateSection = checkbox.closest('.content');

                if (taskDiv) {
                    taskDiv.remove();
                    if (teammateSection) {
                        teammateSections.add(teammateSection);
                    }
                }
            }
        });

        /* If teammate section is empty, remove section */
        teammateSections.forEach(section => {
            const remainingTasks = section.querySelectorAll('.tasks');
            if (remainingTasks.length == 0) {
                section.remove();
                showPlaceholder();
            }
        });

        saveToLocalStorage();
    });

    /* Reset button */
    const resetButton = document.getElementById("reset-button");
    const selectOptions = document.getElementById("selectId");
    resetButton.addEventListener("click", function(){
        const confirmation = confirm("Are you sure you want to delete everything and reset?");
        if (!confirmation) {
            return;
        }

        const mainContent = document.getElementById("main-content");
        mainContent.innerHTML = ""; 
        selectOptions.innerHTML = '<option value="" id="assign-option" selected>Assign to</option>';

        showPlaceholder();

        //Clear localStorage
        localStorage.removeItem("teammates");
        localStorage.removeItem("tasks");
    });

});