const GAMEVERSION = "dev-2.5.0"

let clicker = document.getElementById("clicker");
let clickerCountElem = document.getElementById("clicker-count");
let upgradeSection = document.getElementById("upgrade-section");
let shinyUpgradeSection = document.getElementById("shiny-upgrade-section");
let prestigeBtn = document.querySelector("#prestige-btn");
let prestigeCountElem = document.querySelector("#prestige-count");
let buyShinyBtn = document.querySelector("#buy-shiny-btn");
let shinyCountElem = document.querySelector("#shiny-count");
let currClickerSection;

let sData;
fetch("2025-09-14.json").then(r => r.json()).then(d => {sData = d.students.filter(s => s.id > 138000000 && s.school.includes("Cupertino High School") && s.image[0] != "https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/images/user-default.svg")})

class Upgrade {
    constructor(title, subtitleFunc, costFunc) {
        this.title = title;
        this.subtitleFunc = subtitleFunc; // takes num bought as parameter
        this.costFunc = costFunc; // takes num bought as parameter
    }
}

class BasicUpgrade {
    constructor(clicks, autoclicks, title, subtitle = "auto") {
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
    new BasicUpgrade(5, 10, "Leaked yearbook photo"),
    new BasicUpgrade(25, 0, "2.5 GPA"),
    new BasicUpgrade(0, 70, "Gets hacked"),
    new BasicUpgrade(70, 0, "70 IQ"),
    new BasicUpgrade(0, 190, "\"Below Average\" on CAST test"),
    new BasicUpgrade(200, 200, "2.0 GPA"),
    new BasicUpgrade(0, 674, "Leaked IP Address(205.173.47.249)"),
    new BasicUpgrade(706, 0, "Leaked Bio ID", "+K706 Saharsh Power where K is 1 and K706 is Saharsh's Bio ID"),
    new BasicUpgrade(0, 1500, "Forgot discord account password"),
    new BasicUpgrade(1973, 0, "Owner of 1973 Member Group Chat", "at Oct 31, 7:19 PM\n+1,973 Saharsh Power"),
    new BasicUpgrade(0, 4000, "60 IQ"),
    new BasicUpgrade(4000, 0, "50 IQ"),
    new BasicUpgrade(7463, 0, "Owner of 7463 Member Group Chat", "at Nov 4, 7:48 AM\n+7,463 Saharsh Power"),
    new BasicUpgrade(0, 15000, "1.5 GPA"),
    new BasicUpgrade(20000, 0, "1.0 GPA"),
    new BasicUpgrade(0, 49603, "Leaked Food Service Account Number"),
    new BasicUpgrade(51486, 0, "Leaked Insurance Plan ID: W0051486"),
    new BasicUpgrade(70000, 70000, "Saharsh in 7th grade"),
    new BasicUpgrade(0, 200000, "0.5 GPA"),
    new BasicUpgrade(200000, 0, "40 IQ"),
    new BasicUpgrade(0, 600000, "30 IQ"),
    new BasicUpgrade(600000, 0, "0.0 GPA"),
    new BasicUpgrade(2000000, 2000000, "Leaked Social Security Number"),
    new BasicUpgrade(5250578, 0, "Leaked ID Number"),
    new BasicUpgrade(10000000, 10000000, "20 IQ"),
    new BasicUpgrade(0, 30000000, "10 IQ"),
    new BasicUpgrade(50000000, 50000000, "Skipped Tetanus, Diphtheria and Acellular Pertussis (Tdap) vaccine"),
    new BasicUpgrade(0, 200000000, "0 IQ"),
    new BasicUpgrade(300000000, 0, "Saharsh in 8th grade"),
    new BasicUpgrade(909343909, 909343909, "Leaked Insurance Member ID:", "TGX909343909\n+909,343,909 Saharsh Power\n+909,343,909 SPS"),
    new BasicUpgrade(0, 5000000000, "Broken computer"),
    new BasicUpgrade(5000000000, 0, "Person of the day II"),
    new BasicUpgrade(0, 20000000000, "Centrix81 Addiction II"),
    new BasicUpgrade(20000000000, 0, "SPED Class II"),
    new BasicUpgrade(0, 100000000000, "Leaked yearbook photo II"),
    new BasicUpgrade(100000000000, 0, "Get hacked II"),
    new BasicUpgrade(0, 500000000000, "\"Below average\" on CAST test II"),
    new BasicUpgrade(500000000000, 0, "Forgot Discord account password II"),
    new BasicUpgrade(2000000000000, 0, "Skip Tdap vaccine II"),
    new BasicUpgrade(0, 20000000000000, "Person of the day III"),
    new BasicUpgrade(100000000000000, 0, "Centrix81 Addiction III"),
    new BasicUpgrade(0, 500000000000000, "SPED Class III"),
    new BasicUpgrade(1000000000000000, 1000000000000000, "Leaked yearbook photo III"),
    new BasicUpgrade(0, 10000000000000000, "Get hacked III"),
    new BasicUpgrade(10000000000000000, 0, "\"Below average\" on CAST test III"),
    new BasicUpgrade(1000000000000000000, 0, "Forgot Discord Account password III"),
    new BasicUpgrade(0, 10000000000000000000, "Skip Tdap Vaccine III"),
    new BasicUpgrade(100000000000000000000, 0, "-100 IQ"),
    new BasicUpgrade(0, 500000000000000000000, "-4.0 GPA"),
    new BasicUpgrade(100000000000000000000000, 100000000000000000000000, "Saharsh", "Final upgrade\n+10^23 Saharsh Power\n+10^23 SPS"),
]

let shinyUpgrades = [
    new Upgrade("Shiny Saharsh Boost", (n)=>(`+50% SPS and Saharsh Power (Currently: +${n*50}%)`), (n)=>(10+10*n)),
    new Upgrade("Saharsh Finance", (n)=>(`Decrease the cost multiplier ${getCostMulti(gameState.ownedShinyUpgrades[1])} -> ${getCostMulti(gameState.ownedShinyUpgrades[1]+1)}`), (n)=>(10+10*n)),
    new Upgrade("Saharsh Expertise", (n)=>(`+100% Saharsh XP generation (Currently: +${n*100}%)`), (n)=>(6+3*n)),
    new Upgrade("Saharsh Crit Chance", (n)=>(`Every click has a chance of producing 25x Saharsh (${n*3}% -> ${(n+1)*3}%)`), (n)=>(8+8*n)),
    new Upgrade("Shiny Saharsh Chance", (n)=>(`Increase the Shiny Saharsh click chance (1/${Math.round(512*0.75**n)} -> 1/${Math.round(512*0.75**(n+1))})`), (n)=>(10+6*n)),
]

function resetGameState() {
    gameState.name = "Saharsh Gobinath";
    gameState.fName = "Saharsh";
    gameState.img = "https://asset-cdn.schoology.com/system/files/imagecache/profile_big/pictures/picture-c0b09cdead19788fb0f8be0d53b5c572_68c34cd700b90.jpg";
    gameState.clickerCount = 0;
    gameState.prestigeCount = 0;
    gameState.shinyCount = 0;
    gameState.boughtShinies = 0;
    gameState.ownedUpgrades = new Array(upgrades.length).fill(0);
    gameState.ownedShinyUpgrades = new Array(shinyUpgrades.length).fill(0);
    gameState.xpCount = 0;
    gameState.startTime = Date.now();
    gameState.difficulty = 0;
}

let gameState = {};
resetGameState();

let bonusMulti = 1;
let dnStreak = 0;
let currentSlotEffect = 0;

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

function formatHighPrec(num) {
    if (num < 1e3) {
        return num - Math.floor(num) === 0 ? num.toString() : num.toFixed(4);
    } else if (num < 1e6) {
        return num - Math.floor(num) === 0 ? num.toString() : num.toFixed(2);
    } else if (num < 1e12) {
        return Math.floor(num).toLocaleString();
    } else {
        return num.toExponential(6);
    }
}

function getCostMulti(upg1) {
    return 0.25*Math.pow(0.6, upg1)+1;
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
    return 1+Math.pow(getLevel(), 1.25)/80;
}

function getUpgradeCost(i) {
    let cost = 0;
    cost = 100*upgrades[i].clicks + 60*upgrades[i].autoclicks;

    cost *= getCostMulti(gameState.ownedShinyUpgrades[1]) ** gameState.ownedUpgrades[i];
    if (gameState.difficulty == 1) {
        cost *= 3;
    } else if (gameState.difficulty == 2) {
        cost *= 5 * (2 + (Date.now()-gameState.startTime)/1000/240);
    }

    return Math.ceil(cost);
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

        let isVisible = (i <= highestOwnedUpg || gameState.clickerCount >= getUpgradeCost(i-1) || gameState.clickerCount >= getUpgradeCost(i));

        if (!isVisible) {
            item.innerHTML = `<pre class="upgrade-text"><strong>???</strong> <i class="small">(??? ${gameState.fName})</i></pre>`;
            item.classList.add("hidden");
        } else {
            item.classList.remove("hidden");
            if (gameState.clickerCount < cost) {
                item.classList.add("locked");
            } else {
                item.classList.remove("locked");
            }
            
            let desc = upgrade.subtitle ? upgrade.subtitle.replace(/\n/g, "<br>") : "";
            
            if (gameState.difficulty === 1 && i === 0) {
                desc += "<i>\n(All SPS is multiplied by 2 in Hard Mode)</i>";
            }
            if (gameState.difficulty === 2 && i === 0) {
                desc += "<i>\n(All SPS is multiplied by 3 in Insane Mode)</i>";
            }

            desc = desc.replaceAll("Saharsh", gameState.fName);
            desc = desc.replaceAll("SPS", gameState.fName[0] + "PS");
            
            item.innerHTML = `<pre class="upgrade-text"><strong>${upgrade.title}</strong> <i class="small">(${format(cost)} ${gameState.fName})</i> <i class="small">(owned: ${num})</i>${desc ? "<p class=\"small\">" + desc + "</p>" : ""}</pre>`;
        }
    }

