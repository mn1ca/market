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
        desc: 'Increases morale. Decrease accuracy and chance of being unaffected.',
        cost: 2,
        use: function() {

            if (skillStart(this.cost)) {
                skill(0);
                return;
            }

            const i = randomNum(10, 30)
            active.morale += i;
            animateCount('Snowdrop-morale', i);

            // Reduce accuracy and dodge
            active.acc *= 0.9;
            active.dodge *= 0.9;

            typeText(`${active.name} used ${this.name}.\n${active.name}'s morale increased. ${active.name}'s accuracy and unaffectedness rate fell.`);

        }
    },

    move1: {
        name: 'Pointed Jab',
        desc: 'Sharply decrease target morale without affecting price.',
        cost: 3,
        use: function() {

            if (skillStart(this.cost)) {
                skill(1);
                return;
            }

            // Missed
            if ( Math.random() > active.acc + 0.025 ) {
                updateDmg(0, false, this.name);
                return;
            }

            let dmg = Math.floor(active.morale * 0.9);
            const variance = randomNum(0, 5);

            dmg = (Math.random() < .5 && dmg > 15) ? dmg - variance : dmg + variance;
            updateDmg(dmg, false, this.name);

            return;

        }
    },

    move2: {
        name: 'Riposte',
        desc: 'An attack that increases critical damage rate.<br>It will always land.',
        cost: 3,
        use: function() {

            if (skillStart(this.cost)) {
                skill(2);
                return;
            }

            // Increase crit
            active.crit += 0.05;

            let dmg = Math.floor(active.morale * active.scale);
            const variance = randomNum(0, 5);
            dmg = (Math.random() < .5 && dmg > 15) ? dmg - variance : dmg + variance;
            const str = `${active.name}'s critical rate increased.`

            updateDmg(dmg, true, this.name, str);
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

            if (skillStart(this.cost)) {
                skill(1);
                return;
            }

            const turns = 3;

            // Missed
            if ( Math.random() > active.acc + 0.025 ) {
                updateDmg(0, false, this.name);
                return;
            }

            addStatusEffect(1, turns, merchant);
            typeText(`${active.name} used ${this.name}.\n${merchant.name} was demoralized for ${turns} turns.`);
        }

    },

    move2: {
        name: 'Stunning Remark',
        desc: 'Use all available SP to silence target.<br>Chance of effect scales with consumed SP.',
        cost: 0,
        use: function() {

            const chance = (0.02 * (active.sp + 2) ** 2) + 0.015;
            // 1: 0.195
            // 2: 0.335
            // 3: 0.515
            // 4: 0.735
            // 5: 0.995

            const turns = 3;

            const prev = active.sp;
            skillStart(active.sp);

            // Missed
            var r = Math.random();
            if (chance < r) {

                if (prev === 5) {
                    document.getElementById('side-text').style.display = 'block';
                    document.getElementById('side-text').innerHTML = `<h4>(Missing had about a 0.5% chance of happening. Damn.)</h4>`;
                }

                updateDmg(0, false, this.name);
                return;
            }



            addStatusEffect(0, turns, merchant);
            typeText(`${active.name} used ${this.name}.\n${merchant.name} was silenced for ${turns} turns.`);

        }
    }
};

var money = 20;
var active = snowdrop;


function haggle() {

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


// Calls player skill
// poor :: Changes side text to reflect not enough SP for skill
function skill(poor = 3) {

    noise();

    const sideText = document.getElementById('side-text');
    const textbox = document.getElementById('textbox');
    const next = document.getElementById('next');
    next.style.display = 'block';
    next.style.transform = 'rotate(90deg)';

    next.removeEventListener('click', nextHandler);
    next.addEventListener('click', menu);

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

// Handles cost checking and animation for skills
function skillStart(cost) {

    const textbox = document.getElementById('textbox');
    textbox.innerHTML = '';

    if (active.sp < cost) {
        return 1;
    }

    toggle(0);

    active.sp -= cost;
    animateCount(`${active.name}-sp`, -1 * cost);

    return 0;
}


function defend() {

    toggle(0);

    const pronoun = (active === snowdrop) ? 'her' : 'his';
    typeText(`${active.name} covered ${pronoun} ears.`);

    addStatusEffect(3, 1);

    return;
}
