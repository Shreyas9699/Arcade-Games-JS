const canvas = document.getElementById('gameBox');
const win = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
let cellSize = 20; // Size of each cell in the grid

// Calculate the number of rows and columns in the maze
let rows = Math.floor(height / cellSize);
let columns = Math.floor(width / cellSize);

function blankCanvas() {
	win.fillStyle = 'white';
	win.fillRect(0, 0, width, height);
}

function shuffle(array) {
	for(let i = array.length-1; i > 0; --i) {
		let n = Math.floor(Math.random() * i);
		[array[i], array[n]] = [array[n], array[i]];
	}
	return array;
}

//a call cell to store all required details of an individual cell in the maze
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbours = {};
        this.top =true;
        this.right = true;
        this.bottom = true;
        this.left = true;
    }

    tunnelTo(cell) {
			if(this.neighbours.north == cell) {
				this.top = false;
				this.neighbours.north.bottom = false;
			}

			if(this.neighbours.south == cell) {
				this.bottom = false;
				this.neighbours.south.top = false;
			}

			if(this.neighbours.west == cell) {
				this.left = false;
				this.neighbours.west.right = false;
			}

			if(this.neighbours.east == cell) {
				this.right = false;
				this.neighbours.east.left = false;
			}
    }

    draw() {
        // win.lineWidth = 3;
        win.strokeStyle = "black";

		if(this.left) {
			win.moveTo(this.x*cellSize, this.y*cellSize);
			win.lineTo(this.x*cellSize, this.y*cellSize + cellSize);
		}

		if(this.bottom) {
			win.moveTo(this.x*cellSize, this.y*cellSize + cellSize);
			win.lineTo(this.x*cellSize + cellSize, this.y*cellSize + cellSize);
		}

		if(this.right) {
			win.moveTo(this.x*cellSize + cellSize, this.y*cellSize + cellSize);
			win.lineTo(this.x*cellSize + cellSize, this.y*cellSize);
		}

		if(this.top) {
			win.moveTo(this.x*cellSize + cellSize, this.y*cellSize);
			win.lineTo(this.x*cellSize, this.y*cellSize);
		}
		
		win.stroke();
    }

    point(data) {
        win.fillStyle = data.color;
        win.fillRect(data.posX * cellSize, data.posY * cellSize, cellSize, cellSize);
    }
};

class Maze {
    constructor(r, c) {
        // this.size = size;
        this.rows = r;
        this.cols = c;
        this.cells = [];
        this.start = {};
        this.end = {};

        for (let col = 0; col < this.cols; col++) {
            this.cells.push([]);
            for (let row = 0; row < this.rows; row ++){
                this.cells[this.cells.length-1].push(new Cell(row, col));
            }
        }

        for (let y = 0; y < this.cols; ++y) {
			for (let x = 0; x < this.rows; ++x) {
                this.cells[y][x].neighbours = {
					'north': y==0 ? null : this.cells[y-1][x],
					'south': y==this.cols - 1 ? null : this.cells[y+1][x],
					'east': x==this.rows - 1 ? null : this.cells[y][x+1],
					'west': x==0 ? null : this.cells[y][x-1],
				}
            }
        }
    }

    at(x, y) {
        return this.cells[x][y];
    }

    draw() {
		blankCanvas();
		for (let y = 0; y < this.cols; ++y) {
			for (let x = 0; x < this.rows; ++x) {
				this.cells[y][x].draw();
			}
		}

        // Maze start point
        let startX = Math.floor(Math.random() * this.rows);
        let startY = 0;
        this.start = this.cells[startX][startY];
        this.cells[startX][startY].point({
            color: 'green',
            posX: startX,
            posY: startY
        });

        // Maze end point
        let endX = Math.floor(Math.random() * this.rows);
        let endY = this.cols - 1;
        this.end = this.cells[endX][endY];
        this.cells[endX][endY].point({
            color: 'red',
            posX: endX,
            posY: endY
        });
	}


    generateDepthFirst(cell = this.at(0, 0), visited=[]) {
        // mark current cell as visited.
        visited.push(cell);

        // choose from neighbours randomly.
        let directions = shuffle(['north', 'south', 'east', 'west']);

        for(let i = 0; i < 4; i++) {
            let neighbour = cell.neighbours[directions[i]];

            // neighbour exists and has not been visited?
            if(neighbour != null && !visited.includes(neighbour)) {
                // then tunnel and recursively call ourselves.
                cell.tunnelTo(neighbour);
                this.generateDepthFirst(neighbour, visited);
            }
        }
    }
};

function start() {
    blankCanvas()
    maze = new Maze(rows, columns);
    console.log(maze);
    console.log("callinf DFS Function");
    maze.generateDepthFirst();
    maze.draw();
    console.log("End of DFS Function, the maze is ready now!");
}

function refresh(){
	window.location.reload("Reload");
  }

start();