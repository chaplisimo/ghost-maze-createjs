var canvas;
var stage;
var queue;

var screen_width;
var screen_height;

var x,y;

var player;

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
    queue.loadFile({id:"ghost", src:"./img/Ghost_alpha.PNG"});
    queue.loadManifest([//{id:"L", src:"./img/L.png"},
                        //{id:"II", src:"./img/II.PNG"},
    					{id:"I", src:"./img/I_cut.PNG"},
    					//{id:"U", src:"./img/U.PNG"},
    					{id:"none", src:"./img/none.PNG"}
                        ]);
}

function startGame() {
	//Math.seedrandom('hello.');
    
	DrawMaze();
	
	SpawnGhosts();
    
	player = new Player("Player", queue.getResult("ghost"));
	player.x = 96;
	player.y = 96;
	stage.addChild(player);
	
	document.onkeydown = function(e){player.handleKeysDown(e)};
	document.onkeyup = function(e){player.handleKeysUp(e)};
	
    //we want to do some work before we update the canvas,
    //otherwise we could use Ticker.addListener(stage);
    createjs.Ticker.addEventListener("tick",tick);
    //Best Framerate targeted (60 FPS)
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
}


function tick(event) {
    // looping inside the Ghosts collection
   for (ghost in Ghosts) {
        var g = Ghosts[ghost];
        // Calling explicitly each tick method 
        // to launch the update logic of each monster
        g.currentTile = aLab.calculatePosition(g.x,g.y);
        
        g.tick();
    }
   player.tick();
   
   
 // update the stage:
    stage.update();
}

function SpawnGhosts(){
	//Our Ghosts collection
    Ghosts = new Array();

    // Creating the first type of monster
    /*Ghosts[0] = new Ghost("GhostA", queue.getResult("ghost"), screen_width);
    Ghosts[0].x = 32;
    Ghosts[0].y = 32;*/
    
    /*Ghosts[1] = new Ghost("GhostB", queue.getResult("ghost"), screen_width);
    Ghosts[1].x = 224;
    Ghosts[1].y = 224;*/
    
    stage.addChild(Ghosts[0]);
    //stage.addChild(Ghosts[1]);
}

var maze;
//var aLab;
function DrawMaze(){
	//tilesArray = ["L","II","I","U","none"];
	tilesArray = ["I","none"];
	aLab = new Maze("MAZE", tilesArray, this.x, this.y, screen_width);
	
	 maze = new createjs.Container();
	
	for(var j=0; j<this.y; j++){
//		var consLog = "";
		for(var i=0; i<this.x; i++){
			var aTile;
			if(aLab.labArray[i][j].north == null){
				aTile = aLab.tiles[0].clone();
				aTile.x = aTile.regX * 2 * i + aTile.regX;
				aTile.y = aTile.regY * 2 * j + aTile.regY;
				aTile.rotation = -90;
				maze.addChild(aTile);
			}
			if(j == 0 && aLab.labArray[i][j].south == null){
				aTile = aLab.tiles[0].clone();
				aTile.x = aTile.regX * 2 * i + aTile.regX;
				aTile.y = aTile.regY * 2 * j+ aTile.regY;
				aTile.rotation = 90;
				maze.addChild(aTile);
			}
			if(i == 0 && aLab.labArray[i][j].west == null){
				aTile = aLab.tiles[0].clone();
				aTile.x = aTile.regX * 2 * i+ aTile.regX;
				aTile.y = aTile.regY * 2 * j +aTile.regY;
				maze.addChild(aTile);
			}
			if(aLab.labArray[i][j].east == null){
				aTile = aLab.tiles[0].clone();
				aTile.x = aTile.regX * 2 * i+ aTile.regX;
				aTile.y = aTile.regY * 2 * j +aTile.regY;
				aTile.rotation = 180;
				maze.addChild(aTile);
			}
		
			aLab.labArray[i][j] = $.extend(aLab.labArray[i][j],aTile);
			//maze.addChild(aTile);
		}
//		console.log(consLog);
	}
	
	stage.addChild(maze);
}