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
    this.qfs;

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

        quaterFrameSize = this.spriteSheet.getFrame(0).rect.width / 2;
        this.qfs = quaterFrameSize;

        // start playing the first sequence:
        this.gotoAndPlay("walk");     //animate

        // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
        // of animated ghost if you disabled the shadow.
        this.shadow = new createjs.Shadow("#000", 3, 2, 2);

        this.name = ghostName;
        // 1 = right & -1 = left
        this.direction = 1;
        // velocity
        this.vX = 1;
        this.vY = 0;
        
        this.scaleX = 0.75;
        this.scaleY = 0.75;
        // starting directly at the first frame of the walk_h sequence
       // this.currentFrame = 21;
    }

    Ghost.prototype.mirrorSprite = function(){
    	if(this.currentAnimation == "walk"){
    		this.gotoAndPlay("walk_h");
    	}else{
    		this.gotoAndPlay("walk");
    	}
    }
    
    Ghost.prototype.tick = function () {
        if (!this.isInIdleMode) {
            // Moving the sprite based on the direction & the speed
            this.x += this.vX * this.direction;
            this.y += this.vY * this.direction;

            // Hit testing the screen width, otherwise our sprite would disappear
            if (this.x >= this.x_end - (quaterFrameSize + 1) || this.x < (quaterFrameSize + 1)) {
                this.mirrorSprite();
                this.idleWaitTicker = this.IDLEWAITTIME;
                this.isInIdleMode = true;
            }
            
        }
        else {
            this.idleWaitTicker--;

            if (this.idleWaitTicker == 0) {
                this.isInIdleMode = false;

                // Hit testing the screen width, otherwise our sprite would disappear
                if (this.x >= this.x_end - (quaterFrameSize + 1)) {
                    // We've reached the right side of our screen
                    // We need to walk left now to go back to our initial position
                    this.direction = -1;
                    this.mirrorSprite();
                }

                if (this.x < (quaterFrameSize + 1)) {
                    // We've reached the left side of our screen
                    // We need to walk right now
                    this.direction = 1;
                    this.mirrorSprite();
                }
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