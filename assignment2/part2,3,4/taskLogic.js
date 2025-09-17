mainElement = document.getElementById("main-content");

//if task section is empty, display placeholder msg
if (mainElement){
    if (mainElement.children.length == 0){
        const placeholder = document.createElement("p");
        placeholder.textContent = "No tasks right now. Please add a teammate and assign a task";
        placeholder.id = "task-placeholder";
        mainElement.appendChild(placeholder);
    }
}