var lulu = {
    name: 'Lulu',
    morale: 536,
    price: 35,
    minPrice: 5,
    scale: 0.05,
    crit: 0.1,
    effects: [0, 0, 0, 0, 0],

    move0: {
        name: 'Burrow',
        cost: 2,
        use: function() {

            updateText(`${merchant.name} used ${this.name}.\n${merchant.name} was silenced. ${merchant.name}'s morale and defense increased.`);

            return;

        }
    },
};

var merchant = lulu;

// Move to opening battle window later

function merchantTurn() {
    toggle(0);
    animateMove();
     merchant['move0'].use();


    const next = document.getElementById('next');
    const textbox = document.getElementById('textbox');
    textbox.removeEventListener('click', nextHandler);
    textbox.removeAttribute('onclick');

    next.onclick = () => {console.log('hi');};
    textbox.onclick = () => {console.log('hey');};



    return;
}

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


function animateMove() {
    const merchant = document.getElementById('merchant');
    const transformY = 40;

    merchant.style.transform = `translateY(-${transformY}px)`;

    merchant.style.transitionProperty = 'all';
    merchant.style.transitionDuration = '0.5s';

    setTimeout( () => { merchant.style.transform = 'translateY(0px)'; }, 150);

    return;
}
