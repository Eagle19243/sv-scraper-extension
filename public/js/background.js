let interval = null;

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
    } else if (message.action === 'STOP') {
        if (interval) {
            clearInterval(interval);
        }
    }
}

async function startScraping() {
    const events = await getEvents();
    let tabId    = null;

    for (let i = 0; i < events.length; i++){
        tabId          = await openURL(events[i], tabId);
        const listings = await getListings(tabId);

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });

        if (listings) {
            await saveListings(listings, i === 0);
        }
    }
}

async function getListings(tabId) {
    return new Promise((resolve) => {
        let count = 0;
        var loop = setInterval(() => {
            chrome.tabs.sendMessage(tabId, {action: 'GET_LISTINGS'}, (data) => {
                if (data) {
                    console.log('GET_LISTINGS');
                    resolve(data);
                    clearInterval(loop);
                }

                if (count === 20) {
                    resolve(null);
                    clearInterval(loop);
                }

                count ++;
            });
        }, 1000);
    });
}