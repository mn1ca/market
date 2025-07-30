var lulu = {
    name: 'Lulu',
    morale: 536,
    price: 35,
    minPrice: 5,
    scale: 0.05,
    crit: 0.1,

    move1: function() {
        console.log('move');
    },
};

var merchant = lulu;

// Move to opening battle window later

document.addEventListener('DOMContentLoaded', function() {
    menu(0);

    renderDisplay('stand');
    renderDisplay('merchant');

    renderStats(snowdrop);
    renderStats(snowbell);

    document.getElementById('name').innerHTML = merchant.name;
    document.getElementById('morale').innerHTML = merchant.morale;
    document.getElementById('price').innerHTML = merchant.price;



    let i = 1;
    merchant['move' + i]();
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
    statusEffects.classList.add('status-effects');
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
