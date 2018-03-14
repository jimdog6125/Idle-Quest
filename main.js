var kills = 0;
var coins = 0;
var stuffPs = 0;
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
    	coins = coins - swordCost;
	stuffPs = stuffPs + 0.5;
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
    	coins = coins - magicCost;
	    stuffPs = stuffPs + 1;
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
        cannons = cannons + 2;                                   //increases number of cursors
    	coins = coins - cannonCost;
	    stuffPs = stuffPs + 2;//removes the cookies spent
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
    	coins = coins - towerCost;    
	   stuffPs = stuffPs + 4;
        document.getElementById('towers').innerHTML = towers;  //updates the number of cursors for the user
        document.getElementById('coins').innerHTML = coins;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(5000 * Math.pow(1.1,towers));       //works out the cost of the next cursor
    document.getElementById('towerCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

var ancientMagic = 0;

function buyAMagic(){
    var aMagicCost = Math.floor(15000 * Math.pow(1.1,ancientMagic));     //works out the cost of this cursor
    if(coins >= aMagicCost){                                   //checks that the player can afford the cursor
        ancientMagic = ancientMagic + 1;                                   //increases number of cursors
    	coins = coins - aMagicCost;    
	    stuffPs = stuffPs + 10;
        document.getElementById('ancientMagic').innerHTML = ancientMagic;  //updates the number of cursors for the user
        document.getElementById('coins').innerHTML = coins;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(15000 * Math.pow(1.1,ancientMagic));       //works out the cost of the next cursor
    document.getElementById('aMagicCost').innerHTML = nextCost;  //updates the cursor cost for the user
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

}, 250);
window.setInterval(function(){
	
	kill(ancientMagic);

}, 100);
function prettify(input){
    var output = Math.round(input * 1000000)/1000000;
	return output;
}


var lastUpdate = Date.now()
setInterval(function() {
    let currentUpdate = Date.now()
    let delta = (currentUpdate - lastUpdate) / 1000 //divided by 1000 because Date.now() is in milliseconds
    coins += stuffPs * delta
document.getElementById('coins').innerHTML = prettify(coins);
   lastUpdate = currentUpdate
}, 100)
function save(){
var game = {
kills: kills,
coins: coins, 
swords: swords,
magic: magic,
cannons: cannons,
towers: towers,
aMagic: ancientMagic,
stuffPs: stuffPs
}
localStorage.setItem('saveName', game)
};
function load(){
var save = localstorage.getItem('saveName')
if (save) game = save
};
