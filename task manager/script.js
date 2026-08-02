const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

displayTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){
    if(e.key==="Enter"){
        addTask();
    }
});

function addTask(){

    const text = taskInput.value.trim();

    if(text==="") return;

    tasks.push({
        id:Date.now(),
        text:text,
        completed:false
    });

    saveTasks();
    displayTasks();

    taskInput.value="";
}

function displayTasks(){

    taskList.innerHTML="";

    let filtered = tasks;

    if(currentFilter==="completed"){
        filtered = tasks.filter(task=>task.completed);
    }

    if(currentFilter==="pending"){
        filtered = tasks.filter(task=>!task.completed);
    }

    filtered.forEach(task=>{

        const li=document.createElement("li");

        li.innerHTML=`
        <div class="task-left">
            <input type="checkbox" ${task.completed?"checked":""}>
            <span class="${task.completed?"completed":""}">
                ${task.text}
            </span>
        </div>

        <div class="task-buttons">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
        `;

        const checkbox=li.querySelector("input");
        checkbox.addEventListener("change",()=>{
            task.completed=!task.completed;
            saveTasks();
            displayTasks();
        });

        li.querySelector(".delete").addEventListener("click",()=>{
            tasks=tasks.filter(t=>t.id!==task.id);
            saveTasks();
            displayTasks();
        });

        li.querySelector(".edit").addEventListener("click",()=>{

            const updated=prompt("Edit Task",task.text);

            if(updated!==null && updated.trim()!==""){
                task.text=updated.trim();
                saveTasks();
                displayTasks();
            }

        });

        taskList.appendChild(li);

    });

}

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

filters.forEach(button=>{

    button.addEventListener("click",()=>{

        filters.forEach(btn=>btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter=button.dataset.filter;

        displayTasks();

    });

});

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeBtn.textContent="☀️ Light Mode";
    }else{
        localStorage.setItem("theme","light");
        themeBtn.textContent="🌙 Dark Mode";
    }

});

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
    themeBtn.textContent="☀️ Light Mode";
}