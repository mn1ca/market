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
    const display = document.createElement('div');
    display.id = 'merchant';
    display.style.position = 'absolute';
    document.getElementById('display').append(display);


    document.getElementById('name').innerHTML = merchant.name;
    document.getElementById('morale').innerHTML = merchant.morale;
    document.getElementById('price').innerHTML = merchant.price;

    document.getElementById('snowdrop-morale').innerHTML = snowdrop.morale;
    document.getElementById('snowdrop-sp').innerHTML = snowdrop.sp;

    document.getElementById('snowbell-morale').innerHTML = snowbell.morale;
    document.getElementById('snowbell-sp').innerHTML = snowbell.sp;

    let i = 1;
    merchant['move' + i]();
});
