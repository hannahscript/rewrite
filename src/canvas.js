const canvas = document.createElement('canvas');
canvas.style.width = '500px';
canvas.style.height = '500px';
canvas.width = 500;
canvas.height = 500;
document.getElementsByTagName('body')[0].appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.rect(0, 0, 500, 500);
ctx.stroke();

const program = generateProgram();
const state = {pos: {x: 250, y: 500}, angle: Math.PI * 1.5, stack: []};
console.log('Program', program.join(''));
for (const cmd of program) {
    run(cmd, state);
}

function generateProgram() {
    let term = 'X';
    const rules = [
        {from: 'X', to: 'F+[[X]-X]-F[-FX]+X'},
        {from: 'F', to: 'FF'},
    ];
    const iterations = 6;

    for (let i = 0; i < iterations; i++) {
        term = next(term.split(''), rules);
    }

    return term.split('');
}

function run(cmd, state) {
    const len = 3;
    const turn = 25 / 180 * Math.PI;

    if (cmd === 'F' || cmd === 'G') {
        const newPos = {x: state.pos.x + len * Math.cos(state.angle), y: state.pos.y + len * Math.sin(state.angle)};
        //console.log(state.pos, newPos)
        ctx.beginPath();
        ctx.moveTo(state.pos.x, state.pos.y);
        ctx.lineTo(newPos.x, newPos.y);
        ctx.stroke();

        state.pos = newPos;
    } else if (cmd === '+') {
        state.angle -= turn;
    } else if (cmd === '-') {
        state.angle += turn;
    } else if (cmd === '[') {
        state.stack.push({x: state.pos.x, y: state.pos.y, angle: state.angle});
    } else if (cmd === ']') {
        const rem = state.stack.pop();
        state.pos = {x: rem.x, y: rem.y};
        state.angle = rem.angle;
    }
}
