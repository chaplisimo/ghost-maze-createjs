(function (window) {
	function Maze(mazeName, tileArray, width, height, x_end) {
		this.width = width;
		this.height = height;
        this.initialize(mazeName, tileArray, x_end);
    }
	
	Maze.prototype.tiles;
	
	Maze.prototype.width;
	Maze.prototype.height;
	
	Maze.prototype.labArray;
	
	//Maze.prototype.steps;
	
	
	Maze.prototype.initialize = function (mazeName, tileArray, x_end){
		this.tiles = new Array();
		
		var tile = new createjs.Bitmap(queue.getResult("I"));
		tile.regX = 32;
		tile.regY = 32;
		this.tiles.push(tile);
		
		tile = new createjs.Bitmap(queue.getResult("none"));
		tile.regX = 32;
		tile.regY = 32;
		this.tiles.push(tile);
		
		this.x_end = x_end;
		
		this.steps = "";
		
		this.GenerateMaze();
	}
	
	Maze.prototype.GenerateMaze = function(){
		this.labArray = new Array(this.width);
		for(var i=0;i<this.width;i++){
			this.labArray[i] = new Array(this.height);
			for(var j=0;j<this.height;j++){
				this.labArray[i][j] = {
									visited : false,
									north : null,
									south : null,
									east : null,
									west : null,
									printx : i,
									printy : j};
			}
		}
		
		var randomNum = Math.floor((Math.random() * this.width) + 0);
		
		this.connectMaze(randomNum,0,null);
		    
		//console.log(this.steps);
	}
	
	Maze.prototype.connectMaze = function(column,row,previousDirection){
		
		this.labArray[column][row].visited = true;
		
		//this.steps += "[" + (column+1) + "]" + "[" + (row+1) + "]";
		
		var neighbor = this.hasUnvisited(column, row);
		
		if(previousDirection != null){
			if(previousDirection == "north"){
				this.labArray[column][row].south = this.labArray[column][row-1];
			}else if(previousDirection == "south"){
				this.labArray[column][row].north = this.labArray[column][row+1];
			}else if(previousDirection == "east"){
				this.labArray[column][row].west = this.labArray[column-1][row];
			}else if(previousDirection == "west"){
				this.labArray[column][row].east = this.labArray[column+1][row];
			}
		}
		
		while(neighbor != null){
			if(neighbor.direction == "north"){
				this.labArray[column][row].north = this.labArray[column][row+1];
			}else if(neighbor.direction == "south"){
				this.labArray[column][row].south = this.labArray[column][row-1];
			}else if(neighbor.direction == "east"){
				this.labArray[column][row].east = this.labArray[column+1][row];
			}else if(neighbor.direction == "west"){
				this.labArray[column][row].west = this.labArray[column-1][row];
			}
			
			//this.steps += " => ";
			
			this.connectMaze(neighbor.column, neighbor.row,neighbor.direction);
			neighbor = this.hasUnvisited(column, row);
		}
		//this.steps += " STEP BACK \n";
	}
	
	Maze.prototype.hasUnvisited = function(column, row){
		var neighbours = [];
		
		if(column > 0 && this.labArray[column-1][row].visited == false){
			neighbours.push({
				column : column-1,
				row : row,
				direction : "west"
			});
		}
		if(column < this.width-1 && this.labArray[column+1][row].visited == false){
			neighbours.push({
				column : column+1,
				row : row,
				direction : "east"
			});
		}
		if(row > 0 && this.labArray[column][row-1].visited == false){
			neighbours.push({
				column : column,
				row : row-1,
				direction : "south"
			});
		}
		if(row < this.height-1 && this.labArray[column][row+1].visited == false){
			neighbours.push({
				column : column,
				row : row+1,
				direction : "north"
			});
		}
		
		var randomNum = Math.floor((Math.random() * neighbours.length) + 0);
		
		return neighbours[randomNum];
	}
	
	Maze.prototype.calculatePosition = function(xPos, yPos){
		var xRange = Math.floor(xPos / this.tiles[1].getBounds().width);
		var yRange = Math.floor(yPos / this.tiles[1].getBounds().height);
		//console.log("x: "+ xRange+" - y: "+yRange);
		//console.log("Bounds: "+ this.tiles[0].getBounds());
		return xRange < this.width && yRange < this.height ? this.labArray[xRange][yRange] : null;
	}

	
	window.Maze = Maze;
	
}(window));