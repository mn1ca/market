var snowdrop = {
    name: 'Snowdrop',
    morale: 90,
    scale: 0.25,
    sp: 5,
    crit: 0.15,
    acc: .90,
    dodge: .05,
    effects: [0, 0, 0],

    move1: {
        name: '',
        desc: '',
        function: function() {
            console.log('hi');
        }
    }
};

var snowbell = {
    name: 'Snowdrop',
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

    if (!mode) {
        //next.style.display = 'block';
        side.style.display = 'none';
    } else {
        next.style.display = 'none';
        side.style.display = 'block';
    }

    return;
}


function animateCount(element, change) {

    // Adapted from
    //  https://jshakespeare.com/simple-count-up-number-animation-javascript-react/
    //

    const display = document.getElementById(element);
    const original = parseInt( display.innerHTML, 10 );

    // Scale animation duration with number
    const animationDuration = 1000 * Math.sqrt(display.innerHTML.length);
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round( animationDuration / frameDuration );

    let frame = 0;

	const counter = setInterval( () => {
		frame++;

        // Progress as value between 0 and 1
		const progress = frame / totalFrames;

		// Use the progress value to calculate the current count
		const currentCount = original + Math.round( change * progress );

        // If the current count has changed, update the element
		if ( parseInt( display.innerHTML, 10 ) !== currentCount ) {
			display.innerHTML = currentCount;
		}

		// If we’ve reached our last frame, stop the animation
		if ( frame === totalFrames ) {
			clearInterval( counter );
		}
	}, frameDuration );
};


function reset() {

    noise();

    let textbox = document.getElementById('textbox');
    let menu = `<span class='textbox-item' onclick='haggle()'>Haggle</span>
        <span class='textbox-item' onclick='test(0)'>Skill</span>
        <span class='textbox-item'>Defend</span>
        <span class='textbox-item'>Item</span>
        <span class='textbox-item'>End</span>`;


    textbox.innerHTML = menu;
    toggle(1);

}

function price(dmg) {
    return Math.floor(Math.sqrt(dmg) + Math.abs(Math.sin(dmg) * dmg / 20));
}

function haggle() {
    let textbox = document.getElementById('textbox');
    textbox.innerHTML = '';

    toggle(0);

    // Missed
    if ( Math.random() > active.acc ) {

        let str = `${active.name} used Haggle.\nHowever, ${merchant.name} was unaffected.`;
        typeText(str);

        return;
    }

    let dmg = Math.floor(active.morale * active.scale);
    let variance = randomNum(0, 5);

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
    merchant.price -= priceDmg;

    if (merchant.morale < 0) merchant.morale = 0;
    if (merchant.price < merchant.minPrice) merchant.price = merchant.minPrice;

    animateCount('morale', dmg * -1);
    animateCount('price', priceDmg * -1);


    let str = `${active.name} used Haggle.\nLulu's morale received ${dmg} damage. The price fell by ${priceDmg}.`;
    typeText(str);
}