    if ((gameState.prestigeCount > 0 || gameState.clickerCount >= 1e26 || gameState.ownedUpgrades.at(-1) > 0)) {
        prestigeBtn.innerHTML = `<pre class="upgrade-text"><strong>${gameState.fName} Prestige</strong> <p class="small">Ascend to a higher ${gameState.fName} (+${formatHighPrec(getPendingPrestige())} Super ${gameState.fName})</p></pre>`;
    }
}

function updateShinyUpgradeSection() {
    buyShinyBtn.innerHTML = `<pre class="upgrade-text"><strong>Buy a Shiny ${gameState.fName}</strong> <p class="small">${format(getShinyCost())} ${gameState.fName}</p></pre>`

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
        desc = desc.replaceAll("Saharsh", gameState.fName);
        let title = upgrade.title;
        title = title.replaceAll("Saharsh", gameState.fName);

        item.innerHTML = `<pre class="upgrade-text"><strong>${title}</strong> <i class="small">(${format(cost)} Shiny ${gameState.fName})</i> <i class="small">(owned: ${num})</i>${desc ? "<p class=\"small\">" + desc + "</p>" : ""}</pre>`;
    }
}

function updateCountDisplay() {
    clickerCountElem.innerHTML = `${format(gameState.clickerCount)}x ${gameState.fName} <i class="small">(${format(getAutoPerSec())} ${gameState.fName[0]}PS)</i>`;
    shinyCountElem.innerHTML = `${format(gameState.shinyCount)}x Shiny ${gameState.fName}`;
    shinyCountElem.style.display = gameState.shinyCount > 0 ? "block" : "none";
    prestigeCountElem.innerHTML = `${format(gameState.prestigeCount)}x Super ${gameState.fName} <span class="small">(${format((2+gameState.prestigeCount)**2/4)}x ${gameState.fName} Production)</span>`
    prestigeCountElem.style.display = gameState.prestigeCount > 0 ? "block" : "none";
}

