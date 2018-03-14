//taken from cookie clicker and shaved down for requirements.
Game.HCfactor=3;
		Game.HowMuchPrestige=function(cookies)//how much prestige [cookies] should land you
		{
			return Math.pow(cookies/1000000000000,1/Game.HCfactor);
		}
		Game.HowManyCookiesReset=function(chips)//how many cookies [chips] are worth
		{
			//this must be the inverse of the above function (ie. if cookies=chips^2, chips=cookies^(1/2) )
			return Math.pow(chips,Game.HCfactor)*1000000000000;
		}
		Game.gainedPrestige=0;
		Game.EarnHeavenlyChips=function(cookiesForfeited)
		{
			//recalculate prestige and chips owned
			var prestige=Math.floor(Game.HowMuchPrestige(Game.cookiesReset+cookiesForfeited));
			if (prestige>Game.prestige)//did we gain prestige levels?
			{
				var prestigeDifference=prestige-Game.prestige;
				Game.gainedPrestige=prestigeDifference;
				Game.heavenlyChips+=prestigeDifference;
				Game.prestige=prestige;
				if (Game.prefs.popups) Game.Popup('You gain '+Beautify(prestigeDifference)+' prestige level'+(prestigeDifference==1?'':'s')+'!');
				else Game.Notify('You forfeit your '+Beautify(cookiesForfeited)+' cookies.','You gain <b>'+Beautify(prestigeDifference)+'</b> prestige level'+(prestigeDifference==1?'':'s')+'!',[19,7]);
			}
		}
		
		Game.GetHeavenlyMultiplier=function()
		{
			var heavenlyMult=0;
			if (Game.Has('Heavenly chip secret')) heavenlyMult+=0.05;
			if (Game.Has('Heavenly cookie stand')) heavenlyMult+=0.20;
			if (Game.Has('Heavenly bakery')) heavenlyMult+=0.25;
			if (Game.Has('Heavenly confectionery')) heavenlyMult+=0.25;
			if (Game.Has('Heavenly key')) heavenlyMult+=0.25;
			if (Game.hasAura('Dragon God')) heavenlyMult*=1.05;
			if (Game.Has('Lucky digit')) heavenlyMult*=1.01;
			if (Game.Has('Lucky number')) heavenlyMult*=1.01;
			if (Game.Has('Lucky payout')) heavenlyMult*=1.01;
			if (Game.hasGod)
			{
				var godLvl=Game.hasGod('creation');
				if (godLvl==1) heavenlyMult*=0.7;
				else if (godLvl==2) heavenlyMult*=0.8;
				else if (godLvl==3) heavenlyMult*=0.9;
			}
			return heavenlyMult;
		}
		
		Game.ascensionModes={
		0:{name:'None',desc:'No special modifiers.',icon:[10,0]},
		1:{name:'Born again',desc:'This run will behave as if you\'d just started the game from scratch. Prestige levels and heavenly upgrades will have no effect, as will sugar lumps and building levels.<div class="line"></div>Some achievements are only available in this mode.',icon:[2,7]}/*,
		2:{name:'Trigger finger',desc:'In this run, scrolling your mouse wheel on the cookie counts as clicking it. Some upgrades introduce new clicking behaviors.<br>No clicking achievements may be obtained in this mode.<div class="line"></div>Reaching 1 quadrillion cookies in this mode unlocks a special heavenly upgrade.',icon:[12,0]}*/
		};
		
		Game.ascendMeterPercent=0;
		Game.ascendMeterPercentT=0;
		Game.ascendMeterLevel=100000000000000000000000000000;
		
		Game.nextAscensionMode=0;
		Game.UpdateAscensionModePrompt=function()
		{
			var icon=Game.ascensionModes[Game.nextAscensionMode].icon;
			var name=Game.ascensionModes[Game.nextAscensionMode].name;
			l('ascendModeButton').innerHTML=
			'<div class="crate noFrame enabled" '+Game.clickStr+'="Game.PickAscensionMode();" '+Game.getTooltip(
				'<div style="min-width:200px;text-align:center;font-size:11px;">Challenge mode for the next run :<br><b>'+name+'</b><div class="line"></div>Challenge modes apply special modifiers to your next ascension.<br>Click to change.</div>'
			,'bottom-right')+' style="opacity:1;float:none;display:block;background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;"></div>';
		}
		Game.PickAscensionMode=function()
		{
			PlaySound('snd/tick.mp3');
			Game.tooltip.hide();
			
			var str='';
			for (var i in Game.ascensionModes)
			{
				var icon=Game.ascensionModes[i].icon;
				str+='<div class="crate enabled'+(i==Game.nextAscensionMode?' highlighted':'')+'" id="challengeModeSelector'+i+'" style="opacity:1;float:none;display:inline-block;background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;" '+Game.clickStr+'="Game.nextAscensionMode='+i+';Game.PickAscensionMode();PlaySound(\'snd/tick.mp3\');Game.choiceSelectorOn=-1;" onMouseOut="l(\'challengeSelectedName\').innerHTML=Game.ascensionModes[Game.nextAscensionMode].name;l(\'challengeSelectedDesc\').innerHTML=Game.ascensionModes[Game.nextAscensionMode].desc;" onMouseOver="l(\'challengeSelectedName\').innerHTML=Game.ascensionModes['+i+'].name;l(\'challengeSelectedDesc\').innerHTML=Game.ascensionModes['+i+'].desc;"'+
				'></div>';
			}
			Game.Prompt('<h3>Select a challenge mode</h3>'+
						'<div class="line"></div><div class="crateBox">'+str+'</div><h4 id="challengeSelectedName">'+Game.ascensionModes[Game.nextAscensionMode].name+'</h4><div class="line"></div><div id="challengeSelectedDesc" style="min-height:128px;">'+Game.ascensionModes[Game.nextAscensionMode].desc+'</div><div class="line"></div>'
						,[['Confirm','Game.UpdateAscensionModePrompt();Game.ClosePrompt();']],0,'widePrompt');
		}
		
		Game.UpdateLegacyPrompt=function()
		{
			if (!l('legacyPromptData')) return 0;
			var date=new Date();
			date.setTime(Date.now()-Game.startDate);
			var timeInSeconds=date.getTime()/1000;
			var startDate=Game.sayTime(timeInSeconds*Game.fps,-1);
			
			var ascendNowToGet=Math.floor(Game.HowMuchPrestige(Game.cookiesReset+Game.cookiesEarned)-Game.HowMuchPrestige(Game.cookiesReset));
			var cookiesToNext=Math.floor(Game.HowManyCookiesReset(Game.HowMuchPrestige(Game.cookiesReset+Game.cookiesEarned)+1)-Game.cookiesReset-Game.cookiesEarned);
			l('legacyPromptData').innerHTML=''+
				'<div class="icon" style="pointer-event:none;transform:scale(2);opacity:0.25;position:absolute;right:-8px;bottom:-8px;background-position:'+(-19*48)+'px '+(-7*48)+'px;"></div>'+
				'<div class="listing"><b>Run duration :</b> '+(startDate==''?'tiny':(startDate))+'</div>'+
				//'<div class="listing">Earned : '+Beautify(Game.cookiesEarned)+', Reset : '+Beautify(Game.cookiesReset)+'</div>'+
				'<div class="listing"><b>Prestige level :</b> '+Beautify(Game.prestige)+'</div>'+
				'<div class="listing"><b>Heavenly chips :</b> '+Beautify(Game.heavenlyChips)+'</div>'+
				(ascendNowToGet>=1?('<div class="listing"><b>Ascending now will produce :</b> '+Beautify(ascendNowToGet)+' heavenly chip'+((ascendNowToGet)==1?'':'s')+'</div>'):
				('<div class="listing warning"><b>'+Beautify(cookiesToNext)+'</b> more cookie'+((cookiesToNext)==1?'':'s')+' for the next prestige level.<br>You may ascend now, but will gain no benefits.</div>'))+
			'';
			if (1 || ascendNowToGet>=1) l('promptOption0').style.display='inline-block'; else l('promptOption0').style.display='none';
		}
		
		l('ascendOverlay').innerHTML=
			'<div id="ascendBox">'+
			'<div class="ascendData smallFramed prompt" '+Game.getTooltip(
							'<div style="min-width:200px;text-align:center;font-size:11px;">Each prestige level grants you a permanent +1% CpS.<br>The more levels you have, the more cookies they require.</div>'
							,'bottom-right')+' style="margin-top:8px;"><h3 id="ascendPrestige"></h3></div>'+
			'<div class="ascendData smallFramed prompt" '+Game.getTooltip(
							'<div style="min-width:200px;text-align:center;font-size:11px;">Heavenly chips are used to buy heavenly upgrades.<br>You gain 1 chip every time you gain a prestige level.</div>'
							,'bottom-right')+'><h3 id="ascendHCs"></h3></div>'+
			'<a id="ascendButton" class="option framed large red" '+Game.getTooltip(
							'<div style="min-width:200px;text-align:center;font-size:11px;">Click this once you\'ve bought<br>everything you need!</div>'
							,'bottom-right')+' style="font-size:16px;margin-top:0px;"><span class="fancyText" style="font-size:20px;">Reincarnate</span></a>'+
			'<div id="ascendModeButton" style="position:absolute;right:34px;bottom:25px;display:none;"></div>'+
			'<input type="text" style="display:block;" id="upgradePositions"/></div>'+
			
			'<div id="ascendInfo"><div class="ascendData smallFramed" style="margin-top:22px;width:40%;font-size:11px;">You are ascending.<br>Drag the screen around<br>or use arrow keys!<br>When you\'re ready,<br>click Reincarnate.</div></div>';
		
		Game.UpdateAscensionModePrompt();
		
		AddEvent(l('ascendButton'),'click',function(){
			PlaySound('snd/tick.mp3');
			Game.Reincarnate();
		});
		
		Game.ascendl=l('ascend');
		Game.ascendContentl=l('ascendContent');
		Game.ascendZoomablel=l('ascendZoomable');
		Game.ascendUpgradesl=l('ascendUpgrades');
		Game.OnAscend=0;
		Game.AscendTimer=0;//how far we are into the ascend animation
		Game.AscendDuration=Game.fps*5;//how long the ascend animation is
		Game.AscendBreakpoint=Game.AscendDuration*0.5;//at which point the cookie explodes during the ascend animation
		Game.UpdateAscendIntro=function()
		{
			if (Game.AscendTimer==1) PlaySound('snd/charging.mp3');
			if (Game.AscendTimer==Math.floor(Game.AscendBreakpoint)) PlaySound('snd/thud.mp3');
			Game.AscendTimer++;
			if (Game.AscendTimer>Game.AscendDuration)//end animation and launch ascend screen
			{
				PlaySound('snd/cymbalRev.mp3',0.5);
				PlaySound('snd/choir.mp3');
				Game.EarnHeavenlyChips(Game.cookiesEarned);
				Game.AscendTimer=0;
				Game.OnAscend=1;Game.removeClass('ascendIntro');
				Game.addClass('ascending');
				Game.BuildAscendTree();
				Game.heavenlyChipsDisplayed=Game.heavenlyChips;
				Game.nextAscensionMode=0;
				Game.ascensionMode=0;
				Game.UpdateAscensionModePrompt();
			}
		}
		Game.ReincarnateTimer=0;//how far we are into the reincarnation animation
		Game.ReincarnateDuration=Game.fps*1;//how long the reincarnation animation is
		Game.UpdateReincarnateIntro=function()
		{
			if (Game.ReincarnateTimer==1) PlaySound('snd/pop'+Math.floor(Math.random()*3+1)+'.mp3',0.75);
			Game.ReincarnateTimer++;
			if (Game.ReincarnateTimer>Game.ReincarnateDuration)//end animation and launch regular game
			{
				Game.ReincarnateTimer=0;
				Game.removeClass('reincarnating');
			}
		}
		Game.Reincarnate=function(bypass)
		{
			if (!bypass) Game.Prompt('<h3>Reincarnate</h3><div class="block">Are you ready to return to the mortal world?</div>',[['Yes','Game.ClosePrompt();Game.Reincarnate(1);'],'No']);
			else
			{
				Game.ascendUpgradesl.innerHTML='';
				Game.ascensionMode=Game.nextAscensionMode;
				Game.nextAscensionMode=0;
				Game.Reset();
				if (Game.HasAchiev('Rebirth'))
				{
					if (Game.prefs.popups) Game.Popup('Reincarnated');
					else Game.Notify('Reincarnated','Hello, cookies!',[10,0],4);
				}
				if (Game.resets>=1000) Game.Win('Endless cycle');
				if (Game.resets>=100) Game.Win('Reincarnation');
				if (Game.resets>=10) Game.Win('Resurrection');
				if (Game.resets>=1) Game.Win('Rebirth');
				Game.removeClass('ascending');
				Game.OnAscend=0;
				//trigger the reincarnate animation
				Game.ReincarnateTimer=1;
				Game.addClass('reincarnating');
				Game.BigCookieSize=0;
			}
		}
		Game.GiveUpAscend=function(bypass)
		{
			if (!bypass) Game.Prompt('<h3>Give up</h3><div class="block">Are you sure? You\'ll have to start this run over and won\'t gain any heavenly chips!</div>',[['Yes','Game.ClosePrompt();Game.GiveUpAscend(1);'],'No']);
			else
			{
				if (Game.prefs.popups) Game.Popup('Game reset');
				else Game.Notify('Gave up','Let\'s try this again!',[0,5],4);
				Game.Reset();
			}
		}
		Game.Ascend=function(bypass)
		{
			if (!bypass) Game.Prompt('<h3>Ascend</h3><div class="block">Do you REALLY want to ascend?<div class="line"></div>You will lose your progress and start over from scratch.<div class="line"></div>All your cookies will be converted into prestige and heavenly chips.<div class="line"></div>You will keep your achievements'+(Game.resets>0?', building levels and sugar lumps':'')+'.</div>',[['Yes!','Game.ClosePrompt();Game.Ascend(1);'],'No']);
			else
			{
				if (Game.prefs.popups) Game.Popup('Ascending');
				else Game.Notify('Ascending','So long, cookies.',[20,7],4);
				Game.OnAscend=0;Game.removeClass('ascending');
				Game.addClass('ascendIntro');
				//trigger the ascend animation
				Game.AscendTimer=1;
				Game.killShimmers();
				l('toggleBox').style.display='none';
				l('toggleBox').innerHTML='';
				Game.choiceSelectorOn=-1;
				Game.ToggleSpecialMenu(0);
				Game.AscendOffX=0;
				Game.AscendOffY=0;
				Game.AscendOffXT=0;
				Game.AscendOffYT=0;
				Game.AscendZoomT=1;
				Game.AscendZoom=0.2;
			}
		}
		
		Game.DebuggingPrestige=0;
		Game.AscendDragX=0;
		Game.AscendDragY=0;
		Game.AscendOffX=0;
		Game.AscendOffY=0;
		Game.AscendZoom=1;
		Game.AscendOffXT=0;
		Game.AscendOffYT=0;
		Game.AscendZoomT=1;
		Game.AscendDragging=0;
		Game.AscendGridSnap=24;
		Game.heavenlyBounds={left:0,right:0,top:0,bottom:0};
		Game.UpdateAscend=function()
		{
			if (Game.keys[37]) Game.AscendOffXT+=16*(1/Game.AscendZoomT);
			if (Game.keys[38]) Game.AscendOffYT+=16*(1/Game.AscendZoomT);
			if (Game.keys[39]) Game.AscendOffXT-=16*(1/Game.AscendZoomT);
			if (Game.keys[40]) Game.AscendOffYT-=16*(1/Game.AscendZoomT);
			
			if (Game.AscendOffXT>-Game.heavenlyBounds.left) Game.AscendOffXT=-Game.heavenlyBounds.left;
			if (Game.AscendOffXT<-Game.heavenlyBounds.right) Game.AscendOffXT=-Game.heavenlyBounds.right;
			if (Game.AscendOffYT>-Game.heavenlyBounds.top) Game.AscendOffYT=-Game.heavenlyBounds.top;
			if (Game.AscendOffYT<-Game.heavenlyBounds.bottom) Game.AscendOffYT=-Game.heavenlyBounds.bottom;
			Game.AscendOffX+=(Game.AscendOffXT-Game.AscendOffX)*0.5;
			Game.AscendOffY+=(Game.AscendOffYT-Game.AscendOffY)*0.5;
			Game.AscendZoom+=(Game.AscendZoomT-Game.AscendZoom)*0.25;
			if (Math.abs(Game.AscendZoomT-Game.AscendZoom)<0.005) Game.AscendZoom=Game.AscendZoomT;
			
			if (Game.DebuggingPrestige)
			{
				for (var i in Game.PrestigeUpgrades)
				{
					var me=Game.PrestigeUpgrades[i];
					AddEvent(l('heavenlyUpgrade'+me.id),'mousedown',function(me){return function(){
						if (!Game.DebuggingPrestige) return;
						Game.SelectedHeavenlyUpgrade=me;
					}}(me));
					AddEvent(l('heavenlyUpgrade'+me.id),'mouseup',function(me){return function(){
						if (Game.SelectedHeavenlyUpgrade==me) {Game.SelectedHeavenlyUpgrade=0;Game.BuildAscendTree();}
					}}(me));
				}
			}
			
			if (Game.mouseDown && !Game.promptOn)
			{
				if (!Game.AscendDragging)
				{
					Game.AscendDragX=Game.mouseX;
					Game.AscendDragY=Game.mouseY;
				}
				Game.AscendDragging=1;
				
				if (Game.DebuggingPrestige)
				{
					if (Game.SelectedHeavenlyUpgrade)
					{
						Game.tooltip.hide();
						//drag upgrades around
						var me=Game.SelectedHeavenlyUpgrade;
						me.posX+=(Game.mouseX-Game.AscendDragX)*(1/Game.AscendZoomT);
						me.posY+=(Game.mouseY-Game.AscendDragY)*(1/Game.AscendZoomT);
						var posX=me.posX;//Math.round(me.posX/Game.AscendGridSnap)*Game.AscendGridSnap;
						var posY=me.posY;//Math.round(me.posY/Game.AscendGridSnap)*Game.AscendGridSnap;
						l('heavenlyUpgrade'+me.id).style.left=Math.floor(posX)+'px';
						l('heavenlyUpgrade'+me.id).style.top=Math.floor(posY)+'px';
						for (var ii in me.parents)
						{
							var origX=0;
							var origY=0;
							var targX=me.posX+28;
							var targY=me.posY+28;
							if (me.parents[ii]!=-1) {origX=me.parents[ii].posX+28;origY=me.parents[ii].posY+28;}
							var rot=-(Math.atan((targY-origY)/(origX-targX))/Math.PI)*180;
							if (targX<=origX) rot+=180;
							var dist=Math.floor(Math.sqrt((targX-origX)*(targX-origX)+(targY-origY)*(targY-origY)));
							//l('heavenlyLink'+me.id+'-'+ii).style='width:'+dist+'px;-webkit-transform:rotate('+rot+'deg);-moz-transform:rotate('+rot+'deg);-ms-transform:rotate('+rot+'deg);-o-transform:rotate('+rot+'deg);transform:rotate('+rot+'deg);left:'+(origX)+'px;top:'+(origY)+'px;';
							l('heavenlyLink'+me.id+'-'+ii).style='width:'+dist+'px;transform:rotate('+rot+'deg);left:'+(origX)+'px;top:'+(origY)+'px;';
						}
					}
				}
				if (!Game.SelectedHeavenlyUpgrade)
				{
					Game.AscendOffXT+=(Game.mouseX-Game.AscendDragX)*(1/Game.AscendZoomT);
					Game.AscendOffYT+=(Game.mouseY-Game.AscendDragY)*(1/Game.AscendZoomT);
				}
				Game.AscendDragX=Game.mouseX;
				Game.AscendDragY=Game.mouseY;
			}
			else
			{
				/*if (Game.SelectedHeavenlyUpgrade)
				{
					var me=Game.SelectedHeavenlyUpgrade;
					me.posX=Math.round(me.posX/Game.AscendGridSnap)*Game.AscendGridSnap;
					me.posY=Math.round(me.posY/Game.AscendGridSnap)*Game.AscendGridSnap;
					l('heavenlyUpgrade'+me.id).style.left=me.posX+'px';
					l('heavenlyUpgrade'+me.id).style.top=me.posY+'px';
				}*/
				Game.AscendDragging=0;
				Game.SelectedHeavenlyUpgrade=0;
			}
			if (Game.Click || Game.promptOn)
			{
				Game.AscendDragging=0;
			}
			
			//Game.ascendl.style.backgroundPosition=Math.floor(Game.AscendOffX/2)+'px '+Math.floor(Game.AscendOffY/2)+'px';
			//Game.ascendl.style.backgroundPosition=Math.floor(Game.AscendOffX/2)+'px '+Math.floor(Game.AscendOffY/2)+'px,'+Math.floor(Game.AscendOffX/4)+'px '+Math.floor(Game.AscendOffY/4)+'px';
			//Game.ascendContentl.style.left=Math.floor(Game.AscendOffX)+'px';
			//Game.ascendContentl.style.top=Math.floor(Game.AscendOffY)+'px';
			Game.ascendContentl.style.webkitTransform='translate('+Math.floor(Game.AscendOffX)+'px,'+Math.floor(Game.AscendOffY)+'px)';
			Game.ascendContentl.style.msTransform='translate('+Math.floor(Game.AscendOffX)+'px,'+Math.floor(Game.AscendOffY)+'px)';
			Game.ascendContentl.style.oTransform='translate('+Math.floor(Game.AscendOffX)+'px,'+Math.floor(Game.AscendOffY)+'px)';
			Game.ascendContentl.style.mozTransform='translate('+Math.floor(Game.AscendOffX)+'px,'+Math.floor(Game.AscendOffY)+'px)';
			Game.ascendContentl.style.transform='translate('+Math.floor(Game.AscendOffX)+'px,'+Math.floor(Game.AscendOffY)+'px)';
			Game.ascendZoomablel.style.webkitTransform='scale('+(Game.AscendZoom)+','+(Game.AscendZoom)+')';
			Game.ascendZoomablel.style.msTransform='scale('+(Game.AscendZoom)+','+(Game.AscendZoom)+')';
			Game.ascendZoomablel.style.oTransform='scale('+(Game.AscendZoom)+','+(Game.AscendZoom)+')';
			Game.ascendZoomablel.style.mozTransform='scale('+(Game.AscendZoom)+','+(Game.AscendZoom)+')';
			Game.ascendZoomablel.style.transform='scale('+(Game.AscendZoom)+','+(Game.AscendZoom)+')';
			
			//if (Game.Scroll!=0) Game.ascendContentl.style.transformOrigin=Math.floor(Game.windowW/2-Game.mouseX)+'px '+Math.floor(Game.windowH/2-Game.mouseY)+'px';
			if (Game.Scroll<0 && !Game.promptOn) {Game.AscendZoomT=0.5;}
			if (Game.Scroll>0 && !Game.promptOn) {Game.AscendZoomT=1;}
			
			if (Game.T%2==0)
			{
				l('ascendPrestige').innerHTML='Prestige level :<br>'+Beautify(Game.prestige);
				l('ascendHCs').innerHTML='Heavenly chips :<br><span class="price heavenly">'+Beautify(Math.round(Game.heavenlyChipsDisplayed))+'</span>';
				if (Game.prestige>0) l('ascendModeButton').style.display='block';
				else l('ascendModeButton').style.display='none';
			}
			Game.heavenlyChipsDisplayed+=(Game.heavenlyChips-Game.heavenlyChipsDisplayed)*0.4;
			
			if (Game.DebuggingPrestige && Game.T%10==0)
			{
				var str='';
				for (var i in Game.PrestigeUpgrades)
				{
					var me=Game.PrestigeUpgrades[i];
					str+=me.id+':['+Math.floor(me.posX)+','+Math.floor(me.posY)+'],';
				}
				l('upgradePositions').value='Game.UpgradePositions={'+str+'};';
			}
			//if (Game.T%5==0) Game.BuildAscendTree();
		}
		Game.AscendRefocus=function()
		{
			Game.AscendOffX=0;
			Game.AscendOffY=0;
			Game.ascendl.className='';
		}
		
		Game.SelectedHeavenlyUpgrade=0;
		Game.PurchaseHeavenlyUpgrade=function(what)
		{
			//if (Game.Has('Neuromancy')) Game.UpgradesById[what].toggle(); else
			if (Game.UpgradesById[what].buy())
			{
				if (l('heavenlyUpgrade'+what)){var rect=l('heavenlyUpgrade'+what).getBoundingClientRect();Game.SparkleAt((rect.left+rect.right)/2,(rect.top+rect.bottom)/2-24);}
				//Game.BuildAscendTree();
			}
		}
		Game.BuildAscendTree=function()
		{
			var str='';
			Game.heavenlyBounds={left:0,right:0,top:0,bottom:0};

			if (Game.DebuggingPrestige) l('upgradePositions').style.display='block'; else l('upgradePositions').style.display='none';
			
			for (var i in Game.PrestigeUpgrades)
			{
				var me=Game.PrestigeUpgrades[i];
				me.canBePurchased=1;
				if (!me.bought && !Game.DebuggingPrestige)
				{
					if (me.showIf && !me.showIf()) me.canBePurchased=0;
					else
					{
						for (var ii in me.parents)
						{
							if (me.parents[ii]!=-1 && !me.parents[ii].bought) me.canBePurchased=0;
						}
					}
				}
			}
			str+='<div class="crateBox" style="filter:none;-webkit-filter:none;">';//chrome is still bad at these
			for (var i in Game.PrestigeUpgrades)
			{
				var me=Game.PrestigeUpgrades[i];
				
				var ghosted=0;
				if (me.canBePurchased || Game.Has('Neuromancy'))
				{
					str+=Game.crate(me,'ascend','Game.PurchaseHeavenlyUpgrade('+me.id+');','heavenlyUpgrade'+me.id);
				}
				else
				{
					for (var ii in me.parents)
					{
						if (me.parents[ii]!=-1 && me.parents[ii].canBePurchased) ghosted=1;
					}
					if (me.showIf && !me.showIf()) ghosted=0;
					if (ghosted)
					{
						//maybe replace this with Game.crate()
						str+='<div class="crate upgrade heavenly ghosted" id="heavenlyUpgrade'+me.id+'" style="position:absolute;left:'+me.posX+'px;top:'+me.posY+'px;'+(me.icon[2]?'background-image:url('+me.icon[2]+');':'')+'background-position:'+(-me.icon[0]*48)+'px '+(-me.icon[1]*48)+'px;"></div>';
					}
				}
				if (me.canBePurchased || Game.Has('Neuromancy') || ghosted)
				{
					if (me.posX<Game.heavenlyBounds.left) Game.heavenlyBounds.left=me.posX;
					if (me.posX>Game.heavenlyBounds.right) Game.heavenlyBounds.right=me.posX;
					if (me.posY<Game.heavenlyBounds.top) Game.heavenlyBounds.top=me.posY;
					if (me.posY>Game.heavenlyBounds.bottom) Game.heavenlyBounds.bottom=me.posY;
				}
				for (var ii in me.parents)//create pulsing links
				{
					if (me.parents[ii]!=-1 && (me.canBePurchased || ghosted))
					{
						var origX=0;
						var origY=0;
						var targX=me.posX+28;
						var targY=me.posY+28;
						if (me.parents[ii]!=-1) {origX=me.parents[ii].posX+28;origY=me.parents[ii].posY+28;}
						var rot=-(Math.atan((targY-origY)/(origX-targX))/Math.PI)*180;
						if (targX<=origX) rot+=180;
						var dist=Math.floor(Math.sqrt((targX-origX)*(targX-origX)+(targY-origY)*(targY-origY)));
						str+='<div class="parentLink" id="heavenlyLink'+me.id+'-'+ii+'" style="'+(ghosted?'opacity:0.1;':'')+'width:'+dist+'px;-webkit-transform:rotate('+rot+'deg);-moz-transform:rotate('+rot+'deg);-ms-transform:rotate('+rot+'deg);-o-transform:rotate('+rot+'deg);transform:rotate('+rot+'deg);left:'+(origX)+'px;top:'+(origY)+'px;"></div>';
					}
				}
			}
			Game.heavenlyBounds.left-=128;
			Game.heavenlyBounds.top-=128;
			Game.heavenlyBounds.right+=128+64;
			Game.heavenlyBounds.bottom+=128+64;
			//str+='<div style="border:1px solid red;position:absolute;left:'+Game.heavenlyBounds.left+'px;width:'+(Game.heavenlyBounds.right-Game.heavenlyBounds.left)+'px;top:'+Game.heavenlyBounds.top+'px;height:'+(Game.heavenlyBounds.bottom-Game.heavenlyBounds.top)+'px;"></div>';
			str+='</div>';
			Game.ascendUpgradesl.innerHTML=str;
		}
