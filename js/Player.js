(function(window) {
	
    var KEYCODE_SPACE = 32;
    var KEYCODE_UP = 38;
    var KEYCODE_LEFT = 37;
    var KEYCODE_RIGHT = 39;
    var KEYCODE_DOWN = 40;
    var KEYCODE_W = 87;
    var KEYCODE_A = 65;
    var KEYCODE_D = 68;
    var KEYCODE_S = 83;
    
	
	function Player(playerName, imgPlayer) {
		this.initialize(playerName, imgPlayer);
	}
	Player.prototype = new createjs.Sprite();

	//public properties
	Player.prototype.alive = true;

	// constructor:
	Player.prototype.Sprite_initialize = Player.prototype.initialize; //unique to avoid overiding base class

	Player.prototype.initialize = function(playerName, imgPlayer) {
		var localSpriteSheet = new createjs.SpriteSheet({
			images : [ imgPlayer ], //image to use
			frames : {
				width : 64,
				height : 64,
				regX : 32,
				regY : 32
			},
			animations : {
				walk : {
					frames : [ 0, 1, 2, 1 ],
					speed : 0.25
				}
			},
			framerate : 20
		});

		createjs.SpriteSheetUtils.addFlippedFrames(localSpriteSheet, true,
				false, false);

		this.Sprite_initialize(localSpriteSheet);

		quaterFrameSize = this.spriteSheet.getFrame(0).rect.width / 4;

		// start playing the first sequence:
		this.gotoAndPlay("walk"); //animate

		// set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
		// of animated ghost if you disabled the shadow.
		//this.shadow = new createjs.Shadow("#000", 3, 2, 2);
		this.isInIdleMode = false;

		this.name = playerName;
		// 1 = right & -1 = left
		this.directionX = 0;
		// 1 = down & -1 = up
		this.directionY = 0;
		// velocity
		this.vX = 2;
		this.vY = 2;

		this.scaleX = this.scaleY = 0.75;

	}

	Player.prototype.tick = function() {
		if (this.alive && !this.isInIdleMode) {
			// Hit testing the screen width, otherwise our sprite would disappear
			// The player is blocked at each side but we keep the walk_right or walk_animation running
			if(this.CheckHitTest()){
				
			}else{
				// Moving the sprite based on the direction & the speed
				this.x += this.vX * this.directionX;
				this.y += this.vY * this.directionY;
			}
		}
	}
	
	Player.prototype.handleKeysDown = function(event){
		// 37 = Left
		// 38 = Up
		// 39 = Right
		// 40 = Down
		if(event.keyCode == KEYCODE_RIGHT || event.keyCode == KEYCODE_D) {
			this.directionX = 1;
		}else if(event.keyCode == KEYCODE_LEFT || event.keyCode == KEYCODE_A){
			this.directionX = -1;
		}else if(event.keyCode == KEYCODE_DOWN || event.keyCode == KEYCODE_S){
			this.directionY = 1;
		}else if(event.keyCode == KEYCODE_UP || event.keyCode == KEYCODE_W){
			this.directionY = -1;
		}
		
	}
	
	Player.prototype.handleKeysUp = function(event){
		// 37 = Left
		// 39 = Right
		if(event.keyCode == KEYCODE_RIGHT || event.keyCode == KEYCODE_D || event.keyCode == KEYCODE_LEFT || event.keyCode == KEYCODE_A) {
			this.directionX = 0;
		}
		if(event.keyCode == KEYCODE_DOWN || event.keyCode == KEYCODE_S || event.keyCode == KEYCODE_UP || event.keyCode == KEYCODE_W) {
			this.directionY = 0;
		}
	}
	
	Player.prototype.CheckHitTest = function(){
		var nextX = this.x + this.vX * this.directionX;
		var nextY = this.y + this.vY * this.directionY;
		if(this.directionX !== 0 || this.directionY !== 0 ){
			for(var i=0;i<maze.children.length;i++){
											
				var t = maze.getChildAt(i);
				var p = t.getBounds();
				
				var gT = maze.localToGlobal(t.x,t.y);
				//var lclPos = t.localToLocal(0,0,this);
				/*var leftestPos = maze.globalToLocal(nextX-quaterFrameSize,nextY);
				var rightestPos = maze.globalToLocal(nextX+quaterFrameSize,nextY);
				var uppestPos = maze.globalToLocal(nextX,nextY-quaterFrameSize);
				var lowestPos = maze.globalToLocal(nextX,nextY+quaterFrameSize);*/
				
				var hit = new createjs.Shape().set({x:gT.x, y:gT.y, regX:t.regX, regY:t.regY});
				console.log(t);
				console.log(hit);
				/*var hit = t.mask.clone();*/
				var color = "blue";
				if(i < 10){color = "red";}
				hit.color = hit.graphics.s(color).command;
				if(t.rotation == 90){
					hit.graphics.ss(3, "round")/*.sd([12,12]).f("#ddd")*/.dr(0,0,p.height,p.width);
				}else{
					hit.graphics.ss(3, "round")/*.sd([12,12]).f("#ddd")*/.dr(0,0,p.width,p.height);
				}
				
				stage.addChild(hit);
				//console.log(t.x + "-" + t.y);
				/*if(maze.hitTest()){
					console.log("Hit");
					//console.log(nextX + " - " + this.vX + " - " + this.directionX);
					//console.log("HIT:"+i+"-"+j);
					return true;
				}*/
			//}
			}
		}
		return false;
	}

	window.Player = Player;

})(window);