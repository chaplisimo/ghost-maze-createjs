var canvas;
var stage;
var queue;

var screen_width;
var screen_height;

var x,y;

function init(x,y) {
	this.x = x;
	this.y = y;
    //find canvas and load images, wait for last image to load
    canvas = document.getElementById("demoCanvas");

    // create a new stage and point it at our canvas:
    stage = new createjs.Stage(canvas);
    // grab canvas width and height for later calculations:
    screen_width = canvas.width;
    screen_height = canvas.height;

    queue = new createjs.LoadQueue();
    queue.on("complete", startGame, this);
    queue.loadFile({id:"ghost", src:"https://github.com/chaplisimo/ghost-maze-createjs/blob/master/img/Ghost_alpha.PNG"});
    queue.loadManifest([{id:"L", src:"https://github.com/chaplisimo/ghost-maze-createjs/blob/master/img/L.png"},
                        {id:"II", src:"https://github.com/chaplisimo/ghost-maze-createjs/blob/master/img/II.PNG"},
    					{id:"I", src:"https://github.com/chaplisimo/ghost-maze-createjs/blob/master/img/I.PNG"},
    					{id:"U", src:"https://github.com/chaplisimo/ghost-maze-createjs/blob/master/img/U.PNG"},
    					{id:"none", src:"https://github.com/chaplisimo/ghost-maze-createjs/blob/master/img/none.PNG"}
                        ]);
}

function startGame() {
	Math.seedrandom('hello.');
    
	DrawMaze();
	
	SpawnGhosts();
    
    //we want to do some work before we update the canvas,
    //otherwise we could use Ticker.addListener(stage);
    createjs.Ticker.addEventListener("tick",tick);
    //Best Framerate targeted (60 FPS)
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}

function tick() {
    // looping inside the Ghosts collection
   for (ghost in Ghosts) {
        var g = Ghosts[ghost];
        // Calling explicitly each tick method 
        // to launch the update logic of each monster
        g.tick();
        
        /*var t = g.globalToLocal(stage.mouseX, stage.mouseY);
        if(g.hitTest(t.x,t.y)){
			console.log("HIT");
		}*/
        aLab.hitWall(g);
    }
   
 // update the stage:
    stage.update();
}

function SpawnGhosts(){
	//Our Ghosts collection
    Ghosts = new Array();

    // Creating the first type of monster
    Ghosts[0] = new Ghost("GhostA", queue.getResult("ghost"), screen_width);
    Ghosts[0].x = 32;
    Ghosts[0].y = 32;
    
    stage.addChild(Ghosts[0]);
}

function DrawMaze(){
	tilesArray = ["L","II","I","U","none"];
	aLab = new Maze("MAZE", tilesArray, this.x, this.y, screen_width);
	
	//document.body.appendChild(queue.getResult("amaze"));
	var maze = new createjs.Container();
	
	for(var j=(this.y-1); j>=0; j--){
	//
	var i = 0;
//		var consLog = "";
		for(var i=0; i<this.x; i++){
			var aTile;
			var direction = 0;
			if(aLab.labArray[i][j].north != null){
				direction |= 0b0001;
			}
			if(aLab.labArray[i][j].south != null){
				direction |= 0b0010;
			}
			if(aLab.labArray[i][j].west != null){
				direction |= 0b0100;
			}
			if(aLab.labArray[i][j].east != null){
				direction |= 0b1000;
			}
			
			switch (direction){
				case 0 : { //NONE
					aTile = aLab.tiles[4].clone();
//					consLog += "(00)";
					break;
					}
				case 1 : { //N
					aTile = aLab.tiles[3].clone();
					aTile.rotation = 180;
//					consLog += "(01)";
					break;
					}
				case 2 : { //S
					aTile = aLab.tiles[3].clone();
//					consLog += "(02)";
					break;
					}
				case 3 : { //NS
					aTile = aLab.tiles[1].clone();
//					consLog += "(03)";
					break;
					}
				case 4 : { //W
					aTile = aLab.tiles[3].clone();
					aTile.rotation = 90;
//					consLog += "(04)";
					break;
					}
				case 5 : { //NW
					aTile = aLab.tiles[0].clone();
					aTile.rotation = 180;
//					consLog += "(05)";
					break;
					}
				case 6 : { //SW
					aTile = aLab.tiles[0].clone();
					aTile.rotation = 90;
//					consLog += "(06)";
					break;
					}
				case 7 : { //NWS
					aTile = aLab.tiles[2].clone();
					aTile.rotation = 180;
//					consLog += "(07)";
					break;
					}
				case 8 : { //E
					aTile = aLab.tiles[3].clone();
					aTile.rotation = -90;
//					consLog += "(08)";
					break;
					}
				case 9 : { //NE
					aTile = aLab.tiles[0].clone();
					aTile.rotation = -90;
//					consLog += "(09)";
					break;
					}
				case 10 : { //SE
					aTile = aLab.tiles[0].clone();
//					consLog += "(10)";
					break;
					}
				case 11 : { //NES
					aTile = aLab.tiles[2].clone();
//					consLog += "(11)";
					break;
					}
				case 12 : { //WE
					aTile = aLab.tiles[1].clone();
					aTile.rotation = 90;
//					consLog += "(12)";
					break;
					}
				case 13 : { //WNE
					aTile = aLab.tiles[2].clone();
					aTile.rotation = -90;
//					consLog += "(13)";
					break;
					}
				case 14 : { //WSE
					aTile = aLab.tiles[2].clone();
					aTile.rotation = 90;
//					consLog += "(14)";
					break;
					}
				case 15 : {
					aTile = aLab.tiles[4].clone();
//					consLog += "(15)";
					break;
					}
				}
			aTile.x = aTile.regX * 2 * i +aTile.regX ;//+ i * 10;
			aTile.y = aTile.regY * 2 * (this.y-1-j) +aTile.regY; // + (4-j) * 10;
			aLab.labArray[i][j] = aTile;
			maze.addChild(aTile);
		}
//		console.log(consLog);
	}
	
	stage.addChild(maze);
}
