const svg = document.getElementById('mySVG');
const container = document.querySelector('.hero');
let containerWidth, containerHeight;

function setSVGDimensions() {
    containerWidth = container.offsetWidth;
    containerHeight = container.offsetHeight;
    svg.setAttribute('width', containerWidth);
    svg.setAttribute('height', containerHeight);
}

class Node {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
    }

    draw() {
        for (const otherNode of nodes) {
            if (otherNode !== this) {
                const distance = Math.hypot(this.x - otherNode.x, this.y - otherNode.y);
                if (distance < 75) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', this.x);
                    line.setAttribute('y1', this.y);
                    line.setAttribute('x2', otherNode.x);
                    line.setAttribute('y2', otherNode.y);
                    line.setAttribute('stroke', `rgba(125, 125, 125, ${1 - (distance / 75)})`);
                    svg.appendChild(line);
                }
            }
        }

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', this.x);
        circle.setAttribute('cy', this.y);
        circle.setAttribute('r', this.radius);
        circle.setAttribute('fill', this.color);
        svg.appendChild(circle);
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > containerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > containerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }
}

const nodes = [];
let numNodes;

function calculateNumNodes() {
    return window.innerWidth <= 768 ? 13 : 26;
}

function generateNodes() {
    for (let i = 0; i < numNodes; i++) {
        const radius = 2;
        const x = Math.random() * (containerWidth - radius * 2) + radius;
        const y = Math.random() * (containerHeight - radius * 2) + radius;
        const color = `rgb(125, 125, 125)`;
        nodes.push(new Node(x, y, radius, color));
    }
}

function animate() {
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    for (const node of nodes) {
        node.draw();
        node.update();
    }

    requestAnimationFrame(animate);
}

function handleResize() {
    const currentWindowWidth = window.innerWidth;
    const currentWindowHeight = window.innerHeight;

    if (Math.abs(currentWindowWidth - lastWindowWidth) > 100 || Math.abs(currentWindowHeight - lastWindowHeight) > 100) {
        numNodes = calculateNumNodes();
        nodes.length = 0;
        generateNodes();
        lastWindowWidth = currentWindowWidth;
        lastWindowHeight = currentWindowHeight;
    }
}

let resizing = false;
let lastWindowWidth = window.innerWidth;
let lastWindowHeight = window.innerHeight;

const debounce = (func, delay) => {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

window.addEventListener('resize', debounce(() => {
    if (!resizing) {
        resizing = true;
        handleResize();
        setTimeout(() => {
            resizing = false;
        }, 400);
    }
}, 200));

window.addEventListener('resize', () => {
    setSVGDimensions();
    handleResize();
});


setSVGDimensions();
numNodes = calculateNumNodes();
generateNodes();
animate();
