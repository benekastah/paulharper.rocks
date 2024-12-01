
const START = 'START';
const STOP = 'STOP';

let intervalId = 0;

function start(message) {
    clearInterval(intervalId);

    let start = Date.now();

    const msPerHalfBeat = Math.round((60 * 1000) / (message.bpm * 2));
    let lastHalfBeat = -1;

    function onTick() {
        const now = Date.now();
        const delta = now - start;
        const halfBeat = Math.floor(delta / msPerHalfBeat)

        if (lastHalfBeat < halfBeat) {
            lastHalfBeat = halfBeat;
            self.postMessage({
                halfBeat: lastHalfBeat % (message.beats * 2),
                deadline: Date.now() + 30,
            });
        }
    };

    onTick();
    intervalId = setInterval(onTick, 1);
};

function stop() {
    clearInterval(intervalId);
}

self.onmessage = function (event) {
    switch (event.data.name) {
        case START: start(event.data); break;
        case STOP: stop(); break;
    }
};

