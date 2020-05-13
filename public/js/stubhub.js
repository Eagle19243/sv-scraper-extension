function scrapeStubhub() {
    return new Promise(async (resolve) => {
        await autoScroll();

        const listings = [];
        const title    = $('.EventName__eventName').text();
        const items = $('.RoyalTicketListPanel');

        for (const item of items) {

            const sectionEl  = $(item).find('.SectionRowSeat__sectionTitle.RoyalTicketListPanel__SectionName');
            const priceEl    = $(item).find('.PriceDisplay__price span');
            const rowEl      = $(item).find('.SectionRowSeat__row');
            const quantityEl = $(item).find('.RoyalTicketListPanel__SecondaryInfo span:nth-child(3)');

            const section  = sectionEl.text();
            const price    = Number(priceEl.text().substr(1).replace(/,/g, ''));
            const row      = rowEl.text().substr(4);

            const tmpAry = quantityEl.text().split('-');
            let quantity = 0;
            
            if (tmpAry.length > 1) {
                quantity = Number(tmpAry[tmpAry.length - 1].replace('tickets', '').trim());
            } else {
                quantity = Number(tmpAry[0].replace('tickets', '').trim());
            }

            listings.push({
                title: title,
                price: price,
                section: section,
                num: '',
                row: row,
                quantity: quantity,
                brand: 0,
                url: location.href
            });
        }

        resolve(listings);
    });
}

async function autoScroll() {
    return new Promise((resolve) => {
        let attempt = 0;

        const loop = setInterval(() => {
            const containerEl  = $('.RoyalTicketList__container');
            containerEl.scrollTop(containerEl[0].scrollHeight);
            
            attempt ++;

            if (attempt > 60) {
                clearInterval(loop);
                resolve();
            }
        }, 1000);
    });
}