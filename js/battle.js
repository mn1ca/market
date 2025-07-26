
var snowdrop = {
    name: 'Snowdrop',
    morale: 90,
    scale: 0.25,
    sp: 5,
    crit: 0.15,
    acc: .90,
    dodge: .05,
    effects: [0, 0, 0],

    move0: {
        name: 'Honed Voice',
        desc: 'Increases morale. Decrease accuracy and chance of being unaffected.',
        cost: 2,
        use: function() {

            const textbox = document.getElementById('textbox');
            textbox.innerHTML = '';

            if (active.sp < this.cost) {
                skill(0);
                return;
            }

            active.sp -= this.cost;
            active.morale += randomNum(10, 30);
            active.acc *= .9;
            active.dodge *= .9;

            typeText(`${active.name} used ${this.name}.\n${active.name}'s morale increased. ${active.name}'s accuracy and unaffected rate fell.`);

        }
    },

    move1: {
        name: 'Pointed Jab',
        desc: 'Sharply decrease target morale without affecting price.',
        cost: 2,
        use: function() {
            console.log('hello');
        }
    },

    move2: {
        name: 'Stunning Remark',
        desc: 'Use all SP to silence target.<br>Chance of effect scales with consumed SP.',
        cost: 0,
        use: function() {
            console.log('hey');
        }
    }
};

var snowbell = {
    name: 'Snowbell',
    morale: 200,
    scale: 0.1,
    sp: 5,
    atk: 5,
    def: 4,
    crit: 0.2,
    acc: .75,
    dodge: .02,
    effects: [0, 0, 0],
};

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
    active = (active === snowdrop) ? snowbell : snowdrop;
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
function menu() {

    noise();

    const sideText = document.getElementById('side-text');
    const textbox = document.getElementById('textbox');
    const menu = `<span class='textbox-item' onclick='haggle()'>Haggle</span>
        <span class='textbox-item' onclick='skill()'>Skill</span>
        <span class='textbox-item'>Defend</span>
        <span class='textbox-item'>Item</span>
        <span class='textbox-item'>End</span>`;

    sideText.innerHTML = 'Select a command.';
    textbox.innerHTML = menu;
    textbox.removeEventListener('click', nextHandler);
    toggle(1);

}

function price(dmg) {
    return Math.floor(Math.sqrt(dmg) + Math.abs(Math.sin(dmg) * dmg / 20));
}

function haggle() {

    const textbox = document.getElementById('textbox');
    textbox.innerHTML = '';

    toggle(0);

    // Missed
    if ( Math.random() > active.acc ) {

        let str = `${active.name} used Haggle.\nHowever, ${merchant.name} was unaffected.`;
        typeText(str);

        return;
    }

    let dmg = Math.floor(active.morale * active.scale);
    const variance = randomNum(0, 5);

    if (Math.random() < .5 && dmg > 15)
        dmg -= variance;
    else
        dmg += variance;

    // Crit
    if (Math.random < active.crit) {
        dmg = Math.floor(dmg * 1.5);
    }

    let priceDmg = price(dmg);

    merchant.morale -= dmg;


    if (merchant.morale < 0) merchant.morale = 0;
    if (merchant.price - priceDmg < merchant.minPrice) {
        priceDmg = merchant.price - merchant.minPrice;
        merchant.price = merchant.minPrice;
    } else {
        merchant.price -= priceDmg;
    }

    animateCount('morale', dmg * -1);
    animateCount('price', priceDmg * -1);


    let str = `${active.name} used Haggle.\nLulu's morale received ${dmg} damage. The price fell by ${priceDmg} ⨷.`;
    typeText(str);

    animateDmg();


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

