Game.upgradesToRebuild=1;
		Game.Upgrades=[];
		Game.UpgradesById=[];
		Game.UpgradesN=0;
		Game.UpgradesInStore=[];
		Game.UpgradesOwned=0;
		Game.Upgrade=function(name,desc,price,icon,buyFunction)
		{
			this.id=Game.UpgradesN;
			this.name=name;
			this.desc=desc;
			this.basePrice=price;
			this.icon=icon;
			this.buyFunction=buyFunction;
			/*this.unlockFunction=unlockFunction;
			this.unlocked=(this.unlockFunction?0:1);*/
			this.unlocked=0;
			this.bought=0;
			this.hide=0;//0=show, 3=hide (1-2 : I have no idea)
			this.order=this.id;
			if (order) this.order=order+this.id*0.001;
			this.type='';
			if (type) this.type=type;
			this.power=0;
			if (power) this.power=power;
			
			this.buy=function()
			{
				var cancelPurchase=0;
				if (this.clickFunction) cancelPurchase=!this.clickFunction();
				if (!cancelPurchase)
				{
					var price=this.basePrice;
					if (Game.cookies>=price && !this.bought)
					{
						Game.Spend(price);
						this.bought=1;
						if (this.buyFunction) this.buyFunction();
						Game.upgradesToRebuild=1;
						Game.recalculateGains=1;
						Game.UpgradesOwned++;
					}
				}
			}
			
			this.toggle=function()//cheating only
			{
				if (!this.bought)
				{
					this.bought=1;
					if (this.buyFunction) this.buyFunction();
					Game.upgradesToRebuild=1;
					Game.recalculateGains=1;
					Game.UpgradesOwned++;
				}
				else
				{
					this.bought=0;
					Game.upgradesToRebuild=1;
					Game.recalculateGains=1;
					Game.UpgradesOwned--;
				}
				Game.UpdateMenu();
			}
			
			Game.Upgrades[this.name]=this;
			Game.UpgradesById[this.id]=this;
			Game.UpgradesN++;
			return this;
		}
		
		Game.Unlock=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Upgrades[what])
				{
					if (Game.Upgrades[what].unlocked==0)
					{
						Game.Upgrades[what].unlocked=1;
						Game.upgradesToRebuild=1;
						Game.recalculateGains=1;
					}
				}
			}
			else {for (var i in what) {Game.Unlock(what[i]);}}
		}
		Game.Lock=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Upgrades[what])
				{
					Game.Upgrades[what].unlocked=0;
					Game.Upgrades[what].bought=0;
					Game.upgradesToRebuild=1;
					if (Game.Upgrades[what].bought==1)
					{
						Game.UpgradesOwned--;
					}
					Game.recalculateGains=1;
				}
			}
			else {for (var i in what) {Game.Lock(what[i]);}}
		}
		
		Game.Has=function(what)
		{
			return (Game.Upgrades[what]?Game.Upgrades[what].bought:0);
		}
		
		Game.RebuildUpgrades=function()//recalculate the upgrades you can buy
		{
			Game.upgradesToRebuild=0;
			var list=[];
			for (var i in Game.Upgrades)
			{
				var me=Game.Upgrades[i];
				if (!me.bought)
				{
					if (me.unlocked) list.push(me);
				}
			}
			
			var sortMap=function(a,b)
			{
				if (a.basePrice>b.basePrice) return 1;
				else if (a.basePrice<b.basePrice) return -1;
				else return 0;
			}
			list.sort(sortMap);
			
			Game.UpgradesInStore=[];
			for (var i in list)
			{
				Game.UpgradesInStore.push(list[i]);
			}
			var str='';
			for (var i in Game.UpgradesInStore)
			{
				//if (!Game.UpgradesInStore[i]) break;
				var me=Game.UpgradesInStore[i];
				str+='<div class="crate upgrade" '+Game.getTooltip(
				//'<b>'+me.name+'</b>'+me.desc
				'<div style="min-width:200px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.basePrice))+'</span></div><small>[Upgrade]</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
				,0,16,'bottom-right')+' onclick="Game.UpgradesById['+me.id+'].buy();" id="upgrade'+i+'" style="background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
			}
			l('upgrades').innerHTML=str;
		}
		
		var tier1=10;
		var tier2=100;
		var tier3=1000;
		var tier4=10000;
		
		var type='';
		var power=0;
		
		//define upgrades
		//WARNING : do NOT add new upgrades in between, this breaks the saves. Add them at the end !
		var order=100;//this is used to set the order in which the items are listed
		new Game.Upgrade('Reinforced index finger','The mouse gains <b>+1</b> cookie per click.<br>Cursors gain <b>+0.1</b> base CpS.<q>prod prod</q>',100,[0,0]);
		new Game.Upgrade('Carpal tunnel prevention cream','The mouse and cursors are <b>twice</b> as efficient.',400,[0,0]);
		new Game.Upgrade('Ambidextrous','The mouse and cursors are <b>twice</b> as efficient.<q>Look ma, both hands!</q>',10000,[0,6]);
		new Game.Upgrade('Thousand fingers','The mouse and cursors gain <b>+0.1</b> cookies for each non-cursor object owned.<q>clickity</q>',500000,[0,6]);
		new Game.Upgrade('Million fingers','The mouse and cursors gain <b>+0.5</b> cookies for each non-cursor object owned.<q>clickityclickity</q>',50000000,[1,6]);
		new Game.Upgrade('Billion fingers','The mouse and cursors gain <b>+2</b> cookies for each non-cursor object owned.<q>clickityclickityclickity</q>',500000000,[2,6]);
		new Game.Upgrade('Trillion fingers','The mouse and cursors gain <b>+10</b> cookies for each non-cursor object owned.<q>clickityclickityclickityclickity</q>',5000000000,[3,6]);
		
		order=200;
		new Game.Upgrade('Forwards from grandma','Grandmas gain <b>+0.3</b> base CpS.<q>RE:RE:thought you\'d get a kick out of this ;))</q>',Game.Objects['Grandma'].basePrice*tier1,[1,0]);
		new Game.Upgrade('Steel-plated rolling pins','Grandmas are <b>twice</b> as efficient.',Game.Objects['Grandma'].basePrice*tier2,[1,0]);
		new Game.Upgrade('Lubricated dentures','Grandmas are <b>twice</b> as efficient.<q>Squish</q>',Game.Objects['Grandma'].basePrice*tier3,[1,1]);
		
		order=300;
		new Game.Upgrade('Cheap hoes','Farms gain <b>+0.5</b> base CpS.',Game.Objects['Farm'].basePrice*tier1,[2,0]);
		new Game.Upgrade('Fertilizer','Farms are <b>twice</b> as efficient.<q>It\'s chocolate, I swear.</q>',Game.Objects['Farm'].basePrice*tier2,[2,0]);
		new Game.Upgrade('Cookie trees','Farms are <b>twice</b> as efficient.<q>A relative of the breadfruit.</q>',Game.Objects['Farm'].basePrice*tier3,[2,1]);
		
		order=400;
		new Game.Upgrade('Sturdier conveyor belts','Factories gain <b>+4</b> base CpS.',Game.Objects['Factory'].basePrice*tier1,[4,0]);
		new Game.Upgrade('Child labor','Factories are <b>twice</b> as efficient.<q>Cheaper, healthier workforce - and so much more receptive to whipping!</q>',Game.Objects['Factory'].basePrice*tier2,[4,0]);
		new Game.Upgrade('Sweatshop','Factories are <b>twice</b> as efficient.<q>Slackers will be terminated.</q>',Game.Objects['Factory'].basePrice*tier3,[4,1]);
		
		order=500;
		new Game.Upgrade('Sugar gas','Mines gain <b>+10</b> base CpS.<q>A pink, volatile gas, found in the depths of some chocolate caves.</q>',Game.Objects['Mine'].basePrice*tier1,[3,0]);
		new Game.Upgrade('Megadrill','Mines are <b>twice</b> as efficient.',Game.Objects['Mine'].basePrice*tier2,[3,0]);
		new Game.Upgrade('Ultradrill','Mines are <b>twice</b> as efficient.',Game.Objects['Mine'].basePrice*tier3,[3,1]);
		
		order=600;
		new Game.Upgrade('Vanilla nebulae','Shipments gain <b>+30</b> base CpS.',Game.Objects['Shipment'].basePrice*tier1,[5,0]);
		new Game.Upgrade('Wormholes','Shipments are <b>twice</b> as efficient.<q>By using these as shortcuts, your ships can travel much faster.</q>',Game.Objects['Shipment'].basePrice*tier2,[5,0]);
		new Game.Upgrade('Frequent flyer','Shipments are <b>twice</b> as efficient.<q>Come back soon!</q>',Game.Objects['Shipment'].basePrice*tier3,[5,1]);
		
		order=700;
		new Game.Upgrade('Antimony','Alchemy labs gain <b>+100</b> base CpS.<q>Actually worth a lot of mony.</q>',Game.Objects['Alchemy lab'].basePrice*tier1,[6,0]);
		new Game.Upgrade('Essence of dough','Alchemy labs are <b>twice</b> as efficient.<q>Extracted through the 5 ancient steps of alchemical baking.</q>',Game.Objects['Alchemy lab'].basePrice*tier2,[6,0]);
		new Game.Upgrade('True chocolate','Alchemy labs are <b>twice</b> as efficient.<q>The purest form of cacao.</q>',Game.Objects['Alchemy lab'].basePrice*tier3,[6,1]);
		
		order=800;
		new Game.Upgrade('Ancient tablet','Portals gain <b>+1,666</b> base CpS.<q>A strange slab of peanut brittle, holding an ancient cookie recipe. Neat!</q>',Game.Objects['Portal'].basePrice*tier1,[7,0]);
		new Game.Upgrade('Insane oatling workers','Portals are <b>twice</b> as efficient.<q>ARISE, MY MINIONS!</q>',Game.Objects['Portal'].basePrice*tier2,[7,0]);
		new Game.Upgrade('Soul bond','Portals are <b>twice</b> as efficient.<q>So I just sign up and get more cookies? Sure, whatever!</q>',Game.Objects['Portal'].basePrice*tier3,[7,1]);
		
		order=900;
		new Game.Upgrade('Flux capacitors','Time machines gain <b>+9,876</b> base CpS.<q>Bake to the future.</q>',1234567890,[8,0]);
		new Game.Upgrade('Time paradox resolver','Time machines are <b>twice</b> as efficient.<q>No more fooling around with your own grandmother!</q>',9876543210,[8,0]);
		new Game.Upgrade('Quantum conundrum','Time machines are <b>twice</b> as efficient.<q>It\'s full of stars!</q>',98765456789,[8,1]);
		
		order=20000;
		new Game.Upgrade('Kitten helpers','You gain <b>more CpS</b> the more milk you have.<q>meow may I help you</q>',9000000,[1,7]);
		new Game.Upgrade('Kitten workers','You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow</q>',9000000000,[2,7]);
		
		order=10000;
		type='cookie';power=5;
		new Game.Upgrade('Oatmeal raisin cookies','Cookie production multiplier <b>+5%</b>.<q>No raisin to hate these.</q>',99999999,[0,3]);
		new Game.Upgrade('Peanut butter cookies','Cookie production multiplier <b>+5%</b>.',99999999,[1,3]);
		new Game.Upgrade('Plain cookies','Cookie production multiplier <b>+5%</b>.<q>Meh.</q>',99999999,[2,3]);
		new Game.Upgrade('Coconut cookies','Cookie production multiplier <b>+5%</b>.',999999999,[3,3]);
		new Game.Upgrade('White chocolate cookies','Cookie production multiplier <b>+5%</b>.',999999999,[4,3]);
		new Game.Upgrade('Macadamia nut cookies','Cookie production multiplier <b>+5%</b>.',999999999,[5,3]);
		power=10;new Game.Upgrade('Double-chip cookies','Cookie production multiplier <b>+10%</b>.',99999999999,[6,3]);
		power=5;new Game.Upgrade('Sugar cookies','Cookie production multiplier <b>+5%</b>.',99999999,[7,3]);
		power=10;new Game.Upgrade('White chocolate macadamia nut cookies','Cookie production multiplier <b>+10%</b>.',99999999999,[8,3]);
		new Game.Upgrade('All-chocolate cookies','Cookie production multiplier <b>+10%</b>.',99999999999,[9,3]);
		type='';power=0;
		
		order=100;
		new Game.Upgrade('Quadrillion fingers','The mouse and cursors gain <b>+20</b> cookies for each non-cursor object owned.<q>clickityclickityclickityclickityclick</q>',50000000000,[3,6]);
		
		order=200;new Game.Upgrade('Prune juice','Grandmas are <b>twice</b> as efficient.<q>Gets me going.</q>',Game.Objects['Grandma'].basePrice*tier4,[1,2]);
		order=300;new Game.Upgrade('Genetically-modified cookies','Farms are <b>twice</b> as efficient.<q>All-natural mutations.</q>',Game.Objects['Farm'].basePrice*tier4,[2,2]);
		order=400;new Game.Upgrade('Radium reactors','Factories are <b>twice</b> as efficient.<q>Gives your cookies a healthy glow.</q>',Game.Objects['Factory'].basePrice*tier4,[4,2]);
		order=500;new Game.Upgrade('Ultimadrill','Mines are <b>twice</b> as efficient.<q>Pierce the heavens, etc.</q>',Game.Objects['Mine'].basePrice*tier4,[3,2]);
		order=600;new Game.Upgrade('Warp drive','Shipments are <b>twice</b> as efficient.',Game.Objects['Shipment'].basePrice*tier4,[5,2]);
		order=700;new Game.Upgrade('Ambrosia','Alchemy labs are <b>twice</b> as efficient.',Game.Objects['Alchemy lab'].basePrice*tier4,[6,2]);
		order=800;new Game.Upgrade('Sanity dance','Portals are <b>twice</b> as efficient.<q>We can change if we want to.<br>We can leave our brains behind.</q>',Game.Objects['Portal'].basePrice*tier4,[7,2]);
		order=900;new Game.Upgrade('Causality enforcer','Time machines are <b>twice</b> as efficient.<q>What happened, happened.</q>',1234567890000,[8,2]);
		
		order=5000;
		new Game.Upgrade('Lucky day','Golden cookies appear <b>twice as often</b> and last <b>twice as long</b>.',777777777,[10,1]);
		new Game.Upgrade('Serendipity','Golden cookies appear <b>twice as often</b> and last <b>twice as long</b>.',77777777777,[10,1]);
		
		order=20000;
		new Game.Upgrade('Kitten engineers','You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow, sir</q>',9000000000000,[3,7]);
		
		order=10000;
		type='cookie';power=15;
		new Game.Upgrade('Dark chocolate-coated cookies','Cookie production multiplier <b>+15%</b>.',999999999999,[10,3]);
		new Game.Upgrade('White chocolate-coated cookies','Cookie production multiplier <b>+15%</b>.',999999999999,[11,3]);
		type='';power=0;
		
		order=250;
		new Game.Upgrade('Farmer grandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Farm'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});
		new Game.Upgrade('Worker grandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Factory'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});
		new Game.Upgrade('Miner grandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Mine'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});
		new Game.Upgrade('Cosmic grandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Shipment'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});
		new Game.Upgrade('Transmuted grandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Alchemy lab'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});
		new Game.Upgrade('Altered grandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Portal'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});
		new Game.Upgrade('Grandmas\' grandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Time machine'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});
		
		order=15000;
		Game.baseResearchTime=Game.fps*60*30;
		Game.SetResearch=function(what,time)
		{
			if (Game.Upgrades[what])
			{
				Game.researchT=Game.Has('Ultrascience')?Game.fps*5:Game.baseResearchTime;
				Game.nextResearch=Game.Upgrades[what].id;
				Game.Popup('Research has begun.');
			}
		}
		
		new Game.Upgrade('Bingo center/Research facility','Grandma-operated science lab and leisure club.<br>Grandmas are <b>4 times</b> as efficient.<br><b>Regularly unlocks new upgrades</b>.',100000000000,[11,9],function(){Game.SetResearch('Specialized chocolate chips');});
		new Game.Upgrade('Specialized chocolate chips','[Research]<br>Cookie production multiplier <b>+1%</b>.<q>Computer-designed chocolate chips. Computer chips, if you will.</q>',10000000000,[0,9],function(){Game.SetResearch('Designer cocoa beans');});
		new Game.Upgrade('Designer cocoa beans','[Research]<br>Cookie production multiplier <b>+2%</b>.<q>Now more aerodynamic than ever!</q>',20000000000,[1,9],function(){Game.SetResearch('Ritual rolling pins');});
		new Game.Upgrade('Ritual rolling pins','[Research]<br>Grandmas are <b>twice</b> as efficient.<q>The result of years of scientific research!</q>',40000000000,[2,9],function(){Game.SetResearch('Underworld ovens');});
		new Game.Upgrade('Underworld ovens','[Research]<br>Cookie production multiplier <b>+3%</b>.<q>Powered by science, of course!</q>',80000000000,[3,9],function(){Game.SetResearch('One mind');});
		new Game.Upgrade('One mind','[Research]<br>Each grandma gains <b>+1 base CpS for each 50 grandmas</b>.<div class="warning">Note : the grandmothers are growing restless. Do not encourage them.</div><q>We are one. We are many.</q>',160000000000,[4,9],function(){Game.elderWrath=1;Game.SetResearch('Exotic nuts');});
		Game.Upgrades['One mind'].clickFunction=function(){return confirm('Warning : purchasing this will have unexpected, and potentially undesirable results!\nIt\'s all downhill from here. You have been warned!\nPurchase anyway?');};
		new Game.Upgrade('Exotic nuts','[Research]<br>Cookie production multiplier <b>+4%</b>.<q>You\'ll go crazy over these!</q>',320000000000,[5,9],function(){Game.SetResearch('Communal brainsweep');});
		new Game.Upgrade('Communal brainsweep','[Research]<br>Each grandma gains another <b>+1 base CpS for each 50 grandmas</b>.<div class="warning">Note : proceeding any further in scientific research may have unexpected results. You have been warned.</div><q>We fuse. We merge. We grow.</q>',640000000000,[6,9],function(){Game.elderWrath=2;Game.SetResearch('Arcane sugar');});
		new Game.Upgrade('Arcane sugar','[Research]<br>Cookie production multiplier <b>+5%</b>.<q>Tastes like insects, ligaments, and molasses.</q>',1280000000000,[7,9],function(){Game.SetResearch('Elder Pact');});
		new Game.Upgrade('Elder Pact','[Research]<br>Each grandma gains <b>+1 base CpS for each 20 portals</b>.<div class="warning">Note : this is a bad idea.</div><q>squirm crawl slither writhe<br>today we rise</q>',2560000000000,[8,9],function(){Game.elderWrath=3;});
		new Game.Upgrade('Elder Pledge','[Repeatable]<br>Contains the wrath of the elders, at least for a while.',1,[9,9],function()
		{
			Game.elderWrath=0;
			Game.pledges++;
			Game.pledgeT=Game.fps*60*(Game.Has('Sacrificial rolling pins')?60:30);
			Game.Upgrades['Elder Pledge'].basePrice=Math.pow(8,Math.min(Game.pledges+2,13));
			Game.Unlock('Elder Covenant');
		});
		Game.Upgrades['Elder Pledge'].hide=3;
		
		order=150;
		new Game.Upgrade('Plastic mouse','Clicking gains <b>+1% of your CpS</b>.',50000,[11,0]);
		new Game.Upgrade('Iron mouse','Clicking gains <b>+1% of your CpS</b>.',5000000,[11,0]);
		new Game.Upgrade('Titanium mouse','Clicking gains <b>+1% of your CpS</b>.',500000000,[11,1]);
		new Game.Upgrade('Adamantium mouse','Clicking gains <b>+1% of your CpS</b>.',50000000000,[11,2]);
		
		order=40000;
		new Game.Upgrade('Ultrascience','Research takes only <b>5 seconds</b>.',7,[9,2]);//debug purposes only
		Game.Upgrades['Ultrascience'].hide=3;
		
		order=10000;
		type='cookie';power=15;
		new Game.Upgrade('Eclipse cookies','Cookie production multiplier <b>+15%</b>.<q>Look to the cookie.</q>',9999999999999,[0,4]);
		new Game.Upgrade('Zebra cookies','Cookie production multiplier <b>+15%</b>.',9999999999999,[1,4]);
		type='';power=0;
		
		order=100;
		new Game.Upgrade('Quintillion fingers','The mouse and cursors gain <b>+100</b> cookies for each non-cursor object owned.<q>man, just go click click click click click, it\'s real easy, man.</q>',50000000000000,[3,6]);
		
		order=40000;
		new Game.Upgrade('Gold hoard','Golden cookies appear <b>really often</b>.',7,[10,1]);//debug purposes only
		Game.Upgrades['Gold hoard'].hide=3;
		
		order=15000;
		new Game.Upgrade('Elder Covenant','[Switch]<br>Puts a permanent end to the elders\' wrath, at the price of 5% of your CpS.',6666666666666,[8,9],function()
		{
			Game.pledgeT=0;
			Game.Lock('Revoke Elder Covenant');
			Game.Unlock('Revoke Elder Covenant');
			Game.Lock('Elder Pledge');
			Game.Win('Elder calm');
		});
		Game.Upgrades['Elder Covenant'].hide=3;

		new Game.Upgrade('Revoke Elder Covenant','[Switch]<br>You will get 5% of your CpS back, but the grandmatriarchs will return.',6666666666,[8,9],function()
		{
			Game.Lock('Elder Covenant');
			Game.Unlock('Elder Covenant');
		});
		Game.Upgrades['Revoke Elder Covenant'].hide=3;
		
		order=5000;
		new Game.Upgrade('Get lucky','Golden cookie effects last <b>twice as long</b>.<q>You\'ve been up all night, haven\'t you?</q>',77777777777777,[10,1]);
		
		order=15000;
		new Game.Upgrade('Sacrificial rolling pins','Elder pledge last <b>twice</b> as long.',2888888888888,[2,9]);
		
		order=10000;
		type='cookie';power=15;
		new Game.Upgrade('Snickerdoodles','Cookie production multiplier <b>+15%</b>.',99999999999999,[2,4]);
		new Game.Upgrade('Stroopwafels','Cookie production multiplier <b>+15%</b>.<q>If it ain\'t dutch, it ain\'t much.</q>',99999999999999,[3,4]);
		new Game.Upgrade('Macaroons','Cookie production multiplier <b>+15%</b>.',99999999999999,[4,4]);
		type='';power=0;
		
		order=40000;
		new Game.Upgrade('Neuromancy','Can toggle upgrades on and off at will in the stats menu.',7,[4,9]);//debug purposes only
		Game.Upgrades['Neuromancy'].hide=3;
		
		order=10000;
		type='cookie';power=15;
		new Game.Upgrade('Empire biscuits','Cookie production multiplier <b>+15%</b>.',99999999999999,[5,4]);
		new Game.Upgrade('British tea biscuits','Cookie production multiplier <b>+15%</b>.',99999999999999,[6,4]);
		new Game.Upgrade('Chocolate british tea biscuits','Cookie production multiplier <b>+15%</b>.',99999999999999,[7,4]);
		new Game.Upgrade('Round british tea biscuits','Cookie production multiplier <b>+15%</b>.',99999999999999,[8,4]);
		new Game.Upgrade('Round chocolate british tea biscuits','Cookie production multiplier <b>+15%</b>.',99999999999999,[9,4]);
		new Game.Upgrade('Round british tea biscuits with heart motif','Cookie production multiplier <b>+15%</b>.',99999999999999,[10,4]);
		new Game.Upgrade('Round chocolate british tea biscuits with heart motif','Cookie production multiplier <b>+15%</b>.<q>Quite.</q>',99999999999999,[11,4]);
		type='';power=0;
		
		
		order=1000;
		new Game.Upgrade('Sugar bosons','Antimatter condensers gain <b>+99,999</b> base CpS.',Game.Objects['Antimatter condenser'].basePrice*tier1,[13,0]);
		new Game.Upgrade('String theory','Antimatter condensers are <b>twice</b> as efficient.',Game.Objects['Antimatter condenser'].basePrice*tier2,[13,0]);
		new Game.Upgrade('Large macaron collider','Antimatter condensers are <b>twice</b> as efficient.<q>How singular!</q>',Game.Objects['Antimatter condenser'].basePrice*tier3,[13,1]);
		new Game.Upgrade('Big bang bake','Antimatter condensers are <b>twice</b> as efficient.<q>And that\'s how it all began.</q>',Game.Objects['Antimatter condenser'].basePrice*tier4,[13,2]);

		order=250;
		new Game.Upgrade('Antigrandmas','Grandmas are <b>twice</b> as efficient.',Game.Objects['Antimatter condenser'].basePrice*tier2,[10,9],function(){Game.Objects['Grandma'].drawFunction();});

		order=10000;
		type='cookie';power=20;
		new Game.Upgrade('Madeleines','Cookie production multiplier <b>+20%</b>.<q>Unforgettable!</q>',199999999999999,[12,3]);
		new Game.Upgrade('Palmiers','Cookie production multiplier <b>+20%</b>.',199999999999999,[13,3]);
		new Game.Upgrade('Palets','Cookie production multiplier <b>+20%</b>.',199999999999999,[12,4]);
		new Game.Upgrade('Sabl&eacute;s','Cookie production multiplier <b>+20%</b>.',199999999999999,[13,4]);
		type='';power=0;
		
		order=20000;
		new Game.Upgrade('Kitten overseers','You gain <b>more CpS</b> the more milk you have.<q>my purrpose is to serve you, sir</q>',900000000000000,[8,7]);
		
		/*
		new Game.Upgrade('Plain milk','Unlocks <b>plain milk</b>, available in the menu.',120000000000,[4,8]);
		new Game.Upgrade('Chocolate milk','Unlocks <b>chocolate milk</b>, available in the menu.',120000000000,[5,8]);
		new Game.Upgrade('Raspberry milk','Unlocks <b>raspberry milk</b>, available in the menu.',120000000000,[6,8]);
		new Game.Upgrade('Ain\'t got milk','Unlocks <b>no milk please</b>, available in the menu.',120000000000,[0,8]);
		
		new Game.Upgrade('Blue background','Unlocks the <b>blue background</b>, available in the menu.',120000000000,[0,9]);
		new Game.Upgrade('Red background','Unlocks the <b>red background</b>, available in the menu.',120000000000,[1,9]);
		new Game.Upgrade('White background','Unlocks the <b>white background</b>, available in the menu.',120000000000,[2,9]);
		new Game.Upgrade('Black background','Unlocks the <b>black background</b>, available in the menu.',120000000000,[3,9]);