function updateXpBar() {
    let xpInLevel = gameState.xpCount-getTotalXpReq(getLevel());
    let reqXp = getXpReq(getLevel()+1);

    document.getElementById("xp-text").innerHTML = `Level ${getLevel()} - ${format(xpInLevel)}/${format(reqXp)} ${gameState.fName} XP (+${format(100*(getBoostFromLevel()-1))}%)`
    document.getElementById("xp-progress").style.width = 500*xpInLevel/reqXp + "px";
}

function buyUpgrade(index) {
    let cost = getUpgradeCost(index);
    if (gameState.clickerCount >= cost) {
        gameState.clickerCount -= cost;
        if (gameState.ownedUpgrades[index] == 0) {
            gameState.xpCount += 30*Math.log10(10*upgrades[index].clicks + 4*upgrades[index].autoclicks) * (1+gameState.ownedShinyUpgrades[2]) * getSlotsXpBoost();
        }
        gameState.ownedUpgrades[index]++;
    }
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
    clickPower *= getSlotsProdBoost();
    clickPower *= bonusMulti;
    return clickPower;
}

function getAutoPerSec() {
    let autoPerSec = 0;
    for (let i = 0; i < upgrades.length; i++) {
        autoPerSec += upgrades[i].autoclicks * gameState.ownedUpgrades[i];
    }
    autoPerSec *= (2+gameState.prestigeCount)**2/4 * (1 + gameState.ownedShinyUpgrades[0]*0.5) * getBoostFromLevel();
    autoPerSec *= getSlotsProdBoost();
    autoPerSec *= bonusMulti;
    if (gameState.difficulty === 1) {
        autoPerSec *= 2;
    }
    if (gameState.difficulty === 2) {
        autoPerSec *= 3;
    }
    return autoPerSec;
}

