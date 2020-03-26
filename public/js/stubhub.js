function scrapeStubhub(eventId) {
    return new Promise((resolve) => {
        $.ajax({
            url: 'https://www.stubhub.com/bfx/api/search/inventory/v2/listings',
            method: 'GET',
            data: {
                'additionalPricingInfo' : true,
                'allSectionZoneStats'   : true,
                'allSectionZoneStats'   : true,
                'eventLevelStats'       : true,
                'eventPricingSummary'   : true,
                'eventPricingSummary'   : true,
                'pricingSummary'        : true,
                'quantitySummary'       : true,
                'sectionStats'          : true, 
                'shstore'               : 1,
                'start'                 : 0,
                'urgencyMessaging'      : true,
                'valuePercentage'       : true,
                'zoneStats'             : true,
                'scoreVersion'          : 'v2',
                'eventId'               : eventId,
                'rows'                  : 200,
                'sort'                  : 'price asc, value desc',
                'priceType'             : 'nonBundledPrice'
            },
            success: (data) => {
                const listings = [];
                const title    = $('.EventName__eventName').text();

                for (const listing of data.listing) {
                    const section = listing.sectionName;
                    const price = listing.price.amount;
                    const seatNums = [];
                    let row = '';

                    for (const seat of listing.seats) {
                        row = seat.row;
                        if (seat.seatNumber && Number.isInteger(seat.seatNumber)) {
                            seatNums.push(seat.seatNumber);
                        }
                    }

                    listings.push({
                        title: title,
                        price: price,
                        section: section,
                        num: seatNums.join(', '),
                        row: row,
                        quantity: listing.seats.length,
                        brand: 0,
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