const GAMEVERSION = "dev-2.3.2"

let clicker = document.getElementById("clicker");
let clickerCountElem = document.getElementById("clicker-count");
let upgradeSection = document.getElementById("upgrade-section");
let shinyUpgradeSection = document.getElementById("shiny-upgrade-section");
let prestigeBtn = document.querySelector("#prestige-btn");
let prestigeCountElem = document.querySelector("#prestige-count");
let buyShinyBtn = document.querySelector("#buy-shiny-btn");
let shinyCountElem = document.querySelector("#shiny-count");
let currClickerSection;

class Upgrade {
    constructor(title, subtitleFunc, costFunc) {
        this.title = title;
        this.subtitleFunc = subtitleFunc; // takes num bought as parameter
        this.costFunc = costFunc; // takes num bought as parameter
    }
}

class BasicUpgrade {
    constructor(clicks, autoclicks, title, subtitle = "auto", cost = "auto") {
        this.cost = cost === "auto" ? clicks * 100 + autoclicks * 60 : cost;
        this.title = title;
        this.subtitle = subtitle === "auto" ? ((clicks === 0 ? "" : "+" + format(clicks) + " Saharsh Power\n") + (autoclicks === 0 ? "" : "+" + format(autoclicks) + " SPS")) : subtitle;
        this.clicks = clicks;
        this.autoclicks = autoclicks;
    }
}

let upgrades = [
    new BasicUpgrade(0, 1, "Person of the day", "+1 SPS(Saharsh Per Second)"),
    new BasicUpgrade(1, 0, "Centrix81 Addiction", "+1 Saharsh Power"),
    new BasicUpgrade(0, 5, "SPED class", "+5 SPS(Saharsh Per Second)"),
    new BasicUpgrade(0, 10, "Leaked yearbook photo", "+10 SPS(Saharsh Per Second)"),
    new BasicUpgrade(25, 0, "2.5 GPA"),
    new BasicUpgrade(0, 70, "Gets hacked"),
    new BasicUpgrade(100, 0, "70 IQ"),
    new BasicUpgrade(0, 190, "\"Below Average\" on CAST test"),
    new BasicUpgrade(200, 200, "2.0 GPA"),
    new BasicUpgrade(0, 674, "Leaked IP Address(205.173.47.249)"),
    new BasicUpgrade(706, 0, "Leaked Bio ID", "+K706 Saharsh Power where K is 1 and K706 is Saharsh's Bio ID"),
    new BasicUpgrade(0, 1000, "Forgot discord account password"),
    new BasicUpgrade(0, 1973, "Owner of 1973 Member Group Chat", "at Oct 31, 7:19 PM\n+1,973 SPS"),
    new BasicUpgrade(3000, 0, "60 IQ"),
    new BasicUpgrade(0, 5000, "50 IQ"),
    new BasicUpgrade(7463, 0, "Owner of 7463 Member Group Chat", "at Nov 4, 7:48 AM\n+7,463 Saharsh Power"),
    new BasicUpgrade(15000, 0, "1.5 GPA"),
    new BasicUpgrade(10000, 10000, "Saharsh in 7th grade"),
    new BasicUpgrade(20000, 20000, "1.0 GPA"),
    new BasicUpgrade(0, 49603, "Leaked Food Service Account Number"),
    new BasicUpgrade(51486, 0, "Leaked Insurance Plan ID: W0051486"),
    new BasicUpgrade(100000, 0, "0.5 GPA"),
    new BasicUpgrade(0, 100000, "40 IQ"),
    new BasicUpgrade(300000, 0, "30 IQ"),
    new BasicUpgrade(0, 300000, "0.0 GPA"),
    new BasicUpgrade(500000, 500000, "Leaked Social Security Number"),
    new BasicUpgrade(1000000, 0, "20 IQ"),
    new BasicUpgrade(0, 1000000, "10 IQ"),
    new BasicUpgrade(5000000, 5000000, "Skipped Tetanus, Diphtheria and Acellular Pertussis (Tdap) vaccine"),
    new BasicUpgrade(5250578, 0, "Leaked ID Number"),
    new BasicUpgrade(10000000, 10000000, "0 IQ"),
    new BasicUpgrade(909343909, 909343909, "Leaked Insurance Member ID:", "TGX909343909\n+909,343,909 Saharsh Power\n+909,343,909 SPS"),
    new BasicUpgrade(1000000000, 0, "Broken computer"),
    new BasicUpgrade(0, 1000000000, "Person of the day II"),
    new BasicUpgrade(2000000000, 0, "Centrix81 Addiction II"),
    new BasicUpgrade(0, 2000000000, "SPED Class II"),
    new BasicUpgrade(10000000000, 0, "Leaked yearbook photo II"),
    new BasicUpgrade(0, 10000000000, "Get hacked II"),
    new BasicUpgrade(100000000000, 0, "\"Below average\" on CAST test II"),
    new BasicUpgrade(0, 100000000000, "Forgot Discord account password II"),
    new BasicUpgrade(1000000000000, 0, "Skip Tdap vaccine II"),
    new BasicUpgrade(10000000000000, 0, "Person of the day III"),
    new BasicUpgrade(100000000000000, 0, "Centrix81 Addiction III"),
    new BasicUpgrade(0, 1000000000000000, "SPED Class III"),
    new BasicUpgrade(1000000000000000, 1000000000000000, "Leaked yearbook photo III"),
    new BasicUpgrade(0, 10000000000000000, "Get hacked III"),
    new BasicUpgrade(10000000000000000, 0, "\"Below average\" on CAST test III"),
    new BasicUpgrade(10000000000000000000, 0, "Forgot Discord Account password III"),
    new BasicUpgrade(0, 10000000000000000000, "Skip Tdap Vaccine III"),
    new BasicUpgrade(1000000000000000000000000, 1000000000000000000000000, "Saharsh", "Final upgrade\n+10^24 Saharsh Power\n+10^24 SPS"),
]

