var kills = 0;
var coins = 0;
var prestige = 0;
function kill(number){
    kills = kills + number;
    coins = coins + number;
    document.getElementById("kills").innerHTML = kills;
    document.getElementById("coins").innerHTML = coins;
	
};

var swords = 0;

function buySword(){
    var swordCost = Math.floor(10 * Math.pow(1.1,swords));     //works out the cost of this cursor
    if(coins >= swordCost){                                   //checks that the player can afford the cursor
        swords = swords + 1;                                   //increases number of cursors
    	coins = coins - swordCost;                          //removes the cookies spent
        document.getElementById('swords').innerHTML = swords;  //updates the number of cursors for the user
        document.getElementById('coins').innerHTML = coins;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,swords));       //works out the cost of the next cursor
    document.getElementById('swordCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

var magic = 0;

function buyMagic(){
    var magicCost = Math.floor(100 * Math.pow(1.1,magic));     //works out the cost of this cursor
    if(coins >= magicCost){                                   //checks that the player can afford the cursor
        magic = magic + 1;                                   //increases number of cursors
    	coins = coins - magicCost;                          //removes the cookies spent
        document.getElementById('magic').innerHTML = magic;  //updates the number of cursors for the user
        document.getElementById('coins').innerHTML = coins;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(100 * Math.pow(1.1,magic));       //works out the cost of the next cursor
    document.getElementById('magicCost').innerHTML = nextCost;  //updates the cursor cost for the user
};
var cannons = 0;

function buyCannon(){
    var cannonCost = Math.floor(500 * Math.pow(1.1,cannons));     //works out the cost of this cursor
    if(coins >= cannonCost){                                   //checks that the player can afford the cursor
        cannons = cannons + 1;                                   //increases number of cursors
    	coins = coins - cannonCost;                          //removes the cookies spent
        document.getElementById('cannons').innerHTML = cannons;  //updates the number of cursors for the user
        document.getElementById('coins').innerHTML = coins;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(500 * Math.pow(1.1,cannons));       //works out the cost of the next cursor
    document.getElementById('cannonCost').innerHTML = nextCost;  //updates the cursor cost for the user
};
var towers = 0;

function buyTower(){
    var towerCost = Math.floor(5000 * Math.pow(1.1,towers));     //works out the cost of this cursor
    if(coins >= towerCost){                                   //checks that the player can afford the cursor
        towers = towers + 1;                                   //increases number of cursors
    	coins = coins - towerCost;                          //removes the cookies spent
        document.getElementById('towers').innerHTML = towers;  //updates the number of cursors for the user
        document.getElementById('coins').innerHTML = coins;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(5000 * Math.pow(1.1,towers));       //works out the cost of the next cursor
    document.getElementById('towerCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

window.setInterval(function(){
	
	kill(swords);
	
}, 2000);
window.setInterval(function(){
	
	kill(magic);

}, 1000);
window.setInterval(function(){
	
	kill(cannons);

}, 500);
window.setInterval(function(){
	
	kill(towers);

}, 100);

function save(){
var save = {
coins: coins,
kills: kills,
swords: swords,
magic: magic,
cannons: cannons,
towers: towers
}
localStorage.setItem("save",JSON.stringify(save));
}
}
function load(){
function prettify(input){
    var output = Math.round(input * 1000000)/1000000;
	return output;
}
var savegame = JSON.parse(localStorage.getItem("save"));
	if (typeof savegame.kills !== "undefined") kills = savegame.kills;
document.getElementById('kills').innerHTML = prettify(kills);
	if (typeof savegame.coins !== "undefined") coins = savegame.coins;
document.getElementById('coins').innerHTML = prettify(coins);
	if (typeof savegame.swords !== "undefined") swords = savegame.swords;
document.getElementById('swords').innerHTML = prettify(swords);
	if (typeof savegame.magic !== "undefined") magic = savegame.magic;
document.getElementById('magic').innerHTML = prettify(magic);
	if (typeof savegame.cannons !== "undefined") cannons = savegame.cannons;
document.getElementById('cannons').innerHTML = prettify(cannons);
	if (typeof savegame.towers !== "undefined") towers = savegame.towers;
document.getElementById('towers').innerHTML = prettify(towers);
}
//Autosave
  var saveVar;

 function autoSaveFunc() {
 saveVar = setInterval(save, 10000); //Autosave every 10 second

  }
  autoSaveFunc();


 //AutoLoad
  var loadVar;

function autoLoadFunc() {
 loadVar = setTimeout(load, 1000); //autoload

}
autoLoadFunc();

var lastUpdate = Date.now()
setInterval(function() {
    let currentUpdate = Date.now()
    let delta = (currentUpdate - lastUpdate) / 1000 //divided by 1000 because Date.now() is in milliseconds
    currency += resourcesGainedPerSecond * delta

   lastUpdate = currentUpdate
}, 100)
function preventZoom(e) {
  var t2 = e.timeStamp;
  var t1 = e.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = e.touches.length;
  e.currentTarget.dataset.lastTouch = t2;

  if (!dt || dt > 500 || fingers > 1) return; // not double-tap

  e.preventDefault();
  e.target.click();
}
