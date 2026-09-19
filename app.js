// 1. Initial Game Data Configuration
let gameData = {
    "Valorant": [
        {action: "forward", key: "w", category: "movement"},
        {action: "backward", key: "s", category: "movement"},
        {action: "left", key: "a", category: "movement"},
    ],   
    "Minecraft": [
        {action: "jump", key: "space", category: "movement"},
        {action: "crouch", key: "shift", category: "movement"},
        {action: "sprint", key: "ctrl", category: "movement"},
    ],
};

let currentGame = "Valorant";

// 2. DOM Elements
const gameTabs = document.getElementById("gameTabs");
const bindingsBody = document.getElementById("bindingsBody");
const searchBar = document.getElementById("searchBar");
const newGameInput = document.getElementById("newGameInput");
const addGameBtn = document.getElementById("addGameBtn");
const deleteGameBtn = document.getElementById("deleteGameBtn");

// NEW: Binding Inputs
const newActionInput = document.getElementById("newActionInput");
const newKeyInput = document.getElementById("newKeyInput");
const newCategoryInput = document.getElementById("newCategoryInput");
const addBindingBtn = document.getElementById("addBindingBtn");

// 3. Render Tabs dynamically
function renderTabs() {
    gameTabs.innerHTML = "";
    Object.keys(gameData).forEach(game => {
        const btn = document.createElement("button");
        btn.classList.add("tab-button");
        if (game === currentGame) btn.classList.add("active");
        btn.textContent = game;
        btn.addEventListener("click", () => {
            currentGame = game;
            renderTabs();
            renderBindings();
        });
        gameTabs.appendChild(btn);
    });
}

// 4. Render Bindings based on active game and search term
function renderBindings(searchTerm = "") {
    bindingsBody.innerHTML = "";
    const bindings = gameData[currentGame] || [];

    // Filter bindings based on search
    const filteredBindings = bindings.filter(item =>
        item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredBindings.forEach(binding => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${binding.action}</td>
            <td>${binding.key}</td>
            <td>${binding.category}</td>
            <td style="text-align: center;">
                <button class="btn-row-delete" data-action="${binding.action}">🗑️</button>
            </td>
        `;
        
        // Add row deletion event directly onto the trash icon button
        row.querySelector(".btn-row-delete").addEventListener("click", () => {
            deleteBinding(binding.action);
        });

        bindingsBody.appendChild(row);
    });
}

// 5. Add a New Game
function addGame() {
    const gameName = newGameInput.value.trim();
    if (!gameName) return alert("Please enter a game name.");
    if (gameData[gameName]) return alert("This game already exists!");

    gameData[gameName] = [];
    currentGame = gameName;
    newGameInput.value = "";
    renderTabs();
    renderBindings();
}

// 6. Delete the Current Active Game
function deleteGame() {
    const games = Object.keys(gameData);
    if (games.length <= 1) return alert("You must keep at least one game in your list!");

    if (confirm(`Are you sure you want to delete ${currentGame}?`)) {
        delete gameData[currentGame];
        currentGame = Object.keys(gameData)[0];
        renderTabs();
        renderBindings();
    }
}

// 7. NEW: Add a New Keybind Row
function addBinding() {
    const action = newActionInput.value.trim();
    const key = newKeyInput.value.trim();
    const category = newCategoryInput.value.trim() || "General"; // Default fallback category

    if (!action || !key) {
        return alert("Please fill out both the Action and Keybind fields.");
    }

    // Append the new keybind configuration directly to our active game profile array
    gameData[currentGame].push({ action, key, category });

    // Clear the tiny row input boxes
    newActionInput.value = "";
    newKeyInput.value = "";
    newCategoryInput.value = "";

    // Re-render the visual list table view
    renderBindings(searchBar.value);
}

// 8. NEW: Delete a Specific Keybind Row
function deleteBinding(actionName) {
    // Find item array location matching the clicked rows action name strings
    const index = gameData[currentGame].findIndex(item => item.action === actionName);
    
    if (index !== -1) {
        gameData[currentGame].splice(index, 1); // Splice cleanly drops it out of memory array index
        renderBindings(searchBar.value);
    }
}

// 9. Event Listeners
searchBar.addEventListener("input", (e) => {
    renderBindings(e.target.value);
});

addGameBtn.addEventListener("click", addGame);
deleteGameBtn.addEventListener("click", deleteGame);
addBindingBtn.addEventListener("click", addBinding);

newGameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addGame();
});

// Also trigger row bindings save instantly if pressing enter on the last input row
newCategoryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addBinding();
});

// 10. Initial Setup Execution on Page Load
renderTabs();
renderBindings();