let shinyUpgrades = [
    new Upgrade("Shiny Boost", (n)=>(`+50% SPS and Saharsh Power (Currently: +${n*50}%)`), (n)=>(10+10*n)),
    new Upgrade("Saharsh Finance", (n)=>(`Decrease the cost multiplier ${getCostMulti(gameState.ownedShinyUpgrades[1])} -> ${getCostMulti(gameState.ownedShinyUpgrades[1]+1)}`), (n)=>(10+10*n)),
    new Upgrade("Saharsh Expertise", (n)=>(`+100% Saharsh XP generation (Currently: +${n*100}%)`), (n)=>(6+3*n))
]

function resetGameState() {
    gameState.clickerCount = 0;
    gameState.prestigeCount = 0;
    gameState.shinyCount = 0;
    gameState.boughtShinies = 0;
    gameState.ownedUpgrades = new Array(upgrades.length).fill(0);
    gameState.ownedShinyUpgrades = new Array(shinyUpgrades.length).fill(0);
    gameState.xpCount = 0;
}

let gameState = {};
resetGameState();

let bonusMulti = 1;
let pendingPrestige = 0;
let dnStreak = 0;

if (localStorage.getItem("gameState-v" + GAMEVERSION)) {
    try {
        gameState = JSON.parse(localStorage.getItem("gameState-v" + GAMEVERSION));
        if (!gameState.ownedUpgrades) {
            gameState.ownedUpgrades = new Array(upgrades.length).fill(0);
        }
    } catch (e) {
        //alert("Error in save state parsing");
        resetGameState();
    }
}

function format(num) {
    if (num < 1e3) {
        return num - Math.floor(num) === 0 ? num.toString() : num.toFixed(2);
    } else if (num < 1e12) {
        return Math.floor(num).toLocaleString();
    } else {
        return num.toExponential(6);
    }
}

function getCostMulti(upg1) {
    return 0.2*Math.pow(0.75, upg1)+1;
}

function getXpReq(lv) {
    return 25*(lv*lv+lv);
}

function getTotalXpReq(lv) {
    let totalXp = 0;
    for (let i = 0; i <= lv; i++) {
        totalXp += getXpReq(i);
    }
    return totalXp;
}

