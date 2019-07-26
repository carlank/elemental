import { Cell } from './cell';
import * as Canvas from './canvas';
import { Player } from './player';

var grid = Array();
var width = 1;
var height = 1;
var clickPower = 1;
var speed = 10; // higher is slower

var player = new Player();



function prettify(num) {
    return (Math.round(num * 100) / 100); 
}



var updateGrid = function() {
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
            grid[x][y] *= 1 - suckFactor*0.9;
        }
    }

    // Visual Stuff now
    $('#log').html('');
    for (var a = 0; a < width; a++) {
        for (var b = 0; b < height; b++) {
            var strung = prettify(grid[b][a]).toString();
            $('#log').append(strung + ' ' + -prettify(grid[a][b]*suckFactor) + '/tick');
        }
        $('#log').append($('<br/>'));
    }
};



function gridOnClick(e) {
    var yo = Canvas.getCursorPosition(e);
    let power = grid[yo.row][yo.column] < 100 - clickPower ? clickPower : Math.max(100 - grid[yo.row][yo.column], 0);
     power =  Math.min(power, player.mana);// player.mana >= power ? power : player.mana; // ......doy
    grid[yo.row][yo.column] += power;
    player.mana -= power;
    
}

var initGrid = function() {
    $('#log').html('');
    for (var a = 0; a < 10; a++) {
        grid.push(Array());
        for (var b = 0; b < 10; b++) {
            grid[a].push(0);
            $('#log').append(grid[a][b] + ' ');
        }
        $('#log').append($('<br/>'));
    }
};
function init() {
    initGrid();
    Canvas.initCanvas(gridOnClick, width, height);
    $('#crafting').html('');
    $('#crafting').append('<button id="growButton">Grow</button>');
    $('#crafting').append('<button id="powerButton">ClickPower: ' + clickPower + '</button>');
    $('#growButton').click(growField);
    $('#powerButton').click(addPower);
}
function growField(){
    if(player.mana >= 100 * width && width < 10 && height < 10){
        player.mana -= 100 * width;
        width += 1;
        height+= 1;
    }
}

function addPower(){
    if (player.mana >= 10 * clickPower){
        player.mana -= 10 * clickPower;
        clickPower += 1;
    }
}

function run() {

    updateGrid();
    Canvas.updateCanvas(grid, width, height);

    $('#log').append('Mana: ' + prettify(player.mana));

    $('#powerButton').html('ClickPower: ' + clickPower);
}

init();
setInterval(run, 100);