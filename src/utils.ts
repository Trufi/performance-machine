export function getMean(sample: number[]): number {
    let mean = sample[0];

    for (let i = 1; i < sample.length; i++) {
        mean += sample[i];
    }

    mean /= sample.length;

    return mean;
}

export function getDeviation(sample: number[]): number {
    const mean = getMean(sample);
    let dispersion = 0;

    for (let i = 0; i < sample.length; i++) {
        dispersion += Math.pow(sample[i] - mean, 2);
    }

    return dispersion / sample.length;
}