function getLevel() {
    let lv = 0;
    let reqXp = 0;
    while (reqXp <= gameState.xpCount) {
        reqXp += getXpReq(lv+1);
        lv++;
    }
    return lv-1;
}

function getBoostFromLevel() {
    return 1+Math.pow(getLevel(), 1.5)/100;
}

function getUpgradeCost(i) {
    return Math.ceil(upgrades[i].cost * getCostMulti(gameState.ownedShinyUpgrades[1]) ** gameState.ownedUpgrades[i]);
}

function getShinyCost() {
    return Math.pow(10, 3*Math.sqrt(gameState.boughtShinies+1));
}

function updateUpgradeSection() {
    let upgItems = document.querySelectorAll(".upgrade-item");

    let highestOwnedUpg = 0;
    for (let i = upgrades.length-1; i >= 0; i--) {
        if (gameState.ownedUpgrades[i] > 0) {highestOwnedUpg = i+1; break;}
    }

    for (let i = 0; i < upgItems.length; i++) {
        let upgrade = upgrades[i];
        let num = gameState.ownedUpgrades[i];
        let cost = getUpgradeCost(i);
        let item = upgItems[i];

        let isVisible = (i <= highestOwnedUpg || gameState.clickerCount >= upgrades[i - 1].cost);

        if (!isVisible) {
            item.innerHTML = `<pre class="upgrade-text"><strong>???</strong> <i class="small">(??? Saharsh)</i></pre>`;
            item.classList.add("hidden");
        } else {
            item.classList.remove("hidden");
            if (gameState.clickerCount < cost) {
                item.classList.add("locked");
            } else {
                item.classList.remove("locked");
            }
            
            let desc = upgrade.subtitle ? upgrade.subtitle.replace(/\n/g, "<br>") : "";
            item.innerHTML = `<pre class="upgrade-text"><strong>${upgrade.title}</strong> <i class="small">(${format(cost)} Saharsh)</i> <i class="small">(owned: ${num})</i>${desc ? "<p class=\"small\">" + desc + "</p>" : ""}</pre>`;
        }
    }

    if ((gameState.prestigeCount > 0 || gameState.clickerCount >= 1e27)) {
        prestigeBtn.innerHTML = `<pre class="upgrade-text"><strong>Saharsh Prestige</strong> <p class="small">Ascend to a higher Saharsh (+${pendingPrestige} Super Saharsh)</p></pre>`;
    }
}

function updateShinyUpgradeSection() {
    buyShinyBtn.innerHTML = `<pre class="upgrade-text"><strong>Buy a Shiny Saharsh</strong> <p class="small">${format(getShinyCost())} Saharsh</p></pre>`

    let upgItems = document.querySelectorAll(".shiny-upgrade-item");
    for (let i = 0; i < upgItems.length; i++) {
        let upgrade = shinyUpgrades[i];
        let num = gameState.ownedShinyUpgrades[i];
        let cost = Math.ceil(upgrade.costFunc(num));
        let item = upgItems[i];

        if (gameState.shinyCount < cost) {
            item.classList.add("locked");
        } else {
            item.classList.remove("locked");
        }
        
        let sub = upgrade.subtitleFunc(num);
        let desc = sub ? sub.replace(/\n/g, "<br>") : "";
        item.innerHTML = `<pre class="upgrade-text"><strong>${upgrade.title}</strong> <i class="small">(${format(cost)} Shiny Saharsh)</i> <i class="small">(owned: ${num})</i>${desc ? "<p class=\"small\">" + desc + "</p>" : ""}</pre>`;
    }
}

function updateCountDisplay() {
    clickerCountElem.innerHTML = `${format(gameState.clickerCount)}x Saharsh <i class="small">(${format(getAutoPerSec())} SPS)</i>`;
    shinyCountElem.innerHTML = `${format(gameState.shinyCount)}x Shiny Saharsh`;
    shinyCountElem.style.display = gameState.shinyCount > 0 ? "block" : "none";
    prestigeCountElem.innerHTML = `${format(gameState.prestigeCount)}x Super Saharsh <span class="small">(${format((2+gameState.prestigeCount)**2/4)}x Saharsh Production)</span>`
    prestigeCountElem.style.display = gameState.prestigeCount > 0 ? "block" : "none";
}

