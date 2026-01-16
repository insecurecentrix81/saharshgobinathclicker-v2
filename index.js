const GAMEVERSION = "dev-2.0.0"
// localStorage.clear() // FOR DEBUGGING (commented out)

let clicker = document.getElementById("clicker");
let clickerCountElement = document.getElementById("clicker-count");
let upgradeSection = document.getElementById("upgrade-section");
class Upgrade {
    constructor(clicks, autoclicks, title, cost, subtitle = "auto") {
        this.cost = cost;
        this.title = title;
        this.subtitle = subtitle === "auto" ? ((clicks === 0 ? "" : clicks + " Saharsh Power\n") + (autoclicks === 0 ? "" : autoclicks + " SPS")) : subtitle;
        this.clicks = clicks;
        this.autoclicks = autoclicks;
    }
}

let avaliableUpgrades = [
    new Upgrade(0, 1, "Person of the day", "+1 SPS(Saharsh Per Second)"),
    new Upgrade(1, 0, "Centrix81 Addiction", "+1 Saharsh Power"),
    new Upgrade(0, 5, "SPED class", "+5 SPS(Saharsh Per Second)"),
    new Upgrade(0, 10, "Leaked yearbook photo", "+10 SPS(Saharsh Per Second)"),
    new Upgrade(25, 0, "2.5 GPA"),
    new Upgrade(0, 70, "Gets hacked"),
    new Upgrade(100, 0, "70 IQ"),
    new Upgrade(190, 190, "\"Below Average\" on CAST test"),
    new Upgrade(200, 200, "2.0 GPA"),
    new Upgrade(0, 674, "Leaked IP Address(205.173.47.249)"),
    new Upgrade(0, 706, "Leaked Bio ID", "+K706 SPS where K is 1 and K706 is Saharsh's Bio ID"),
    new Upgrade(0, 1000, "Forgot discord account password"),
    new Upgrade(0, 1973, "Owner of 1973 Member Group Chat", "at Oct 31, 7:19 PM\n+1973 SPS"),
    new Upgrade(5000, 0, "60 IQ"),
    new Upgrade(0, 5000, "50 IQ"),
    new Upgrade(7463, 0, "Owner of 7463 Member Group Chat", "at Nov 4, 7:48 AM\n+7463 Saharsh Power"),
    new Upgrade(15000, 0, "1.5 GPA"),
    new Upgrade(10000, 10000, "Saharsh in 7th grade"),
    new Upgrade(20000, 20000, "1.0 GPA"),
    new Upgrade(0, 49603, "Leaked Food Service Account Number"),
    new Upgrade(51486, 0, "Leaked Insurance Plan ID: W0051486"),
    new Upgrade(100000, 0, "0.5 GPA"),
    new Upgrade(0, 100000, "40 IQ"),
    new Upgrade(300000, 0, "30 IQ"),
    new Upgrade(0, 300000, "0.0 GPA"),
    new Upgrade(500000, 500000, "Leaked Social Security Number"),
    new Upgrade(1000000, 0, "20 IQ"),
    new Upgrade(0, 1000000, "10 IQ"),
    new Upgrade(5000000, 5000000, "Skipped Tetanus, Diphtheria and Acellular Pertussis (Tdap) vaccine"),
    new Upgrade(5250578, 0, "Leaked ID Number"),
    new Upgrade(10000000, 10000000, "0 IQ"),
    new Upgrade(909343909, 909343909, "Leaked Insurance Member ID:", "TGX909343909\n+909343909 Saharsh Power\n+909343909 SPS"),
    new Upgrade(1000000000, 0, "Broken computer"),
    new Upgrade(0, 1000000000, "Person of the day II"),
    new Upgrade(2000000000, 0, "Centrix81 Addiction II"),
    new Upgrade(0, 2000000000, "SPED Class II"),
    new Upgrade(10000000000, 0, "Leaked yearbook photo II"),
    new Upgrade(0, 10000000000, "Get hacked II"),
    new Upgrade(100000000000, 0, "\"Below average\" on CAST test II"),
    new Upgrade(0, 100000000000, "Forgot Discord account password II"),
    new Upgrade(1000000000000, 0, "Skip Tdap vaccine II"),
    new Upgrade(10000000000000, 0, "Person of the day III"),
    new Upgrade(100000000000000, 0, "Centrix81 Addiction III"),
    new Upgrade(0, 1000000000000000, "SPED Class III"),
    new Upgrade(1000000000000000, 1000000000000000, "Leaked yearbook photo III"),
    new Upgrade(0, 10000000000000000, "Get hacked III"),
    new Upgrade(10000000000000000, 0, "\"Below average\" on CAST test III"),
    new Upgrade(10000000000000000000, 0, "Forgot Discord Account password III"),
    new Upgrade(0, 10000000000000000000, "Skip Tdap Vaccine III"),
    new Upgrade(1000000000000000000000000, 1000000000000000000000000, "Saharsh", "Final upgrade\n+1000000000000000000000000 Saharsh Power\n+1000000000000000000000000 SPS"),
]

