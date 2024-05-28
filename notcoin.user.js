// ==UserScript==
// @name        Notcoin Autoclicker
// @namespace   Tampermonkey Scripts
// @match       https://clicker.joincommunity.xyz/clicker*
// @version     1.0
// ==/UserScript==

const energyTriggerMin = 4;
const energyTriggerMax = 996;

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

async function delay(ms = 17) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
    'use strict';
    const { href } = location;
    if (href.includes('=web')) {
        location.href = href.replace('=web', '=ios');
        location.reload();
        return;
    }
    let button, energyElement, energy;
    function init() {
        button = document.querySelector('div[class^="_notcoin"]');
        energyElement = document.querySelector('div[class^="_scoreCurrent"]');
    }
    let restart = setTimeout(() => location.reload(), randomInteger(12e3, 24e3));
    while (!button || !energyElement) {
        await delay(1000);
        init();
    }
    clearTimeout(restart);

    let isClicking = false;
    async function click({fast = false} = {}) {
        isClicking = true;
        while (button && energy >= energyTriggerMin) {
            try {
                energy = parseInt(energyElement.textContent);
                button[Object.keys(button)[1]].onTouchStart('');
            } catch (error) {
                //
            } finally {
                await delay(randomInteger(30, fast ? 50 : 250));
            }
        }
        isClicking = false;
    }

    async function observe() {
        try {
            init();
            energy = parseInt(energyElement.textContent);
            let imrocket = document.querySelectorAll('img[class^="_root"]');
            if (imrocket?.length) {
                imrocket[0][Object.keys(imrocket[0])[1]].onClick();
                await delay(randomInteger(500, 1000));
                return click({ fast: true });
            }
            if (!isClicking && (energy >= energyTriggerMax)) {
                return click({ fast: false });
            }
        } catch (error) {
            //
        }
    }
    observe();
    setInterval(() => observe(), 2000);
    restart = setTimeout(() => location.reload(), randomInteger(30, 60) * 60e3);
})();
