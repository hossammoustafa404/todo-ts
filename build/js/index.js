"use strict";
// Handle Submit Function
const handleSubmit = (e) => {
    const inputElement = document.getElementById("todoInput");
    e.preventDefault();
    const inputVal = inputElement.value;
    if (inputVal === "") {
        return;
    }
    const todoObj = createTodo(inputVal);
    addToList(todoObj);
    controlLocalStorage("add", todoObj);
    inputElement.value = "";
};
// Create Todo function
const createTodo = (text) => {
    const id = new Date().getMilliseconds().toString();
    const todoObj = {
        id,
        text,
        completed: false,
    };
    return todoObj;
};
// Add to list Function
const addToList = (todoObj) => {
    const todoList = document.querySelector(".todo-list");
    const liElement = document.createElement("li");
    liElement.classList.add("todo-parent");
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.id = todoObj.id;
    checkboxElement.classList.add("todo-checkbox");
    const labelElement = document.createElement("label");
    labelElement.htmlFor = todoObj.id;
    labelElement.classList.add("todo-text");
    const todoText = document.createTextNode(todoObj.text);
    labelElement.appendChild(todoText);
    checkboxElement.addEventListener("change", () => {
        if (checkboxElement.checked === true) {
            labelElement.classList.add("done");
        }
        else {
            labelElement.classList.remove("done");
        }
        controlLocalStorage("update", Object.assign(Object.assign({}, todoObj), { completed: checkboxElement.checked }));
    });
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("remove-btn");
    removeBtn.appendChild(document.createTextNode("remove"));
    removeBtn.addEventListener("click", () => {
        todoList.removeChild(liElement);
        controlLocalStorage("remove", todoObj);
    });
    liElement.appendChild(checkboxElement);
    liElement.appendChild(labelElement);
    liElement.appendChild(removeBtn);
    todoList.appendChild(liElement);
};
// Control Local Storage Function
const controlLocalStorage = (type, payload) => {
    if (type === "add") {
        if (localStorage.getItem("todos")) {
            const todos = JSON.parse(localStorage.getItem("todos"));
            localStorage.setItem("todos", JSON.stringify([...todos, payload]));
        }
        else {
            localStorage.setItem("todos", JSON.stringify([payload]));
        }
    }
    else if (type === "update") {
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos.find((todo) => {
            if (todo.id === payload.id) {
                todo.completed = payload.completed;
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    else if (type === "remove") {
        const todos = JSON.parse(localStorage.getItem("todos"));
        const filteredTodos = todos.filter((todo) => {
            if (todo.id !== payload.id) {
                return todo;
            }
        });
        localStorage.setItem("todos", JSON.stringify(filteredTodos));
    }
};
// Clear Todos Function
const clearTodos = () => {
    const todoList = document.querySelector(".todo-list");
    while (todoList.children.length) {
        todoList.removeChild(todoList.children[0]);
    }
    localStorage.removeItem("todos");
};
// Start Function
const start = () => {
    const formElement = document.querySelector(".todo-form");
    const clearBtn = document.querySelector(".clear-btn");
    if (localStorage.getItem("todos")) {
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos.map((todo) => {
            addToList(todo);
        });
    }
    formElement.addEventListener("submit", handleSubmit);
    clearBtn.addEventListener("click", clearTodos);
};
start();
