var width = 25;
var statusEffects = [
    {
        name: 'Silenced',
        desc: 'Unable to take any actions',
        bg: `url(img/stati.png) 0 0 / cover`,
    },
    {
        name: 'Unmotivated',
        desc: 'Morale decreases slightly per turn',
        bg: `url(img/stati.png) -${width}px 0 / cover`,
    },
    {
        name: 'Rallied',
        desc: 'Morale increases slightly per turn',
        bg: `url(img/stati.png) ${width * 2}px 0 / cover`,
    },
    {
        name: 'Defending',
        desc: 'Takes reduced damage to morale',
        bg: `url(img/stati.png) ${width}px 0 / cover`,
    },
]

var turns = 5;

// Toggles visibility of side text / next button depending on mode
function toggle(mode) {
    // Mode 0: menu -> text
    // Mode 1: text -> menu

    const next = document.getElementById('next');
    const side = document.getElementById('side-text');

    next.style.display = 'none';
    next.style.transform = 'rotate(0deg)';
    next.onclick = nextHandler;

    if (!mode) {
        side.style.display = 'none';
    } else {
        side.style.display = 'block';
    }

    return;
}


// Handler for clicking next button
function nextHandler() {

    //temporary for testing
    console.log(document.getElementById(active.name));
    document.getElementById(active.name).style.transform = 'scale(1)';

    active = (active === snowdrop) ? snowbell : snowdrop;
    document.getElementById(active.name).style.transform = 'scale(1.1)';

    // Clear out expired status effects
    for (let i = 0; i < statusEffects.length; i++) {
        if (active.effects[i]) {
            active.effects[i]--;

            if (!active.effects[i])
                document.getElementById(`${active.name}-effect-${i}`).remove();
            else
                document.getElementById(`${active.name}-turns-${i}`).innerHTML = active.effects[i];
        }
    }

    menu();

    /*if (active === snowdrop) {
        active = snowbell;
        menu();
    } else {
        console.log('opp turn');
        menu();
    }*/

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
    textbox.removeEventListener('click', nextHandler);
    toggle(1);

}


// Add status effect to character and display
function addStatusEffect(i, turns, character = active) {

    // Apply to either player characters or merchant
    const divName = (character === merchant) ? 'merchant' : character.name;

    // If effect already exists, cap out and return
    if (character.effects[i]) {
        character.effects[i] = Math.max(character.effects[i], turns);
        document.getElementById(`${divName}-turns-${i}`).innerHTML = character.effects[i];
        return;
    }

    // Apply effect to character
    character.effects[i] = turns;
    const current = statusEffects[i];

    // Tooltip description
    const str = `<b>${current.name}:</b><br>${current.desc}<hr><h3>Turns remaining: <h3 id='${divName}-turns-${i}'>${character.effects[i]}</h3></h3> `;

    // Effect outer shell (tooltip)
    const element = document.createElement('div');
    element.classList.add('tooltip');
    element.innerHTML = `<span>${str}</span>`;

    // Effect inner (icon)
    const effect = document.createElement('div');
    element.id = `${divName}-effect-${i}`;
    effect.classList.add('statuseffect');
    effect.style.background = current.bg;
    element.append(effect);

    document.getElementById(`${divName}-statuseffects`).append(element);
    return;
}


// Calculate player damage to merchant based on stats
function updateDmg(dmg, price, move, bonus = '') {

    if (!dmg) {
        const str = `${active.name} used ${move}.\nHowever, ${merchant.name} was unaffected.`;
        typeText(str);
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

    let str = `${active.name} used ${move}. ${bonus}\n${merchant.name}'s morale received ${dmg} ${crit} damage.`

    if (priceDmg)
        str += ` The price fell by ${priceDmg} ⨷.`;

    typeText(str);
    animateDmg();

    return;
}


// Move and flash merchant sprite in response to damage taken
function animateDmg() {
    const merchant = document.getElementById('merchant');
    const transformX = 20;
    const transformY = 10;

    merchant.style.filter = 'brightness(1.7)';
    merchant.style.transform = `translateX(${transformX}px) translateY(-${transformY}px)`;

    merchant.style.transitionProperty = 'all';
    merchant.style.transitionDuration = '0.5s';

    setTimeout( () => { merchant.style.filter = 'brightness(1)'; merchant.style.transform = 'translateX(0px) translateY(0px)'; }, 175);

    return;
}


