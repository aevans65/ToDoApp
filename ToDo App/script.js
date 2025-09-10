const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask(){
     if(inputBox.value.trim() === ''){
        alert("Please enter a valid task!");
        return;
} 

    createTaskElement(inputBox.value);
    inputBox.value = "";
    saveData();
 } 
  // Helper function to create <li> and span
function createTaskElement(taskText, checked = false){
    const li = document.createElement("li");
    li.textContent = taskText;
    if(checked) li.classList.add("checked");

    const span = document.createElement("span");
    span.textContent = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
}
 listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
         e.target.classList.toggle("checked");
         saveData();
    } 
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove(); 
        saveData();
     } 
});
//Double click to edit
listContainer.addEventListener("dblclick", function(e){
    if(e.target.tagName === "LI"){
        const oldText = e.target.firstChild.textContent;
        const newText = prompt("Edit task:", oldText);
        if(newText && newText.trim() !== "") {
            e.target.firstChild.textContent = newText.trim();
            saveData();
        }
    }
});

//Save tatsks as JSON in local storage
function saveData(){
    const tasks = [];
    listContainer.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            checked: li.classList.contains("checked")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTask(){
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    listContainer.innerHTML = "";
    storedTasks.forEach(t => {
        createTaskElement(t.text, t.checked);
    });
}

//Enter key adds task
inputBox.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});
// Clear completed tasks functionality
document.getElementById("clear-completed").addEventListener("click", function(){
    listContainer.querySelectorAll("li.checked").forEach(li => li.remove());
    saveData();
});
// Filter functionality
document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", function(){
        const filter = this.dataset.filter;
        listContainer.querySelectorAll("li").forEach(li => {
            li.style.display = 
                filter === "all" ? "list-item" :
                (filter === "active" && !li.classList.contains("checked")) ? "list-item" :
                (filter === "completed" && li.classList.contains("checked")) ? "list-item" :
                "none";
        });
    });
});
// Load tasks on page load
showTask();