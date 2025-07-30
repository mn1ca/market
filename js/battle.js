
var snowdrop = {
    name: 'Snowdrop',
    morale: 120,
    scale: 0.25,
    sp: 5,
    crit: 0.15,
    acc: 0.9,
    dodge: 0.05,
    effects: [0, 0, 0, 0],

    move0: {
        name: 'Tongue Twister',
        desc: 'Increases morale. Decrease accuracy and chance of landing attacks.',
        cost: 2,
        use: function() {

            const textbox = document.getElementById('textbox');
            textbox.innerHTML = '';

            if (active.sp < this.cost) {
                skill(0);
                return;
            }

            toggle(0);

            active.sp -= this.cost;
            animateCount('Snowdrop-sp', -1 * this.cost);

            const i = randomNum(10, 30)
            active.morale += i;
            animateCount('Snowdrop-morale', i);

            // Reduce accuracy and dodge
            active.acc *= 0.9;
            active.dodge *= 0.9;

            typeText(`${active.name} used ${this.name}.\n${active.name}'s morale increased. ${active.name}'s accuracy and landing rate fell.`);

        }
    },

    move1: {
        name: 'Pointed Jab',
        desc: 'Sharply decrease target morale without affecting price.',
        cost: 3,
        use: function() {

            const textbox = document.getElementById('textbox');
            textbox.innerHTML = '';

            if (active.sp < this.cost) {
                skill(1);
                return;
            }

            toggle(0);

            active.sp -= this.cost;

            // Missed
            if ( Math.random() > active.acc + 0.025 ) {
                updateDmg(0, false, this.name);
                return;
            }

            let dmg = 0.9 * active.morale;
            const variance = randomNum(0, 5);

            dmg = (Math.random() < .5 && dmg > 15) ? dmg - variance : dmg + variance;
            updateDmg(dmg, false, this.name);

            return;

        }
    },

    move2: {
        name: 'Riposte',
        desc: 'An attack that increases chance of critical damage.<br>It will always land.',
        cost: 3,
        use: function() {

            const textbox = document.getElementById('textbox');
            textbox.innerHTML = '';

            if (active.sp < this.cost) {
                skill(2);
                return;
            }

            toggle(0);

            active.sp -= this.cost;

            active.crit += 0.05;

            let dmg = active.scale * active.morale;
            const variance = randomNum(0, 5);

            dmg = (Math.random() < .5 && dmg > 15) ? dmg - variance : dmg + variance;
            updateDmg(dmg, true, this.name, 1);

            return;

        }
    }
};

var snowbell = {
    name: 'Snowbell',
    morale: 200,
    scale: 0.1,
    sp: 5,
    atk: 5,
    crit: 0.2,
    acc: .75,
    dodge: .02,
    defend: false,
    effects: [0, 0, 0],

    move0: {
        name: 'Psych-Up!',
        desc: 'Increase party morale.',
        cost: 3,
        use: function() {
            console.log('hey');
        }
    },

    move1: {
        name: 'Sowing Doubt',
        desc: 'Slightly drain opponent morale once per turn.',
        cost: 3,
        use: function() {
            console.log('hey');
        }

    },

    move2: {
        name: 'Stunning Remark',
        desc: 'Use all available SP to silence target.<br>Chance of effect scales with consumed SP.',
        cost: 0,
        use: function() {
            console.log('hey');
        }
    }
};


var width = 27;
var statusEffects = [
    {
        name: 'Silenced',
        desc: 'Unable to use haggle or skills',
        bg: `url(img/stati.png) 0 0 / cover`,
    },
    {
        name: 'Unmotivated',
        desc: 'Morale decreases slightly per turn',
        bg: `url(img/stati.png) -${width}px 0 / cover`,
    },
    {
        name: 'Rallying',
        desc: 'Morale increases slightly per turn',
        bg: `url(img/stati.png) ${width * 2}px 0 / cover`,
    },
    {
        name: 'Defending',
        desc: 'Takes reduced damage to morale',
        bg: `url(img/stati.png) ${width}px 0 / cover`,
    },
]

var active = snowdrop;
var turns = 5;
var test = toggle;

