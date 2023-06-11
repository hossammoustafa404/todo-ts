interface todoInterFace {
  id: string;
  text: string;
  completed: boolean;
}

// Handle Submit Function
const handleSubmit = (e: SubmitEvent): void => {
  const inputElement: HTMLInputElement = document.getElementById(
    "todoInput"
  ) as HTMLInputElement;

  e.preventDefault();
  const inputVal: string = inputElement.value;
  if (inputVal === "") {
    return;
  }

  const todoObj: todoInterFace = createTodo(inputVal);
  addToList(todoObj);
  controlLocalStorage("add", todoObj);
  inputElement.value = "";
};

// Create Todo function
const createTodo = (text: string): todoInterFace => {
  const id: string = new Date().getMilliseconds().toString();
  const todoObj: todoInterFace = {
    id,
    text,
    completed: false,
  };

  return todoObj;
};

// Add to list Function
const addToList = (todoObj: todoInterFace): void => {
  const todoList: HTMLUListElement = document.querySelector(
    ".todo-list"
  ) as HTMLUListElement;

  const liElement: HTMLLIElement = document.createElement("li");
  liElement.classList.add("todo-parent");

  const checkboxElement: HTMLInputElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.id = todoObj.id;
  checkboxElement.classList.add("todo-checkbox");

  const labelElement: HTMLLabelElement = document.createElement("label");
  labelElement.htmlFor = todoObj.id;
  labelElement.classList.add("todo-text");
  const todoText: Text = document.createTextNode(todoObj.text);
  labelElement.appendChild(todoText);
  checkboxElement.addEventListener("change", () => {
    if (checkboxElement.checked === true) {
      labelElement.classList.add("done");
    } else {
      labelElement.classList.remove("done");
    }
    controlLocalStorage("update", {
      ...todoObj,
      completed: checkboxElement.checked,
    });
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
const controlLocalStorage = (type: string, payload: todoInterFace): void => {
  if (type === "add") {
    if (localStorage.getItem("todos")) {
      const todos: todoInterFace[] = JSON.parse(localStorage.getItem("todos")!);
      localStorage.setItem("todos", JSON.stringify([...todos, payload]));
    } else {
      localStorage.setItem("todos", JSON.stringify([payload]));
    }
  } else if (type === "update") {
    const todos: todoInterFace[] = JSON.parse(localStorage.getItem("todos")!);

    todos.find((todo: todoInterFace): void => {
      if (todo.id === payload.id) {
        todo.completed = payload.completed;
      }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
  } else if (type === "remove") {
    const todos: todoInterFace[] = JSON.parse(localStorage.getItem("todos")!);
    const filteredTodos = todos.filter(
      (todo: todoInterFace): todoInterFace | undefined => {
        if (todo.id !== payload.id) {
          return todo;
        }
      }
    );
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  }
};

// Clear Todos Function
const clearTodos = (): void => {
  const todoList: HTMLUListElement = document.querySelector(
    ".todo-list"
  ) as HTMLUListElement;

  while (todoList.children.length) {
    todoList.removeChild(todoList.children[0]);
  }

  localStorage.removeItem("todos");
};

// Start Function
const start = (): void => {
  const formElement: HTMLFormElement = document.querySelector(
    ".todo-form"
  ) as HTMLFormElement;
  const clearBtn: HTMLButtonElement = document.querySelector(".clear-btn")!;

  if (localStorage.getItem("todos")) {
    const todos: todoInterFace[] = JSON.parse(localStorage.getItem("todos")!);
    todos.map((todo: todoInterFace): void => {
      addToList(todo);
    });
  }

  formElement.addEventListener("submit", handleSubmit);

  clearBtn.addEventListener("click", clearTodos);
};

start();
