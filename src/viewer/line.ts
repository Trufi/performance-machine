import * as d3 from 'd3';

const data = [
    {a: 1, b: 2},
    {a: 2, b: 1},
    {a: 3, b: 3},
    {a: 1, b: 2},
    {a: 2, b: 1},
    {a: 1, b: 4},
    {a: 3, b: 2},
    {a: 1, b: 3},
];

const width = 500;
const height = 200;

const margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50,
};

const svg: d3.Selection<SVGGElement, any, HTMLElement, any> = d3.select('body').append<SVGElement>('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom)
    .append<SVGGElement>('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleLinear()
    .domain([0, 8])
    .range([0, width]);

const y = d3.scaleLinear()
    .domain([5, 0])
    .range([0, height]);

const dataA = data.map((d, i) => [i, d.a]);
// const dataB = data.map((d, i) => [i, d.b]);

const line = d3.line<number[]>()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

svg.append('path')
    .datum(dataA)
    .attr('fill', 'none')
    .attr('stroke', '#8b4513')
    .attr('stroke-width', 1.5)
    .attr('d', line);

// svg.append('path')
//     .datum(dataB)
//     .attr('fill', 'none')
//     .attr('stroke', '#8a2be2')
//     .attr('stroke-width', 1.5)
//     .attr('d', line);

const axisBottom = d3.axisBottom(x);

svg
    .append<SVGGElement>('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom);
svg
    .append<SVGGElement>('g')
    .call(d3.axisLeft(y));

const mouseGroup = svg.append<SVGGElement>('g');

const circleGroup = mouseGroup.append<SVGGElement>('g');

circleGroup.append<SVGCircleElement>('circle')
    .attr('r', 3)
    .attr('fill', '#8b4513');

const text = circleGroup.append<SVGTextElement>('text')
    .attr('transform', 'translate(10, 5)');

const mouseArea = mouseGroup
    .append<SVGRectElement>('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all');

mouseArea.on('mousemove', function() {
    const point = d3.mouse(this);
    const pointX = x.invert(point[0]);

    let closest = dataA[0];
    let closestDistance = Infinity;

    dataA.forEach((el) => {
        const distance = Math.abs(el[0] - pointX);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = el;
        }
    });

    circleGroup.attr('transform', `translate(${x(closest[0])}, ${y(closest[1])})`);
    text.text(closest[1]);
});