function toggle(mode) {
    // Mode 0: menu -> text
    // Mode 1: text -> menu

    const next = document.getElementById('next');
    const side = document.getElementById('side-text');

    next.style.transform = 'rotate(0deg)';
    next.onclick = nextHandler;

    if (!mode) {
        //next.style.display = 'block';
        side.style.display = 'none';
    } else {
        next.style.display = 'none';
        side.style.display = 'block';
    }

    return;
}

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
                document.getElementById(`effect-${i}`).remove();
            else
                document.getElementById(`turns-${i}`).innerHTML = active.effects[i];
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

function addStatusEffect(i, turns, character = active) {

    // If effect already exists, cap out and return
    if (character.effects[i]) {
        character.effects[i] = Math.max(character.effects[i], turns);
        document.getElementById(`turns-${i}`).innerHTML = character.effects[i];
        return;
    }

    character.effects[i] = turns;
    const current = statusEffects[i];

    const str = `<b>${current.name}:</b><br>${current.desc}<hr><h3>Turns left: <h3 id='turns-${i}'>${character.effects[i]}</h3></h3> `;

    const element = document.createElement('div');
    element.classList.add('tooltip');
    element.innerHTML = `<span>${str}</span>`;

    const effect = document.createElement('div');
    element.id = `effect-${i}`;
    effect.classList.add('status-effect');
    effect.style.background = current.bg;
    element.append(effect);

    document.getElementById(`${character.name}-statuseffects`).append(element);

    return;
}

function updateDmg(dmg, price, move, bonus = 0) {

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

    let str = `${active.name} used ${move}.`
    if (bonus)
        str += ` ${active.name}'s critical rate increased.`;

    str += `\n${merchant.name}'s morale received ${dmg} ${crit} damage.`

    if (priceDmg)
        str += ` The price fell by ${priceDmg} ⨷.`;

    typeText(str);

    animateDmg();

}


function haggle() {

    const textbox = document.getElementById('textbox');
    textbox.innerHTML = '';

    toggle(0);

    // Missed
    if ( Math.random() > active.acc ) {

        updateDmg(0, true, `Haggle`);
        return;
    }

    let dmg = Math.floor(active.morale * active.scale);
    const variance = randomNum(0, 5);

    dmg = (Math.random() < .5 && dmg > 15) ? dmg - variance : dmg + variance;

    updateDmg(dmg, true, `Haggle`);


    return;
}

function animateDmg() {
    const merchant = document.getElementById('merchant');
    const transformX = 20;
    const transformY = 10;

    merchant.style.filter = 'brightness(1.7)';
    merchant.style.transform = `translateX(${transformX}px) translateY(-${transformY}px)`;

    merchant.style.transitionProperty = 'all';
    merchant.style.transitionDuration = '0.5s';

    setTimeout( () => { merchant.style.filter = 'brightness(1)'; merchant.style.transform = 'translateX(0px) translateY(0px)'; }, 175);

}


function skill(poor = 3) {

    noise();

    const sideText = document.getElementById('side-text');
    const textbox = document.getElementById('textbox');
    const next = document.getElementById('next');
    next.style.display = 'block';
    next.style.transform = 'rotate(90deg)';
    next.onclick = menu;

    sideText.innerHTML = 'Mouse over a skill to see its effects.';

    textbox.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const current = active[`move${i}`];

        const skill = document.createElement('div');
        skill.classList.add('textbox-item');

        if (current.cost)
            skill.innerHTML = `${current.name} <h3>(${current.cost})</h3>`;
        else
            skill.innerHTML = `${current.name} <h3>(${active.sp})</h3>`;

        if (poor !== i)
            skill.addEventListener('mouseover', () => { sideText.innerHTML = current.desc; });
        else
            skill.addEventListener('mouseover', () => { sideText.innerHTML = `Not enough SP!`; });

        skill.addEventListener('click', () => { current.use() });

        textbox.appendChild(skill);

    }
}


function defend() {

    const pronoun = (active === snowdrop) ? 'her' : 'his';

    typeText(`${active.name} covered ${pronoun} ears.`);
    addStatusEffect(3, 1);

    return;
}

