(function (window) {
    function Ghost(ghostName, imgGhost, x_end) {
        this.initialize(ghostName, imgGhost, x_end);
    }
    Ghost.prototype = new createjs.Sprite();

    // public properties:
    Ghost.prototype.IDLEWAITTIME = 40;
    Ghost.prototype.bounds = 0; //visual radial size
    Ghost.prototype.hit = 0;     //average radial disparity

    // constructor:
    Ghost.prototype.Sprite_initialize = Ghost.prototype.initialize; //unique to avoid overiding base class

    // variable members to handle the idle state
    // and the time to wait before walking again
    this.isInIdleMode = false;
    this.idleWaitTicker = 0;

    var quaterFrameSize;

    Ghost.prototype.initialize = function (ghostName, imgGhost, x_end) {
        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgGhost], //image to use
            frames: {width: 64, height: 64, regX: 32, regY: 32},
            animations: {
                walk: {frames : [0,1,2,1],
                		speed : 0.25
                		}
                },
            framerate : 10
            });

        createjs.SpriteSheetUtils.addFlippedFrames(localSpriteSheet, true, false, false);

        this.Sprite_initialize(localSpriteSheet);
        this.x_end = x_end;

        quaterFrameSize = this.spriteSheet.getFrame(0).rect.width / 4;

        // start playing the first sequence:
        this.gotoAndPlay("walk");     //animate

        // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
        // of animated ghost if you disabled the shadow.
        //this.shadow = new createjs.Shadow("#000", 3, 2, 2);

        this.name = ghostName;
        // 1 = right & -1 = left
        this.directionX = 1;
        // 1 = down & -1 = up
        this.directionY = 0;
        // velocity
        this.vX = 1;
        this.vY = 1;
        
        this.scaleX = 0.75;
        this.scaleY = 0.75;
        
        // starting directly at the first frame of the walk_h sequence
       // this.currentFrame = 21;
    }

    Ghost.prototype.directionSprite = function(){
    	if(this.directionX == 1){
    		this.gotoAndPlay("walk");
    	}else if(this.directionX == -1){
    		this.gotoAndPlay("walk_h");
    	}
    }

    Ghost.prototype.currentTile;
    this.lastTile;
    
    Ghost.prototype.tick = function () {
   	
        if (!this.isInIdleMode) {
            // Moving the sprite based on the directionX & the speed
            this.x += this.vX * this.directionX;
            this.y += this.vY * this.directionY;

            var directions = [];

            if(this.currentTile != null && this.currentTile != this.lastTile
            		&& this.x < (this.currentTile.x + 4) 
            		&& this.x > (this.currentTile.x - 4)
            		&& this.y < (this.currentTile.y + 4) 
            		&& this.y > (this.currentTile.y - 4)){
            	
            	//Current Tile
            	//console.log("x: "+this.currentTile.printx +" - y: "+this.currentTile.printy );
            	
            	if(this.currentTile.north != null){directions.push({x:0,y:1});}
            	if(this.currentTile.south != null){directions.push({x:0,y:-1});}
            	if(this.currentTile.east != null){directions.push({x:1,y:0});}
            	if(this.currentTile.west != null){directions.push({x:-1,y:0});}
            	
            	var oppositeDirection = -1;
            	if(directions.length > 1){
            		for(var d=0;d<directions.length;d++){
            			if((this.directionX!= 0 && directions[d].x == this.directionX*-1) || (this.directionY!= 0 && directions[d].y == this.directionY*-1)){
            				oppositeDirection = d;
						}
            		}
        		}
            	
            	if(oppositeDirection != -1){directions.splice(oppositeDirection,1); }
            	
            	var r =  Math.floor(Math.random() * directions.length);
            	
            	this.directionX = directions[r].x;
            	this.directionY = directions[r].y;
            	
            	this.directionSprite();
            	
            	this.lastTile = this.currentTile;
            }
            
        }
        

    }

    Ghost.prototype.hitPoint = function (tX, tY) {
        return this.hitRadius(tX, tY, 0);
    }

    Ghost.prototype.hitRadius = function (tX, tY, tHit) {
        //early returns speed it up
        if (tX - tHit > this.x + this.hit) { return; }
        if (tX + tHit < this.x - this.hit) { return; }
        if (tY - tHit > this.y + this.hit) { return; }
        if (tY + tHit < this.y - this.hit) { return; }

        //now do the circle distance test
        return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2));
    }

    window.Ghost = Ghost;
} (window));