function updateXpBar() {
    let xpInLevel = gameState.xpCount-getTotalXpReq(getLevel());
    let reqXp = getXpReq(getLevel()+1);

    document.getElementById("xp-text").innerHTML = `Level ${getLevel()} - ${format(xpInLevel)}/${format(reqXp)} Saharsh XP (+${format(100*(getBoostFromLevel()-1))}%)`
    document.getElementById("xp-progress").style.width = 500*xpInLevel/reqXp + "px";
}

function buyUpgrade(index) {
    let cost = getUpgradeCost(index);
    if (gameState.clickerCount >= cost) {
        gameState.clickerCount -= cost;
        gameState.ownedUpgrades[index]++;
    }
    gameState.xpCount += 30*Math.log10(10*upgrades[index].clicks + 6*upgrades[index].autoclicks) * (1+gameState.ownedShinyUpgrades[2]);
}

function buyShinyUpgrade(index) {
    let cost = Math.ceil(shinyUpgrades[index].costFunc(gameState.ownedShinyUpgrades[index]));
    if (gameState.shinyCount >= cost) {
        gameState.shinyCount -= cost;
        gameState.ownedShinyUpgrades[index]++;
    }
}

function getClickPower() {
    let clickPower = 1;
    for (let i = 0; i < upgrades.length; i++) {
        clickPower += upgrades[i].clicks * gameState.ownedUpgrades[i];
    }
    clickPower *= (2+gameState.prestigeCount)**2/4 * (1 + gameState.ownedShinyUpgrades[0]*0.5) * getBoostFromLevel();
    clickPower *= bonusMulti;
    return clickPower;
}

function getAutoPerSec() {
    let autoPerSec = 0;
    for (let i = 0; i < upgrades.length; i++) {
        autoPerSec += upgrades[i].autoclicks * gameState.ownedUpgrades[i];
    }
    autoPerSec *= (2+gameState.prestigeCount)**2/4 * (1 + gameState.ownedShinyUpgrades[0]*0.5) * getBoostFromLevel();
    autoPerSec *= bonusMulti;
    return autoPerSec;
}

function doubleOrNothing(currency) {
    let resElement = document.querySelector("#dn-result");
    if (Math.random()>0.5) {
        gameState[currency] *= 2;
        if (resElement.innerHTML.indexOf("DOUBLE") !== -1) {
            dnStreak++;
        } else {
            dnStreak = 1;
        }

        resElement.style.color = "#00aa00";
        resElement.innerHTML = "DOUBLE" + (dnStreak > 1 ? "<i> x" + dnStreak + "</i>" : "");
    } else {
        gameState[currency] = 0;
        if (resElement.innerHTML.indexOf("NOTHING") !== -1) {
            dnStreak++;
        } else {
            dnStreak = 1;
        }

        resElement.style.color = "#aa0000";
        resElement.innerHTML = "NOTHING" + (dnStreak > 1 ? "<i> x" + dnStreak + "</i>" : "");
    }
}

function click() {
    gameState.clickerCount += getClickPower();
    gameState.xpCount += (1+Math.log10(getClickPower())) * (1+gameState.ownedShinyUpgrades[2]);

    let numText = document.createElement("div");
    numText.classList.add("click-number-text");
    numText.innerHTML = "+" + format(getClickPower());
    numText.style.top = (window.innerHeight/2 + 20 + 20*(Math.random()-1/2)) + "px";
    numText.style.left = (window.innerWidth/2 - 15 + 200*(Math.random()-1/2)) + "px";
    numText.addEventListener('animationend', numText.remove);
    document.querySelector("#click-number-texts").appendChild(numText);

    if (Math.random() < 1/512) {
        gameState.shinyCount++;
        gameState.xpCount += 80*(1+Math.log10(getClickPower())) * (1+gameState.ownedShinyUpgrades[2]);

        let numText = document.createElement("div");
        numText.classList.add("click-number-text");
        numText.style.color = "#ffbf00";
        numText.style.fontSize = "24px";
        numText.innerHTML = "+1";
        numText.style.top = (window.innerHeight/2 + 20 + 20*(Math.random()-1/2)) + "px";
        numText.style.left = (window.innerWidth/2 - 15 + 200*(Math.random()-1/2)) + "px";
        numText.addEventListener('animationend', numText.remove);
        document.querySelector("#click-number-texts").appendChild(numText);
    }
}

