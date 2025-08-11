const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'save-todo';
const DATA_KEY = 'SAVED_DATA';


function isStorageExist() {
    if (typeof (Storage) === 'undefined') {
        alert('Your browser does not support local storage. Please try a different browser.');
        return false;
    } else {
        return true;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadDataFromStorage();
    const form = document.getElementById('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        addTodo()
    });
});

function addTodo() {
    const name = document.getElementById('todoNameInput').value;
    const date = document.getElementById('todoDateInput').value;
    const todoId = generateId();

    const todoObject = generateTodoObject(todoId, name, date, false);
    todos.push(todoObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log(todos);
};

function generateId() {
    return +new Date();
}

function generateTodoObject(id, name, date, isCompleted) {
    return {
        id,
        name,
        date,
        isCompleted
    };
}

function makeTodo(todoObject) {
    const todoName = document.createElement('h3');
    const todoDate = document.createElement('p');

    todoName.innerText = todoObject.name;
    todoDate.innerText = todoObject.date;

    const dataContainer = document.createElement('div');
    dataContainer.classList.add('inner');
    dataContainer.append(todoName, todoDate);

    const finalContainer = document.createElement('div');
    finalContainer.classList.add('item');
    finalContainer.append(dataContainer);
    finalContainer.setAttribute('id', `${todoObject.id}`);

    // button
    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undoButton');
        undoButton.addEventListener('click', function () {
            undoTodo(todoObject.id);
        });
        const removeButton = document.createElement('button');
        removeButton.classList.add('removeButton');
        removeButton.addEventListener('click', function () {
            removeTodo(todoObject.id);
        });

        finalContainer.append(undoButton, removeButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('checkButton');
        checkButton.addEventListener('click', function() {
            checkTodo(todoObject.id);
        });
        finalContainer.append(checkButton);
    }
    return finalContainer;
}

document.addEventListener(RENDER_EVENT, function() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const completedList = document.getElementById('completedList');
    completedList.innerHTML = '';

    let todoCount = 0;
    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
            todoList.append(todoElement);
            todoCount++;
        } else {
            completedList.append(todoElement);
        }
    }
});

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
}

function checkTodo(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTodo(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTodo(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsedData = JSON.stringify(todos);
        localStorage.setItem(DATA_KEY, parsedData);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function() {
    console.log('Data has been saved.');
    console.log(localStorage.getItem(DATA_KEY));
});

function loadDataFromStorage() {
    const localData = localStorage.getItem(DATA_KEY);
    let parsedData = JSON.parse(localData);

    if (parsedData !== null) {
        for (const todo of parsedData) {
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}