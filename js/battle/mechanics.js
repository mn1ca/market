var turns = 1;

// Set to opening battle
document.addEventListener('DOMContentLoaded', function() {
    menu(0);

    document.getElementById('next').addEventListener('click', nextHandler);

    renderDisplay('stand');
    renderDisplay('merchant');

    renderStats(snowdrop);
    renderStats(snowbell);

    document.getElementById('name').innerHTML = merchant.name;
    document.getElementById('morale').innerHTML = merchant.morale;
    document.getElementById('price').innerHTML = merchant.price;

    document.getElementById('money').innerHTML = money;

    //let i = 1;
    //merchant['move' + i]();
});


function renderStats(character) {
    const name = character.name;

    const stats = document.createElement('div');
    stats.id = name;
    stats.classList.add('stats');
    stats.innerHTML = `<h1>${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</h1>
            <div class='line'>
                <h2>Morale</h2><span id='${name}-morale'>${character.morale}</span><span></span>
                <h2>SP</h2><span id='${name}-sp'>${character.sp}</span>
            </div>
            <div class='stats-img ${name}-img'></div>`;

    const statusEffects = document.createElement('div');
    statusEffects.classList.add('statuseffects');
    statusEffects.id = `${name}-statuseffects`;
    stats.append(statusEffects);

    document.getElementById('stats').append(stats);

    return;
}


function renderDisplay(name) {
    const display = document.createElement('div');
    display.id = name;
    document.getElementById('display').append(display);
}

// Toggles visibility of side text / next button depending on mode
function toggle(mode) {
    // Mode 0: menu -> text
    // Mode 1: text -> menu

    const next = document.getElementById('next');
    const side = document.getElementById('side-text');

    next.style.display = 'none';
    next.style.transform = 'rotate(0deg)';
    next.addEventListener('click', nextHandler);

    if (!mode) {
        side.style.display = 'none';
    } else {
        side.style.display = 'block';
    }

    return;
}


// Handler for clicking next button
function nextHandler() {
    textbox.removeEventListener('click', nextHandler);

    // Hand off to Snowbell
    if (active === snowdrop) {
        document.getElementById(active.name).style.transform = 'scale(1)';
        active = snowbell;
        document.getElementById(active.name).style.transform = 'scale(1.1)';
        handoff();

    // Hand off to merchant
    } else if (active === snowbell) {
        document.getElementById(active.name).style.transform = 'scale(1)';
        active = merchant;
        merchantTurn();

    // Complete turn; hand off to Snowdrop
    } else {
        turns++;
        document.getElementById('turn').innerHTML = turns;

        active = snowdrop;
        document.getElementById(active.name).style.transform = 'scale(1.1)';
        handoff();
    }

    // Clear out expired status effects
    const divName = (active === merchant) ? 'merchant' : active.name;
    for (let i = 0; i < active.effects.length; i++) {
        if (active.effects[i]) {
            active.effects[i]--;

            if (!active.effects[i])
                document.getElementById(`${divName}-effect-${i}`).remove();
            else
                document.getElementById(`${divName}-turns-${i}`).innerHTML = active.effects[i];
        }
    }
    return;
}


// Check if anything prevents normal turn
function handoff() {
    if (active.sp < 5) {
        active.sp++;
        document.getElementById(`${active.name}-sp`).innerHTML = active.sp;
    }

    // Stun
    if (statusEffects[0].use()) return;

    menu();
    return;
}


function menu(i = 1) {

    if (i)
        noise();

    const sideText = document.getElementById('side-text');
    const textbox = document.getElementById('textbox');
    const menu = `<span class='textbox-item' onclick='haggle()'>Haggle</span>
        <span class='textbox-item' onclick='skill()'>Skill</span>
        <span class='textbox-item' onclick='defend()'>Defend</span>
        <span class='textbox-item'>Item</span>
        <span class='textbox-item'>End</span>`;

    sideText.innerHTML = 'Select a command.';
    textbox.innerHTML = menu;
    toggle(1);

}



// Parse text and additional status effect messages
async function updateText(str) {
    const textbox = document.getElementById('textbox');
    const next = document.getElementById('next');

    textbox.innerHTML = '';

    let messages = [str];

    let s = statusEffects[1].use();
    if (s) messages.push(s);

    s = statusEffects[2].use();
    if (s) messages.push(s);

    let index = 0;
    async function showNextMessage() {
        if (index < messages.length) {
            noise();

            next.removeEventListener('click', showNextMessage);
            textbox.removeEventListener('click', showNextMessage);

            // If message begins with number (status effect)
            if (/^\d/.test(messages[index])) {

                const effect = messages[index].substr(0, 1);
                statusEffects[effect].effect();

                await typeText(messages[index].substr(1), textbox);

            } else {
                await typeText(messages[index], textbox);
            }

            index++;

            next.addEventListener('click', showNextMessage);
            textbox.addEventListener('click', showNextMessage);
            next.style.display = 'block';

        } else {
            next.removeEventListener('click', showNextMessage);
            textbox.removeEventListener('click', showNextMessage);

            next.addEventListener('click', nextHandler);
            textbox.addEventListener('click', nextHandler);
        }
    }
    showNextMessage(); // Start the first message
}


// Calculate player damage to merchant based on stats
function updateDmg(dmg, price, move, add = '') {

    if (!dmg) {
        const str = `${active.name} used ${move}.\nHowever, ${merchant.name} was unaffected.`;
        updateText(str);
        return;
    }

    let crit = '';
    console.log(active)

    // Crit
    if (Math.random() < active.crit) {
        dmg = Math.floor(dmg * 1.5);
        crit = 'critical';
    }

    merchant.morale -= dmg;
    let priceDmg = (price) ?
          Math.floor(Math.sqrt(dmg) + Math.abs(Math.sin(dmg) * dmg / 20)) : 0;


    if (merchant.morale < 0) merchant.morale = 0;

    if (merchant.price - priceDmg < merchant.minPrice) {
        priceDmg = merchant.price - merchant.minPrice;
        merchant.price = merchant.minPrice;
    } else {
        merchant.price -= priceDmg;
    }

    animateCount('morale', dmg * -1);
    animateCount('price', priceDmg * -1);

    let str = `${active.name} used ${move}. ${add}\n${merchant.name}'s morale received ${dmg} ${crit} damage.`

    if (priceDmg)
        str += ` The price fell by ${priceDmg} ⨷.`;

    updateText(str);
    animateDmg();

    return;
}


// Move and flash merchant sprite in response to damage taken
function animateDmg() {
    const merchant = document.getElementById('merchant');
    const transformX = 20;
    const transformY = 5;

    merchant.style.filter = 'brightness(1.7)';
    merchant.style.transform = `translateX(${transformX}px) translateY(-${transformY}px)`;

    merchant.style.transitionProperty = 'all';
    merchant.style.transitionDuration = '0.5s';

    setTimeout( () => { merchant.style.filter = 'brightness(1)'; merchant.style.transform = 'translateX(0px) translateY(0px)'; }, 175);

    return;
}