function doPrestige() {
    if (pendingPrestige >= 1) {
        gameState.prestigeCount += pendingPrestige;
        gameState.ownedUpgrades = new Array(upgrades.length).fill(0);
        gameState.clickerCount = 0;
    }
}

document.addEventListener("DOMContentLoaded", (e) => {
    updateUpgradeSection();
    currClickerSection = "clicker-game-section";

    for (let i = 0; i < upgrades.length; i++) {
        let upgItem = document.createElement("div");
        upgItem.classList.add("upgrade-btn");
        upgItem.classList.add("upgrade-item");
        upgItem.innerHTML = `<pre class="upgrade-text"><strong>???</strong> <i class="small">(??? Saharsh)</i></pre>`;
        upgradeSection.appendChild(upgItem);
    }

    for (let i = 0; i < shinyUpgrades.length; i++) {
        let upgItem = document.createElement("div");
        upgItem.classList.add("upgrade-btn");
        upgItem.classList.add("shiny-upgrade-item");
        shinyUpgradeSection.appendChild(upgItem);
    }

    prestigeBtn.innerHTML = '<pre class="upgrade-text"><strong>???????</strong><p class="small"></p></pre>';
    upgradeSection.appendChild(prestigeBtn);

    addEventListener("mousemove", (e) => {
        customCursor.style.transform = `translate(${e.clientX-20}px, ${e.clientY-20}px)`;
    }, {passive: true});

    clicker.addEventListener("click", click);

    document.getElementById("upgrade-svg").addEventListener("click", (e) => {
        currClickerSection = currClickerSection === "clicker-upgrade-section" ? "clicker-game-section" : "clicker-upgrade-section";
    });

    document.getElementById("shiny-upgrade-svg").addEventListener("click", (e) => {
        currClickerSection = currClickerSection === "clicker-shiny-upgrade-section" ? "clicker-game-section" : "clicker-shiny-upgrade-section";
    });

    document.getElementById("gambling-icon").addEventListener("click", (e) => {
        currClickerSection = currClickerSection === "gambling-section" ? "clicker-game-section" : "gambling-section";
    });

    upgradeSection.addEventListener("click", (e) => {
        let target = e.target.closest(".upgrade-btn");
        if (target !== null) {
            if (target.id === "prestige-btn") {
                doPrestige();
            } else {
                let ind = Array.from(document.querySelectorAll(".upgrade-item")).indexOf(target);
                buyUpgrade(ind);
            }
        }
    });

    shinyUpgradeSection.addEventListener("click", (e) => {
        let target = e.target.closest(".upgrade-btn");
        if (target !== null) {
            if (target.id === "buy-shiny-btn") {
                if (gameState.clickerCount >= getShinyCost()) {
                    gameState.clickerCount -= getShinyCost();
                    gameState.boughtShinies++;
                    gameState.shinyCount++;
                }
            } else {
                let ind = Array.from(document.querySelectorAll(".shiny-upgrade-item")).indexOf(target);
                buyShinyUpgrade(ind);
            }
        }
    });

    // autosave
    setInterval(() => {
        localStorage.setItem("gameState-v" + GAMEVERSION, JSON.stringify(gameState));
    }, 1000);

    setInterval(() => {
        updateCountDisplay();
        if (document.querySelector("#clicker-upgrade-section").style.display !== "none") {
            updateUpgradeSection();
        }
        if (document.querySelector("#shiny-upgrade-section").style.display !== "none") {
            updateShinyUpgradeSection();
        }
        updateXpBar();

        for (let elem of document.querySelectorAll(".clicker-section")) {
            elem.style.display = document.getElementById(currClickerSection) === elem ? "block" : "none";
        }

        gameState.clickerCount += getAutoPerSec()/60;

        pendingPrestige = gameState.clickerCount < 1e27 ? 0 : (Math.log10(gameState.clickerCount) - 26) ** 2;
    }, 16);
})