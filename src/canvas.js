const canvas = document.getElementsByTagName('canvas')[0];
canvas.style.width = '500px';
canvas.style.height = '500px';
canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext('2d');

document.getElementById('rules').value = 'X -> F+[[X]-X]-F[-FX]+X\nF -> FF'
resetCanvas();
draw();

function resetCanvas() {
    ctx.clearRect(0, 0, 500, 500);

    ctx.beginPath();
    ctx.rect(0, 0, 500, 500);
    ctx.stroke();
}

function getValue(id) {
    return document.getElementById(id).value;
}

function getRules() {
    return getValue('rules')
        .split('\n')
        .map(line => {
            const [from, to] = line.replace(/\s/, '').split('->');
            return {from, to};
        })
}

function draw() {
    resetCanvas();

    const axiom = getValue('axiom');
    const iterations = +getValue('iterations');
    const rules = getRules();
    const angle = (+getValue('angle')) / 180 * Math.PI;
    const x = +getValue('x');
    const y = +getValue('y');
    const randomness = document.getElementById('randomness').checked;

    const program = generateProgram(axiom, rules, iterations);
    const state = {pos: {x, y}, angle, stack: []};

    for (const cmd of program) {
        run(cmd, state, randomness);
    }
}

function generateProgram(axiom, rules, iterations) {
    let term = axiom;

    for (let i = 0; i < iterations; i++) {
        term = next(term.split(''), rules);
    }

    return term.split('');
}

function run(cmd, state, randomness) {
    const lenx = 5;
    const turn = 35 / 180 * Math.PI;

    if (cmd === 'F' || cmd === 'G') {
        let len = (randomness ? Math.max(0.5 * lenx, Math.random() * lenx) : lenx);
        const newPos = {x: state.pos.x + len * Math.cos(state.angle), y: state.pos.y + len * Math.sin(state.angle)};

        ctx.beginPath();
        ctx.moveTo(state.pos.x, state.pos.y);
        ctx.lineTo(newPos.x, newPos.y);
        ctx.stroke();

        state.pos = newPos;
    } else if (cmd === '+') {
        state.angle -= turn + (randomness ? Math.random() : 0) * 0.3;
    } else if (cmd === '-') {
        state.angle += turn + (randomness ? Math.random() : 0) * 0.3;
    } else if (cmd === '[') {
        state.stack.push({x: state.pos.x, y: state.pos.y, angle: state.angle});
    } else if (cmd === ']') {
        const rem = state.stack.pop();
        state.pos = {x: rem.x, y: rem.y};
        state.angle = rem.angle;
    }
}
