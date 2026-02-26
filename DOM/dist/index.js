let todos = [];
let editingId = null;
let editingValue = "";
// Adding Task
let form = document.getElementById("form");
let input = document.getElementById("inputValue");
let listItems = document.getElementById("item");
// Adding Task
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let value = input.value.trim();
    if (!value)
        return;
    let newTask = {
        id: Date.now().toString(),
        task: value,
    };
    todos.push(newTask);
    console.log(newTask);
    input.value = "";
    render();
});
function render() {
    listItems.innerHTML = "";
    for (let i = 0; i < todos.length; i++) {
        let display = todos[i];
        let items = document.createElement("li");
        const isEditing = editingId === display.id;
        let taskContent = document.createElement("div");
        taskContent.className = "task-content";
        if (isEditing) {
            let editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = editingValue;
            editInput.className = "edit-input";
            editInput.addEventListener("input", (e) => {
                editingValue = e.target.value;
            });
            taskContent.append(editInput);
        }
        else {
            let text = document.createElement("span");
            text.className = "task-text";
            text.textContent = display.task;
            taskContent.append(text);
        }
        let actions = document.createElement("div");
        actions.className = "task-actions";
        if (isEditing) {
            let saveBtn = document.createElement("button");
            saveBtn.textContent = "Save";
            saveBtn.className = "todo-save";
            saveBtn.addEventListener("click", () => saveEdit(display.id));
            let cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancel";
            cancelBtn.className = "todo-cancel";
            cancelBtn.addEventListener("click", cancelEdit);
            actions.append(saveBtn, cancelBtn);
        }
        else {
            let editBtn = document.createElement("span");
            editBtn.setAttribute("class", "material-symbols-outlined");
            editBtn.textContent = "edit";
            editBtn.addEventListener("click", () => startEdit(display.id));
            let deleteBtn = document.createElement("span");
            deleteBtn.setAttribute("class", "material-symbols-outlined");
            deleteBtn.textContent = "delete";
            deleteBtn.dataset.todoId = display.id;
            deleteBtn.addEventListener("click", () => deleteTask(display.id));
            actions.append(editBtn, deleteBtn);
        }
        items.append(taskContent, actions);
        listItems.append(items);
    }
}
function deleteTask(id) {
    todos = todos.filter((todo) => todo.id !== id);
    if (editingId === id) {
        editingId = null;
        editingValue = "";
    }
    render();
}
function startEdit(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo)
        return;
    editingId = id;
    editingValue = todo.task;
    render();
}
function saveEdit(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo)
        return;
    const cleanedTask = editingValue.trim();
    if (!cleanedTask)
        return;
    todo.task = cleanedTask;
    editingId = null;
    editingValue = "";
    render();
}
function cancelEdit() {
    editingId = null;
    editingValue = "";
    render();
}
export {};
//# sourceMappingURL=index.js.map