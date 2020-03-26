async function getEvents() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${URL_API}/get_events`,
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: (data) => {
                data = JSON.parse(data);

                if (data.success) {
                    resolve(data.events);
                } else {
                    reject(data.error);
                }
            },
            error: (xhr) => {
                reject(`${xhr.status}: ${xhr.responseText}`);
            }
        });
    });
}

async function saveListings(listings, shouldReset) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${URL_API}/save_listings`,
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                listings        : listings,
                should_reset    : shouldReset
            }),
            success: (data) => {
                data = JSON.parse(data);

                if (data.success) {
                    resolve(true);
                } else {
                    reject(data.error);
                }
            },
            error: (xhr) => {
                reject(`${xhr.status}: ${xhr.responseText}`);
            }
        });
    });
}