function getShinyChance() {
    let c = 1/(512 * 0.75**gameState.ownedShinyUpgrades[4]);
    if (currentSlotEffect === 3) {
        c *= 25;
    } else if (currentSlotEffect === 4) {
        c *= 5;
    }

    if (gameState.difficulty === 1) {
        c /= 2;
    } else if (gameState.difficulty === 2) {
        c /= 4;
    }
    return c;
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

function spinSlotMachine() {
    if (gameState.shinyCount < 2) return;
    gameState.shinyCount -= 2;

    for (let slot of document.getElementsByClassName("slot")) {
        slot.innerHTML = "";
    }
    let resElem = document.getElementById("slots-result");
    currentSlotEffect = 0;
    resElem.innerHTML = "";

    let slotInnerHtmls = ["💎", "🪙", "🍒", 
        '<img style="width:30px; height:30px" src="https://asset-cdn.schoology.com/system/files/imagecache/profile_big/pictures/picture-c0b09cdead19788fb0f8be0d53b5c572_68c34cd700b90.jpg">'
    ];
    let slots = [-1, -1, -1];
    setTimeout(()=>{
        let rand = Math.floor(Math.random()*4);
        document.getElementById("slot-1").innerHTML = slotInnerHtmls[rand];
        slots[0] = rand;
    }, 300)
    setTimeout(()=>{
        let rand = Math.floor(Math.random()*4);
        document.getElementById("slot-2").innerHTML = slotInnerHtmls[rand];
        slots[1] = rand;
    }, 600)
    setTimeout(()=>{
        let rand = Math.floor(Math.random()*4);
        document.getElementById("slot-3").innerHTML = slotInnerHtmls[rand];
        slots[2] = rand;
    }, 900)
    setTimeout(()=>{
        if (slots.filter((e)=>(e == 0)).length === 3) {
            resElem.innerHTML = `5x ${gameState.fName} production for 2 minutes!`;
            currentSlotEffect = 1;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML=``;}, 120000);
        } else if (slots.filter((e)=>(e == 0)).length === 2) {
            resElem.innerHTML = `2x ${gameState.fName} production for 1 minute!`;
            currentSlotEffect = 2;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML=``;}, 60000);
        } else if (slots.filter((e)=>(e == 1)).length === 3) {
            resElem.innerHTML = `25x Shiny ${gameState.fName} chance for 2 minutes!`;
            currentSlotEffect = 3;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML=``;}, 120000);
        } else if (slots.filter((e)=>(e == 1)).length === 2) {
            resElem.innerHTML = `5x Shiny ${gameState.fName} chance for 1 minute!`;
            currentSlotEffect = 4;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML=``;}, 60000);
        } else if (slots.filter((e)=>(e == 2)).length === 3) {
            resElem.innerHTML = `9x ${gameState.fName} XP for 2 minutes!`;
            currentSlotEffect = 5;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML=``;}, 120000);
        } else if (slots.filter((e)=>(e == 2)).length === 2) {
            resElem.innerHTML = `3x ${gameState.fName} XP for 1 minute!`;
            currentSlotEffect = 6;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML=``;}, 60000);
        } else if (slots.filter((e)=>(e == 3)).length === 3) {
            resElem.innerHTML = `${gameState.fName.toUpperCase()} JACKPOT! 20x ${gameState.fName} Production & ${gameState.fName} XP for 2 minutes!`;
            currentSlotEffect = 7;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML=``;}, 120000);
        } else if (slots.filter((e)=>(e == 3)).length === 2) {
            resElem.innerHTML = `3x ${gameState.fName} Production & ${gameState.fName} XP for 1 minute!`;
            currentSlotEffect = 8;
            setTimeout(()=>{currentSlotEffect = 0; resElem.innerHTML="";}, 60000);
        } else {
            resElem.innerHTML = "Nothing, please play again!";
        }
    }, 1200);
}

function getSlotsProdBoost() {
    if (currentSlotEffect === 1) return 5;
    if (currentSlotEffect === 2) return 2;
    if (currentSlotEffect === 7) return 20;
    if (currentSlotEffect === 8) return 3;
    return 1;
}

function getSlotsXpBoost() {
    if (currentSlotEffect === 5) return 9;
    if (currentSlotEffect === 6) return 3;
    if (currentSlotEffect === 7) return 20;
    if (currentSlotEffect === 8) return 3;
    return 1;
}

