// Sample game data for demonstration purposes
const gameData = {
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

// 4. Render Bindings based on active game search term
function renderBindings(searchTerm = "") {
    bindingsBody.innerHTML = "";
    const bindings = gameData[currentGame];

    const filtered = bindings.filtered(item =>
        item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.forEach(binding => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.action}</td>
            <td>${item.key}</td>
            <td>${item.category}</td>
        `;
        bindingsBody.appendChild(row);
    });
}

// 5. Event Listener for Live Search
searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    renderBindings(searchTerm);
});

// Initial Setup execution
renderTabs();
renderBindings();