
const START = 'START';
const STOP = 'STOP';

let timerId = 0;

function start(message) {
    clearTimeout(timerId);

    let start = Number(new Date());

    const msPerHalfBeat = Math.round((60 * 1000) / (message.bpm * 2));
    let lastHalfBeat = -1;

    function onTick() {
        const now = Number(new Date());
        const delta = now - start;
        const halfBeat = Math.floor(delta / msPerHalfBeat)

        if (lastHalfBeat < halfBeat) {
            lastHalfBeat = halfBeat;
            self.postMessage(lastHalfBeat % (message.beats * 2));
        }

        timerId = setTimeout(onTick, 1);
    };

    onTick();
};

function stop() {
    clearTimeout(timerId);
}

self.onmessage = function (event) {
    switch (event.data.name) {
        case START: start(event.data); break;
        case STOP: stop(); break;
    }
};

