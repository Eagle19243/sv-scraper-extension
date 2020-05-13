let interval = null;
let SHOULD_STOP = false;

init();

/**
 * Initialization
 */
async function init() {
    setPopup('html/popup.html');
    chrome.runtime.onMessage.addListener(handleMessage);
}

/**
 * Set extension popup
 */
function setPopup(popup) {
    chrome.browserAction.setPopup({popup: popup});
}

function handleMessage(message, sender, sendResponse) {
    if (message.action === 'START') {
        startScraping();
        interval = setInterval(startScraping, message.intervalInSeconds);
        SHOULD_STOP = false;
    } else if (message.action === 'STOP') {
        if (interval) {
            clearInterval(interval);
        }
        SHOULD_STOP = true;
    }
}

async function startScraping() {
    const events = await getEvents();
    let tabId    = null;

    for (let i = 0; i < events.length; i++){
        if (SHOULD_STOP) {
            return;
        }

        tabId          = await openURL(events[i], tabId);
        const listings = await getListings(tabId);

        if (listings) {
            await saveListings(listings, i === 0);
        }

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });
    }
}

async function getListings(tabId) {
    return new Promise((resolve) => {
        let count = 0;
        const loop = setInterval(() => {
            chrome.tabs.sendMessage(tabId, {action: 'GET_LISTINGS'}, (data) => {
                if (data) {
                    resolve(data);
                    clearInterval(loop);
                }

                if (count === MAX_ATTEMPTS) {
                    resolve(null);
                    clearInterval(loop);
                }

                count ++;
            });
        }, INTERVAL);
    });
}