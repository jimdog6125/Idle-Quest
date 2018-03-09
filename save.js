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

