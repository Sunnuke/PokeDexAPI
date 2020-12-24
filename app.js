// DOM Objects (Document Object Model)
const mainScreen = document.querySelector('.main-screen');
// Pokemon Name
const pokeName = document.querySelector('.poke-name');
// Poke Dex ID
const pokeId = document.querySelector('.poke-id');
// front image
const pokeFrontImage = document.querySelector('.poke-front-image');
// back image
const pokeBackImage = document.querySelector('.poke-back-image');
// Type Of Pokemon (element type; pokemon can have one or two!)
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
// Weight
const pokeWeight = document.querySelector('.poke-weight');
// Height
const pokeHeight = document.querySelector('.poke-height');
// List Of pokemon (20 at a time)
const pokeListItems = document.querySelectorAll('.list-item');
// PokeDex Previous List Button
const dexPrev = document.querySelector('.left-button');
// PokeDex Next List Button
const dexNext = document.querySelector('.right-button');
// Switch Between Normal and shiny versions
const shinySwitch = document.querySelector('.shiny');

const rightPad = document.querySelector('.right');

const leftPad = document.querySelector('.left');

const midPad = document.querySelector('.middle');

const aButton = document.querySelector('.a-button');


// Element Types / variables
const TYPES = [
    'normal', 'fighting', 'flying', 'poison', 'ground',
    'rock', 'bug', 'ghost', 'steel', 'fire', 'water',
    'grass', 'electric', 'psychic', 'ice', 'dragon',
    'dark', 'fairy'
];

var nextUrl = null;
var prevUrl = null;

var shySwitch = 0;
var pokeCurr = null;

// Functions
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function resetScreen() {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
}


    // Right PokeDex Screen
function fetchPokeList(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const { results, previous, next } = data;
        nextUrl = next;
        prevUrl = previous;
        console.log(results);
        for (var i = 0; i < pokeListItems.length; i++) {
            const pokeListItem = pokeListItems[i];
            const resultData = results[i];

            if (resultData) {
                const { name, url } = resultData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2];
                pokeListItem.textContent = id + '. ' + capitalize(name);
            } else {
                pokeListItem.textContent = '';
            }
        }
    });
}


    // Left PokeDex Screen
function fetchPokeMon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        resetScreen();
        console.log(data);

        mainScreen.classList.remove('hide');

        // Type Of Pokemon (element type)
        const datatype = data['types'];
        const dataFirstType = datatype[0];
        const dataSecondType = datatype[1];
        pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
        // If the Pokemon has A second Element type
        if (dataSecondType) {
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
        } else {
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent = '';
        }
        // Screen Color Of Element
        mainScreen.classList.add(dataFirstType['type']['name']);

        // Pokemon Details
        // Name
        pokeName.textContent = capitalize(data['name']);
        // Poke Dex ID
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
        // Weight
        pokeWeight.textContent = data['weight'] + " hg";
        // Height
        pokeHeight.textContent = data['height'] + " dm";
        // front image
        if (data['sprites']['front_default'] || data['sprites']['front_shiny']) {
            pokeFrontImage.classList.remove('hide');
            if (shySwitch == 0) {
                pokeFrontImage.src = data['sprites']['front_default'];
            } else {
                pokeFrontImage.src = data['sprites']['front_shiny'];
            }
        } else {
            pokeFrontImage.classList.add('hide');
        }
        // back image
        if (data['sprites']['back_default'] || data['sprites']['back_shiny']) {
            pokeBackImage.classList.remove('hide');
            if (shySwitch == 0) {
                pokeBackImage.src = data['sprites']['back_default'];
            } else {
                pokeBackImage.src = data['sprites']['back_shiny'];
            }
        } else {
            pokeBackImage.classList.add('hide');
        }
    });
}

function nextClick() {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }
};
function prevClick() {
    if (prevClick) {
        fetchPokeList(prevUrl);
    }
};
function listClick(e) {
    if (!e.target) {
        return;
    }
    const listItem = e.target;
    if (!listItem.textContent) {
        return;
    }
    const id = listItem.textContent.split('.')[0];
    pokeCurr = id;
    fetchPokeMon(id);
};
function switchShy(e) {
    console.log(e);
    console.log(shySwitch);
    if (shySwitch == 0) {
        shySwitch++;
        shinySwitch.classList.add('grass');
        console.log(shySwitch);
    } else {
        shySwitch--;
        shinySwitch.classList.remove('grass');
        console.log(shySwitch);
    }
    fetchPokeMon(pokeCurr);
};
function nextPoke() {
    // console.log("right!");
    if (pokeCurr != 10220) {
        pokeCurr++;
        fetchPokeMon(pokeCurr);
    }
}
function prevPoke() {
    // console.log("left!");
    if (pokeCurr != 1) {
        pokeCurr--;
        fetchPokeMon(pokeCurr);
    }
}
function dexOn() {
    console.log("!");
}


    // Events
    dexNext.addEventListener('click', nextClick);
    dexPrev.addEventListener('click', prevClick);
    for (const pokeListItem of pokeListItems) {
        pokeListItem.addEventListener('click', listClick);
    }
    shinySwitch.addEventListener('click', switchShy);
    rightPad.addEventListener('click', nextPoke);
    leftPad.addEventListener('click', prevPoke);
    // midPad.addEventListener('click', shySwitch);
    aButton.addEventListener('click', dexOn);



    // Initializing App
    fetchPokeList('https://pokeapi.co/api/v2/pokemon');