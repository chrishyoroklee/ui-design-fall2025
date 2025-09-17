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
})