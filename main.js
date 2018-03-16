var kills = 0;
var coins = 0;
var choice = "";
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
    	coins = coins - cannonCost;
	    
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

function chooseMonsters(){
	document.getElementById("monsters").disabled = true;
	document.getElementById("humans").disabled = true;
	document.getElementById('sword').innerHTML = "Buy a Goblin";
	document.getElementById('magics').innerHTML = "Buy Magic";
	document.getElementById('cannon').innerHTML = "Buy a Catapult";
	document.getElementById('tower').innerHTML = "Buy a Salamander";
	document.getElementById('aMagics').innerHTML = "Buy Ancient Magic";
	
	
	var choice = "monsters"
}
function chooseHumans(){
	document.getElementById("monsters").disabled = true;
	document.getElementById("humans").disabled = true;
	document.getElementById('sword').innerHTML = "Buy a Sword";
	document.getElementById('magics').innerHTML = "Buy Magic";
	document.getElementById('cannon').innerHTML = "Buy a Cannon";
	document.getElementById('tower').innerHTML = "Buy a Tower";
	document.getElementById('aMagics').innerHTML = "Buy Ancient Magic";
	
	
	var choice = "humans";
}




function save(){
	var save = {
kills: kills,
coins: coins, 
swords: swords,
magic: magic,
cannons: cannons,
towers: towers,
aMagic: ancientMagic,

choice: choice

	};
	localStorage.setItem('save', JSON.stringify(save));
};
function load(){
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (typeof savegame.kills !== "undefined") kills = savegame.kills;
	if (typeof savegame.coins !== "undefined") coins = savegame.coins;
	if (typeof savegame.swords !== "undefined") swords = savegame.swords;
	if (typeof savegame.magic !== "undefined") magic = savegame.magic;
	if (typeof savegame.cannons !== "undefined") cannons = savegame.cannons;
	if (typeof savegame.towers !== "undefined") towers = savegame.towers;
	if (typeof savegame.aMagic !== "undefined") ancientMagic = savegame.aMagic;
	
	if (typeof savegame.choice !== "undefined") choice = savegame.choice;
	
};
