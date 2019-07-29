import { Cell } from './cell';
var canvas: any = document.getElementById('c');
var context = canvas.getContext('2d');

export function getCursorPosition(e) {
    var x;
    var y;
    if (e.clientX !== undefined && e.clientY !== undefined) {
        x = e.clientX;
        y = e.clientY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    var res = new Cell(Math.floor(x / 20),
        Math.floor(y / 20));
    return res;
}

export function initCanvas(callback: Function, WIDTH, HEIGHT): void {
    for (var x = 20.5; x < 20 * WIDTH; x += 20) {
        context.moveTo(x, 0);
        context.lineTo(x, 20 * HEIGHT);
    }
    for (var y = 20.5; y < 20 * HEIGHT; y += 20) {
        context.moveTo(0, y);
        context.lineTo(20 * HEIGHT, y);
    }
    context.strokeStyle = "#000";
    context.stroke();

    canvas.addEventListener("click", callback, false);

};

function fillCell(ce, clr) {
    context.fillStyle = clr;
    context.fillRect(ce.row * 20, ce.column * 20, 20, 20);
}

export function updateCanvas(grid, WIDTH, HEIGHT) {
    for (var x = 0; x < WIDTH; x++) {
        for (var y = 0; y < HEIGHT; y++) {
            var cur = new Cell(x, y);
            var rounded = Math.round(grid[x][y]);
            var hue = rounded % 360;
            var sat = (50 + Math.floor(rounded / 10)) % 500;
            var lightness = 50;
            // console.log(hue + ' ' + sat + ' ' + lightness);
            var clr = 'hsl(' + hue.toString() + ',' + sat.toString() + '%,' + lightness.toString() + '%)';
            fillCell(cur, clr);
        }
    }
};
