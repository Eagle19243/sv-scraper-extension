window.onload = () => {
    init();
}

async function init() {
    await initPopupUI();

    $('.btn-start').click(startButtonClicked);
}

async function startButtonClicked() {
    const interval          = Number($('.interval').val());
    const intervalUnit      = $('.interval-unit').val();
    const intervalInSeconds = intervalUnit === 'days' ?
                                interval * 24 * 60 * 60 * 1000 :
                                interval * 60 * 60 * 1000;
    const started = await isStarted();

    if (started) {
        chrome.runtime.sendMessage({action: 'STOP'});
    } else {
        chrome.runtime.sendMessage({
            action: 'START',
            intervalInSeconds: intervalInSeconds
        });
    }

    setScraperStatus(!started);
    refreshStartButton(!started);
}

async function initPopupUI() {
    const started = await isStarted();
   
    refreshStartButton(started);
    $('.interval-unit').selectpicker();
}

function refreshStartButton(started) {
    if (started) {
        $('.btn-start').html('Stop');
        $('.btn-start').removeClass('btn-primary').addClass('btn-danger');
    } else {
        $('.btn-start').html('Start');
        $('.btn-start').removeClass('btn-danger').addClass('btn-primary');
    }
}
