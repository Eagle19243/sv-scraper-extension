let svListings = null;
window.onload = async function() {
    chrome.runtime.onMessage.addListener(handleMessage);

    await new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 10000);
    });
    
    if (isStubhub() && getStubhubEventId()) {
        svListings = await scrapeStubhub();
    } else if (isVividSeats() && getVividSeatsEventId()) {
        svListings = await scrapeVividSeats(getVividSeatsEventId());
    }
}

/**
 * Event listener to handle message
 */
async function handleMessage(message, sender, sendResponse) {
    if (message.action === 'GET_LISTINGS') {
        sendResponse(svListings);
    }
}

function isStubhub() {
    const reg = /https:\/\/www.stubhub.com\//g;
    return reg.test(location.href);
}

function isVividSeats() {
    const reg = /https:\/\/www.vividseats.com\//g;
    return reg.test(location.href);
}

function getStubhubEventId() {
    const reg = /\/(\d+)\//g;
    const matches = reg.exec(location.href);

    if (matches) {
        return matches[1];
    }

    return null;
}

function getVividSeatsEventId() {
    const reg = /-(\d+).html/g;
    const matches = reg.exec(location.href);

    if (matches) {
        return matches[1];
    }

    return null;
}