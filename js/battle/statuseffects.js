var width = 25;
var statusEffects = [
    {
        // 0
        name: 'Silenced',
        desc: 'Unable to take any actions',
        bg: `url(img/stati.png) 0 0 / cover`,
        use: function() {
            if (active.effects[0]) {

                const plural = (active.effects[0] === 2) ? '' : 's';
                updateText(`${active.name} is silenced. ${active.effects[0] - 1} turn${plural} remaining.`);

                return 1;
            }
            return;
        },
    },
    {
        // 1
        name: 'Unmotivated',
        desc: 'Morale decreases slightly per turn',
        bg: `url(img/stati.png) -${width}px 0 / cover`,
        use: function() {
            if (active.effects[1]) {

                const plural = (active.effects[1] === 2) ? '' : 's';
                return `1${active.name} is unmotivated! They lost a little morale.\n ${active.effects[1] - 1} turn${plural} remaining.`;
            }
            return;
        },

        effect: function() {
            const dmg = randomNum(5, 10);
            active.morale -= dmg;

            const target = (active === merchant) ? '' : `${active.name}-`;
            animateCount(`${target}morale`, dmg * -1);
        },

    },
    {
        // 2
        name: 'Rallying',
        desc: 'Morale increases slightly per turn',
        bg: `url(img/stati.png) -${width * 2}px 0 / cover`,
        use: function() {
            if (active.effects[2]) {

                const plural = (active.effects[2] === 2) ? '' : 's';
                return `2${active.name} is rallying! They gained a little morale.\n ${active.effects[2] - 1} turn${plural} remaining.`;
            }
            return;
        },

        effect: function() {
            const heal = randomNum(8, 20);
            active.morale += heal;

            const target = (active === merchant) ? '' : `${active.name}-`;
            animateCount(`${target}morale`, heal);
        },
    },
    {
        // 3
        name: 'Defending',
        desc: 'Takes reduced damage to morale',
        bg: `url(img/stati.png) -${width * 3}px 0 / cover`,
    },
    {
        // 4
        name: 'Powered Up',
        desc: 'Attacks hit twice',
        bg: `url(img/stati.png) -${width * 4}px 0 / cover`,

    }
];


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


