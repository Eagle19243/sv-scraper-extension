function scrapeVividSeats(eventId) {
    return new Promise((resolve) => {
        $.ajax({
            url: `https://www.vividseats.com/rest/v2/web/listings/${eventId}`,
            method: 'GET',
            success: (data) => {
                const listings = [];
                const title    = $('.production-header h1 strong').text();

                for (const listing of data.tickets) {
                    const section  = listing.s;
                    const price    = Number(listing.p);
                    const row      = listing.r;
                    const quantity = Number(listing.q);

                    listings.push({
                        title: title,
                        section: section,
                        price: price,
                        row: row,
                        quantity: quantity,
                        num: '',
                        brand: 1,
                        url: location.href
                    });
                }

                resolve(listings);
            },
            error: () => {
                resolve([]);
            }
        });
    });
}