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


// Element Types / variables
const TYPES = [
    'normal', 'fighting', 'flying', 'poison', 'ground',
    'rock', 'bug', 'ghost', 'steel', 'fire', 'water',
    'grass', 'electric', 'psychic', 'ice', 'dragon',
    'dark', 'fairy'
];

var nextUrl = null;
var prevUrl = null;

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

        mainScreen.classList

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
        pokeWeight.textContent = data['weight'];
        // Height
        pokeHeight.textContent = data['height'];
        // front image
        pokeFrontImage.src = data['sprites']['front_default'] || '';
        // back image
        if (data['sprites']['back_default']) {
            pokeBackImage.classList.remove('hide');
            pokeBackImage.src = data['sprites']['back_default'];
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
    fetchPokeMon(id);
}


    // Events
    dexNext.addEventListener('click', nextClick);
    dexPrev.addEventListener('click', prevClick);
    for (const pokeListItem of pokeListItems) {
        pokeListItem.addEventListener('click', listClick)
    }



    // Initializing App
    fetchPokeList('https://pokeapi.co/api/v2/pokemon');