count = 1;
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
    });

});