const gameState = {
    clickerCount: 0,
    prestigeCount: 0,
    ownedUpgrades: new Array(avaliableUpgrades.length).fill(0)
}

let clickPower = 1;
let autoPerSec = 0;

function computePowers() {
    clickPower = 1;
    autoPerSec = 0;
    for (let i = 0; i < avaliableUpgrades.length; ++i) {
        let upgrade = avaliableUpgrades[i];
        let owned = gameState.ownedUpgrades[i];
        clickPower += upgrade.clicks * owned;
        autoPerSec += upgrade.autoclicks * owned;
    }
}

if (localStorage.getItem("gameState-v" + GAMEVERSION)) {
    try {
        gameState = JSON.parse(localStorage.getItem("gameState-v" + GAMEVERSION));
        if (!gameState.ownedUpgrades) {
            gameState.ownedUpgrades = new Array(avaliableUpgrades.length).fill(0);
        }
    } catch (e) {
        alert("Error in save state parsing");
        gameState = {
            clickerCount: 0,
            prestigeCount: 0,
            ownedUpgrades: new Array(avaliableUpgrades.length).fill(0)
        };
    }
}

addEventListener("mousemove", (e) => {
    customCursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
}, { passive: true });

// autosave
setInterval(() => {
    localStorage.setItem("gameState-v" + GAMEVERSION, JSON.stringify(gameState));
}, 1000);

function updateUpgradeSection() {
    // Skip update if upgrade menu is not visible
    if (document.getElementById("clicker-upgrade-section").style.display === "none") return;

    upgradeSection.innerHTML = "";

    let upgItems = document.querySelectorAll(".upgrade-item");

    for (let i = 0; i < avaliableUpgrades.length; ++i) {
        let upgrade = avaliableUpgrades[i];
        let owned = gameState.ownedUpgrades[i];
        let cost = Math.ceil(upgrade.cost * COST_MULTIPLIER ** gameState.ownedUpgrades[i]);

        let item = upgItems[i];

        let canAfford = gameState.clickerCount >= cost;

        // Determine visibility
        let isVisible;
        if (i === 0) {
            isVisible = true;
        } else {
            let prevOwned = gameState.ownedUpgrades[i - 1] > 0;
            let canAffordPrev = gameState.clickerCount >= avaliableUpgrades[i - 1].cost;
            isVisible = prevOwned || canAffordPrev;
        }

        if (!isVisible) {
            // Hidden upgrade - show as ???
            item.innerHTML = `<pre style="white-space:pre-wrap"><strong>???</strong> <i class="small">(??? Saharsh)</i></pre>`;
            item.classList.add("hidden");
        } else if (!canAfford) {
            // Visible but cannot afford - gray out
            let desc = upgrade.subtitle ? upgrade.subtitle.replace(/\n/g, "<br>") : "";
            item.innerHTML = `<pre style="white-space:pre-wrap"><strong>${upgrade.title}</strong> <i class="small">(${cost} Saharsh)</i> <i class="small">(owned: ${owned})</i>${desc ? "<p class=\"small\">" + desc + "</p>" : ""}</pre>`;
            item.classList.add("locked");
        } else {
            // Can afford - show normally
            let desc = upgrade.subtitle ? upgrade.subtitle.replace(/\n/g, "<br>") : "";
            item.innerHTML = `<pre style="white-space:pre-wrap"><strong>${upgrade.title}</strong> <i class="small">(${cost} Saharsh)</i> <i class="small">(owned: ${owned})</i>${desc ? "<p class=\"small\">" + desc + "</p>" : ""}</pre>`;
        }
    }
}

document.getElementById("upgrade-svg").addEventListener("click", (e) => {
    document.getElementById("clicker-game-section").style.display = "none";
    document.getElementById("clicker-upgrade-section").style.display = "block";
    updateUpgradeSection();
});

document.getElementById("exit-upgrade-svg").addEventListener("click", (e) => {
    document.getElementById("clicker-game-section").style.display = "block";
    document.getElementById("clicker-upgrade-section").style.display = "none";
});

upgradeSection.addEventListener("click", (e) => {
    let target = e.target.closest(".upgrade-item");
    if (target && !target.classList.contains("locked") && !target.classList.contains("hidden")) {
        let index = parseInt(target.getAttribute("data-index"));
        let cost = Math.ceil(avaliableUpgrades[index].cost * COST_MULTIPLIER ** gameState.ownedUpgrades[index]);
        if (gameState.clickerCount >= cost) {
            gameState.clickerCount -= cost;
            gameState.ownedUpgrades[index]++;
            computePowers();
            updateCountDisplay();
            updateUpgradeSection();
        }
    }
});

document.addEventListener("DOMContentLoaded", (e) => {
    for (let i = 0; i < avaliableUpgrades.length; ++i) {
        let upgItem = document.createElement("div");
        upgItem.classList.add("upgrade-item");
        upgItem.setAttribute("data-index", i);
        upgradeSection.appendChild(upgItem);
    }
})
