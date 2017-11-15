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
for (let i = 0; i < 1000; i++) {
    object[randomKey()] = Math.round(random() * 1e5);
}
