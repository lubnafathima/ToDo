// DISPLAYING DAY AND DATE
let today = document.querySelector(".date");

let getDate = new Date();
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekday = weekdays[getDate.getDay()];
const month = months[getDate.getMonth()];
const day = getDate.getDate();

today.textContent = `${weekday} - ${month} ${day}`;

// Default counters
let itemCount = 0;
let priorityCount = 0;
const checkPriority = "#priority";

// FUNCTION TO ADD TODO
const text = document.querySelector(".text");
const submit = document.querySelector(".submit");
const container = document.querySelector(".todo-section");

submit.onclick = addTodo;
text.onkeydown = (event) => {
  if (event.key === "Enter") {
    addTodo(event.target);
  }
};

function addTodo() {
  let getText = text.value.trim();

  if (getText !== "" && itemCount < 10) {
    // CREATING TODO
    const item = document.createElement("div");
    item.classList.add("item");

    // UPDATING TIME
    let newDate = new Date();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const period = hours >= 12 ? "pm" : "am";
    const getHours = hours % 12 === 0 ? 12 : hours % 12;
    const getMinutes = minutes < 10 ? "0" + minutes : minutes;
    const timeString = `${getHours}:${getMinutes} ${period}`;

    // PRIORITY
    let isPriority = false;
    if (getText.includes(checkPriority) && priorityCount < 3) {
      item.classList.add("priority");
      priorityCount++;
      isPriority = true;
    }
    getText = getText.replace(checkPriority, "");

    // ADDING DATA
    item.innerHTML = `
        <img src="unchecked.svg" alt="checkbox icon" class="checkbox">
        <p class="content">${getText}</p>
        <div class="option">
            <i class="fa-solid fa-trash delete"></i>
            <p class="time">${timeString}</p>
        </div>
    `;

    container.appendChild(item);

    addToLocalStorage(getText, timeString, isPriority);

    text.value = "";
    itemCount++;
  }
}

//
container.onclick = containerEvent;

function containerEvent(event) {
  let target = event.target;
  const text = target.nextElementSibling;
  const key = target.parentElement.parentElement.dataset.key;
  const todoItem = JSON.parse(localStorage.getItem(key));

  // Update todo item in localStorage
  todoItem.text = target.textContent;
  localStorage.setItem(key, JSON.stringify(todoItem));

  // UPDATING CHECKBOX
  if (target.matches(".checkbox")) {
    const src = target.getAttribute("src");

    if (src === "unchecked.svg") {
      target.setAttribute("src", "checked.svg");
      text.style.textDecoration = "line-through";
    } else {
      target.setAttribute("src", "unchecked.svg");
      text.style.textDecoration = "none";
    }
  }

  // ENABLING DELETE
  if (target.matches(".delete")) {
    if (target.closest(".priority")) {
      priorityCount--;
    }
    itemCount--;
    target.closest(".item").remove();
  }

  // EDIT TODO
  if (target.matches(".content")) {
    target.contentEditable = true;
  }
}

// ADDING TODO TO LOCAL STORAGE
function addToLocalStorage(todoText, timeString, isPriority) {
  const key = Date.now();

  const todoItem = {
    text: todoText,
    time: timeString,
    priority: isPriority,
  };

  localStorage.setItem(key, JSON.stringify(todoItem));
}

// GET TODO FROM LOCAL STORAGE
function getFromLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const todoItem = JSON.parse(localStorage.getItem(key));

    addItemToUI(todoItem, key);
  }
}

// DISPLAYING TODO FROM LOCAL STORAGE
function addItemToUI(todoItem, key) {
  const item = document.createElement("div");
  item.classList.add("item");

  // ADDING PRIORITY CLASS
  if (todoItem.priority) {
    item.classList.add("priority");
    console.log(item.classList);
  }

  // ADDING DATA
  item.innerHTML = `
      <img src="unchecked.svg" alt="checkbox icon" class="checkbox">
      <p class="content">${todoItem.text}</p>
      <div class="option">
          <i class="fa-solid fa-trash delete"></i>
          <p class="time">${todoItem.time}</p>
      </div>
  `;

  container.appendChild(item);

  // DELETING DATA
  const deleteButton = item.querySelector(".delete");
  deleteButton.addEventListener("click", () => {
    item.remove();
    localStorage.removeItem(key);
  });

  // EDITING DATA
}

// DISPLAYING DATA
getFromLocalStorage();
