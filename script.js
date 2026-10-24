
const form = document.getElementById("taskForm");
const plan = document.getElementById("studyPlan");
const taskList = document.getElementById("taskList");
const deadlineInput = document.getElementById("deadline");

deadlineInput.addEventListener("keydown", function(event) {
    event.preventDefault();
});

let tasks = [];

const today = new Date();
deadlineInput.min =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

function addTask() {
    const task = document.getElementById("task").value;
    const deadline = deadlineInput.value;

    if (!task || !deadline) {
        alert("Select a task and deadline.");
        return;
    }

    if (deadline < deadlineInput.min) {
        alert("Choose a deadline from tomorrow onwards.");
        return;
    }

    tasks.push({ task, deadline });
    taskList.innerHTML += `<p>${task} — ${deadline}</p>`;

    document.getElementById("task").value = "";
    deadlineInput.value = "";
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const task = document.getElementById("task").value;
    const deadline = deadlineInput.value;

    if (task && deadline) {
        if (deadline < deadlineInput.min) {
            alert("Choose a deadline from tomorrow onwards.");
            return;
        }
        tasks.push({ task, deadline });
    }

    if (tasks.length === 0) {
        alert("Add at least one task.");
        return;
    }

    const response = await fetch("/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.error);
        return;
    }

    plan.innerHTML = data.plan.map((item, index) =>
        `<p><strong>${index + 1}. ${item.task}</strong><br>
        Deadline: ${item.deadline}</p>`
    ).join("");

    document.querySelector("main section").style.display = "none";
});
