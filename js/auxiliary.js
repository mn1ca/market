function typeText(str, i = 0) {

    let speed = 8;
    const textbox = document.getElementById('textbox');

    let c = str.charAt(i);

    // Parse line breaks
    if (c === '\n') {
        textbox.innerHTML += '<br>';

    // Longer pause after sentence
    } else if (c === '.') {
        speed = 120;
    }

    textbox.innerHTML += str.charAt(i);

    // Play audio every 8th character
    const audio = new Audio('./audio/type.mp3');
    if (!(i % 8)) audio.play();

    if (i < str.length) {

        setTimeout(() => ( typeText(str, i + 1) ), speed);
    } else {
        let next = document.getElementById('next');
        next.style.display = 'block';
    }

    return;
}


function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function noise() {
    const audio = new Audio('./audio/button.mp3');
    audio.volume = 0.45;
    audio.play();

    return;
}
