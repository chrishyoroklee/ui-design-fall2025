count = 1;
function addTeammate(input){
    const newOption = document.createElement("option");
    newOption.textContent = input;
    newOption.id = `option${count}`;
    count++;

    const selectContainer = document.getElementById("selectId");
    selectContainer.appendChild(newOption);
}

document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("add-button");
    const inputField = document.getElementById("input1");
    addButton.addEventListener("click", function(){
        const inputText = inputField.value.trim();
        if (inputText) {
            addTeammate(inputText);
            inputField.value = "";
        }
    });
})