let Display = document.getElementById("display");
let clearBtn = document.getElementById("clearBtn");

// Point this at your backend server
const API_URL = "http://localhost:3001/api/history";

function appendvalue(value) {
    if (value === "+/-") {
        if (display.value !== "") {
            display.value = Number(display.value) * -1;
        }
    } else {
        display.value += value;
    }
    updateClearButton();
}

function updateClearButton() {
    // AC when display is empty, C once something is typed
    clearBtn.textContent = display.value.length > 0 ? "C" : "AC";
}

function handleClear() {
    if (clearBtn.textContent === "AC") {
        // Full reset
        display.value = "";
    } else {
        // "C" — only remove the last number entered, not the whole expression
        display.value = display.value.replace(/(\d+\.?\d*|\.\d+)$/, "");
    }
    updateClearButton();
}

async function calculate(){
    const expression = display.value;
    try{
        const result = eval(expression);
        display.value = result;
        updateClearButton();
        await saveToHistory(expression, result);
        renderHistory();
    }
    catch(error){
        display.value = "Error";
        updateClearButton();
    }
}


async function saveToHistory(expression, result) {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expression, result })
        });
    } catch (err) {
        console.error("Could not save history:", err);
    }
}

async function loadHistory() {
    try {
        const res = await fetch(API_URL);
        const rows = await res.json();
        console.log("Calculation history:", rows);
        return rows;
    } catch (err) {
        console.error("Could not load history:", err);
        return [];
    }
}

function handlekey(event) {
    const key = event.key;
    if ((key >= "0" && key <= "9") ||
        key === "+" || key === "-" ||
        key === "*" || key === "/" ||
        key === ".") {
        appendvalue(key);
    } else if (key === "Enter") {
        calculate();
    } else if (key === "Backspace") {
        handleClear();
    }
}
async function renderHistory() {
    const rows = await loadHistory();
    const list = document.getElementById("historyList");
    list.innerHTML = "";
    rows.forEach(row => {
        const li = document.createElement("li");
        li.textContent = `${row.expression} = ${row.result}`;
        li.style.padding = "4px 0";
        li.style.borderBottom = "1px solid #444";
        list.appendChild(li);
    });
}

async function clearHistoryUI() {
    try {
        await fetch(API_URL, { method: "DELETE" });
        renderHistory();
    } catch (err) {
        console.error("Could not clear history:", err);
    }
}
renderHistory();