function changeDiff() {
    gameState.difficulty = (gameState.difficulty+1) % 3;
    resetGameState();
}

function click() {
    let critRand = (Math.random() < gameState.ownedShinyUpgrades[3]*0.03);
    let clickValue = critRand ? getClickPower()*25 : getClickPower();

    gameState.clickerCount += clickValue;
    gameState.xpCount += (1+Math.log10(clickValue)) * (1+gameState.ownedShinyUpgrades[2]) * getSlotsXpBoost();

    let numText = document.createElement("div");
    numText.classList.add("click-number-text");
    numText.innerHTML = "+" + format(clickValue);
    numText.style.top = (window.innerHeight/2 + 20 + 20*(Math.random()-1/2)) + "px";
    numText.style.left = (window.innerWidth/2 - 15 + 200*(Math.random()-1/2)) + "px";
    if (critRand) {numText.style.color = "#bb0000";}
    numText.addEventListener('animationend', numText.remove);
    document.querySelector("#click-number-texts").appendChild(numText);

    if (Math.random() < getShinyChance()) {
        gameState.shinyCount++;
        gameState.xpCount += 80*(1+Math.log10(clickValue)) * (1+gameState.ownedShinyUpgrades[2]) * getSlotsXpBoost();

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

function getPendingPrestige() {
    return gameState.clickerCount < 1e27 ? 0 : (Math.log10(gameState.clickerCount) - 26) ** 2;
}

function doPrestige() {
    if (getPendingPrestige() >= 1) {
        gameState.prestigeCount += getPendingPrestige();
        gameState.ownedUpgrades = new Array(upgrades.length).fill(0);
        gameState.clickerCount = 0;
    }
}

function changeName(n) {
    for (let s of sData) {
        if (s.name == n) {
            sName = n;
            gameState.fName = n.substring(0, n.indexOf(" "));
            gameState.img = s.image[0];

            return;
        }
    }
}

document.addEventListener('keydown', (e)=>{
    if (e.key === "Shift") {
        let nName = prompt("Change name:");
        if (nName != null) {
            changeName(nName);
        }
    }
});

document.addEventListener("DOMContentLoaded", (e) => {
    updateUpgradeSection();
    currClickerSection = "clicker-game-section";

    for (let i = 0; i < upgrades.length; i++) {
        let upgItem = document.createElement("div");
        upgItem.classList.add("upgrade-btn");
        upgItem.classList.add("upgrade-item");
        upgItem.innerHTML = `<pre class="upgrade-text"><strong>???</strong> <i class="small">(??? ${gameState.fName})</i></pre>`;
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
        document.getElementById("game-title").innerHTML = gameState.fName + " Clicker 2";
        document.getElementById("clicker-image").src = gameState.img;
        document.getElementById("customCursor").src = gameState.img;
        document.body.style.backgroundImage = "url('" + gameState.img + "')";

        updateCountDisplay();
        if (document.querySelector("#clicker-upgrade-section").style.display !== "none") {
            updateUpgradeSection();
        }
        if (document.querySelector("#shiny-upgrade-section").style.display !== "none") {
            updateShinyUpgradeSection();
        }
        updateXpBar();

        for (let elem of document.querySelectorAll(".clicker-section")) {
            elem.style.display = document.getElementById(currClickerSection) === elem ? "flex" : "none";
        }

        document.getElementById("gambling-icon").style.backgroundColor = currentSlotEffect == 0 ? "#3a7fff" : "#ffbd3a";
        document.getElementById("difficulty-button").innerHTML = "Difficulty: " + ["Normal", "Hard", "Insane"][gameState.difficulty];
        if (gameState.difficulty == 0) {
            document.getElementById("game-container").style.backgroundColor = "#ffffff";
            document.getElementById("info-container").style.color = "#000000";
        } else if (gameState.difficulty === 1) {
            document.getElementById("game-container").style.backgroundColor = "#ffffff";
            document.getElementById("info-container").style.color = "#600020";
        } else {
            document.getElementById("game-container").style.backgroundColor = "#000000";
            document.getElementById("info-container").style.color = "#ffadc3";
        }

        for (let btn of document.getElementsByClassName("cname")) {
            btn.innerHTML = gameState.fName;
        }
        
        if (gameState.difficulty == undefined) {gameState.difficulty = 0;}

        gameState.clickerCount += getAutoPerSec()/60;
        gameState.xpCount += (Math.log10(1+getAutoPerSec()))/60 * (1+gameState.ownedShinyUpgrades[2]) * getSlotsXpBoost();
    }, 16);
})