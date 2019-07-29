(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    class Cell {
        constructor(row, column) {
            this.row = row;
            this.column = column;
        }
    }
    //# sourceMappingURL=cell.js.map

    var canvas = document.getElementById('c');
    var context = canvas.getContext('2d');
    function getCursorPosition(e) {
        var x;
        var y;
        if (e.clientX !== undefined && e.clientY !== undefined) {
            x = e.clientX;
            y = e.clientY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        var res = new Cell(Math.floor(x / 20), Math.floor(y / 20));
        return res;
    }
    function initCanvas(callback, WIDTH, HEIGHT) {
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
    }
    function fillCell(ce, clr) {
        context.fillStyle = clr;
        context.fillRect(ce.row * 20, ce.column * 20, 20, 20);
    }
    function updateCanvas(grid, WIDTH, HEIGHT) {
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
    }
    //# sourceMappingURL=canvas.js.map

    class Player {
        constructor() {
            this.mana = 100;
            this.fireMana = 0;
            this.waterMana = 0;
            this.airMana = 0;
            this.earthMana = 0;
        }
    }
    //# sourceMappingURL=player.js.map

    var grid = Array();
    var width = 1;
    var height = 1;
    var clickPower = 1;
    var speed = 10; // higher is slower
    const cellMax = 1000;
    const maxSize = 20;
    var player = new Player();
    function prettify(num) {
        return (Math.round(num * 100) / 100);
    }
    var updateGrid = function () {
        // 'Flow' from high to low density
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var variance = Math.random() / speed;
                if (x > 0) {
                    if (grid[x - 1][y] * 1.1 < grid[x][y]) {
                        grid[x - 1][y] += variance * (grid[x][y] - grid[x - 1][y]);
                        grid[x][y] -= variance * (grid[x][y] - grid[x - 1][y]);
                    }
                }
                if (x < width - 1) {
                    if (grid[x + 1][y] * 1.1 < grid[x][y]) {
                        grid[x + 1][y] += variance * (grid[x][y] - grid[x + 1][y]);
                        grid[x][y] -= variance * (grid[x][y] - grid[x + 1][y]);
                    }
                }
                if (y > 0) {
                    if (grid[x][y - 1] * 1.1 < grid[x][y]) {
                        grid[x][y - 1] += variance * (grid[x][y] - grid[x][y - 1]);
                        grid[x][y] -= variance * (grid[x][y] - grid[x][y - 1]);
                    }
                }
                if (y < height - 1) {
                    if (grid[x][y + 1] * 1.1 < grid[x][y]) {
                        grid[x][y + 1] += variance * (grid[x][y] - grid[x][y + 1]);
                        grid[x][y] -= variance * (grid[x][y] - grid[x][y + 1]);
                    }
                }
            }
        }
        const suckFactor = 1e-2;
        // suckFactor% gets added to Player Mana, 90% of that is taken from Cell
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                player.mana += grid[x][y] * suckFactor;
                grid[x][y] *= 1 - suckFactor * 0.9;
            }
        }
        // Visual Stuff now
        $('#log').html('');
        for (var a = 0; a < width; a++) {
            for (var b = 0; b < height; b++) {
                var strung = prettify(grid[b][a]).toString();
                $('#log').append(strung + ' ' + -prettify(grid[a][b] * suckFactor) + '/tick');
            }
            $('#log').append($('<br/>'));
        }
    };
    function gridOnClick(e) {
        var yo = getCursorPosition(e);
        if (yo.row < width && yo.column < height && yo.row >= 0 && yo.column >= 0) {
            let power = grid[yo.row][yo.column] < cellMax - clickPower ? clickPower : Math.max(cellMax - grid[yo.row][yo.column], 0);
            power = Math.min(power, player.mana); // player.mana >= power ? power : player.mana; // ......doy
            grid[yo.row][yo.column] += power;
            player.mana -= power;
        }
    }
    var initGrid = function () {
        $('#log').html('');
        for (var a = 0; a < maxSize; a++) {
            grid.push(Array());
            for (var b = 0; b < maxSize; b++) {
                grid[a].push(0);
                $('#log').append(grid[a][b] + ' ');
            }
            $('#log').append($('<br/>'));
        }
    };
    function init() {
        initGrid();
        initCanvas(gridOnClick, width, height);
        $('#crafting').append('<button id="growButton">Grow</button>');
        $('#crafting').append('<button id="powerButton">ClickPower: ' + clickPower + '</button>');
        $('#growButton').click(growField);
        $('#powerButton').click(addPower);
    }
    function growField() {
        if (player.mana >= 100 * width && width < maxSize && height < maxSize) {
            player.mana -= 100 * width;
            width += 1;
            height += 1;
        }
    }
    function addPower() {
        if (player.mana >= 10 * clickPower) {
            player.mana -= 10 * clickPower;
            clickPower += 1;
        }
    }
    function run() {
        updateGrid();
        updateCanvas(grid, width, height);
        $('#log').append('Mana: ' + prettify(player.mana));
        // $('#powerButton').html('ClickPower: ' + clickPower);
    }
    init();
    setInterval(run, 100);

}));
