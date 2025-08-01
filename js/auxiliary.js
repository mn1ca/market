
// Animation

function typeText(str, textbox) {

    const speedDefault = 8;
    textbox.innerHTML = '';

    return new Promise((resolve) => {
        function typeLoop(i) {

            let speed = speedDefault;
            let c = str.charAt(i);

            if (c === '\n') textbox.innerHTML += '<br>';

            else if (c === `'`) c = `’`;

            // Longer pause at sentence stops
            else if (c === '.') speed = 120;

            textbox.innerHTML += c;

            // Play audio every 8th character
            if (!(i % 8)) {
                const audio = new Audio('./audio/type.mp3');
                audio.play();
            }

            if (i < str.length - 1) {
                setTimeout(() => typeLoop(i + 1), speed);
            } else {
                resolve(); // Resolve when done typing
            }
        }

        typeLoop(0);
    });
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

        // Update display count
		if ( parseInt( display.innerHTML, 10 ) !== currentCount ) {
			display.innerHTML = currentCount;
		}

		// Stop animation at final frame
		if ( frame === totalFrames ) {
			clearInterval( counter );
		}
	}, frameDuration );
};



// Utility

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// Audio

function noise() {
    const audio = new Audio('./audio/button.mp3');
    audio.volume = 0.45;
    audio.play();

    return;
}
