function save(){
	var save = {
    kills: kills,
    swords: swords,
    magic: magic,
		coins: coins,
		cannons: cannons,
		towers: towers,
		ancientMagic: ancientMagic

}
	localStorage.setItem("save",JSON.stringify(save));
function load(){
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (typeof savegame.kills !== "undefined")kills = savegame.kills;
	if (typeof savegame.coins !== "undefined") coins = savegame.coins;
	if (typeof savegame.swords !== "undefined") swords = savegame.swords;
	if (typeof savegame.magic !== "undefined") magic = savegame.swords;
	if (typeof savegame.cannons !== "undefined") cannons = savegame.swords;
	if (typeof savegame.towers !== "undefined") towers = savegame.towers;
	if (typeof savegame.ancientMagic !== "undefined") ancientMagic = savegame.ancientMagic;
}; kills
};
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

