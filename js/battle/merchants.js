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

            addStatusEffect(0, 2, merchant);
            addStatusEffect(3, 4, merchant);

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

    if (statusEffects[0].use()) return;


     merchant['move0'].use();

    /*
    const next = document.getElementById('next');
    const textbox = document.getElementById('textbox');
    textbox.removeEventListener('click', nextHandler);
    textbox.removeAttribute('onclick');
*/
    return;
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
