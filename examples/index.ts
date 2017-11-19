import { info, result, end } from '../src/caseUtils';
import { getMean, getDeviation } from '../src/caseUtils/index';

info({
    name: 'Object iteration',
    description: '',
    samplesCount: 5,
});

const random = (() => {
    let seed = 15;
    return () => {
        seed = seed * 16807 % 2147483647;
        return (seed - 1) / 2147483646;
    };
})();

function randomKey() {
    const length = Math.ceil(random() * 9);
    let key = '';
    for (let i = 0; i < length; i++) {
        const code = 97 + Math.round(random() * 25);
        key += String.fromCharCode(code);
    }
    return key;
}

const object: {[key: string]: number} = {};
for (let i = 0; i < 10000; i++) {
    object[randomKey()] = Math.round(random() * 1e5);
}

const sample = [];
let i = 0;

for (let j = 0; j < 100; j++) {
    const startTime = performance.now();

    i = 0;
    for (const key in object) {
        i += object[key];
    }

    sample[j] = performance.now() - startTime;
}

console.log(i);

result({
    mean: getMean(sample),
    deviation: getDeviation(sample),
});

end();
