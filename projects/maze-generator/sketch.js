var frameRateSlider;
var cellSizeSlider;

var gap = 40;
var topSpacing = 60;
var excessWidth = 0;
var excessHeight = 0;

var cols, rows;
var w = 40;

var grid = [];
var stack = [];
var currentCell;

function setup() {
	createCanvas(windowWidth, windowHeight);

	frameRateSlider = createSlider(1, 30, 30, 1);
	frameRateSlider.position(100, 5);
	cellSizeSlider = createSlider(15, 100, 40, 5);
	cellSizeSlider.position(100, 30);

	cellSizeSlider.input(initializeGrid);

	initializeGrid();
}

function draw() {
	background("#333333");

	strokeWeight(1);
	textSize(14);
	fill("white");
	stroke("white");

	text("Frame rate: ", 20, 20);
	text(frameRateSlider.value(), 240, 20);
	text("Cell size: ", 20, 45);
	text(cellSizeSlider.value(), 240, 45);

	frameRate(frameRateSlider.value());

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			grid[i][j].draw();
		}
	}

	currentCell.visited = true;
	currentCell.highlight();
	var next = currentCell.getRandomNotVisitedNeighbor();

	if (next) {
		var nextCell = next.cell;
		var nextPosition = next.position;

		stack.push(currentCell);

		nextCell.visited = true;
		removeWalls(currentCell, nextCell, nextPosition);
		currentCell = nextCell;
	} else if (stack.length > 0) {
		currentCell = stack.pop();
	}
}

function initializeGrid() {
	w = cellSizeSlider.value();
	stack = [];

	cols = floor((windowWidth - gap) / w);
	rows = floor((windowHeight - gap - topSpacing) / w);

	excessWidth = (windowWidth - gap) % w;
	excessHeight = (windowHeight - gap - topSpacing) % w;

	for (var i = 0; i < rows; i++) {
		grid[i] = [];
		for (var j = 0; j < cols; j++) {
			grid[i][j] = new Cell(i, j);
		}
	}

	currentCell = grid[0][0];
	grid[0][0].left = false;
	grid[rows - 1][cols - 1].right = false;
}

function removeWalls(currentCell, nextCell, position) {
	if (position == "top") {
		currentCell.top = false;
		nextCell.bottom = false;
	}

	if (position == "bottom") {
		currentCell.bottom = false;
		nextCell.top = false;
	}

	if (position == "left") {
		currentCell.left = false;
		nextCell.right = false;
	}

	if (position == "right") {
		currentCell.right = false;
		nextCell.left = false;
	}
}

function Cell(row, col) {
	this.row = row;
	this.col = col;

	this.x = this.col * w + gap / 2 + excessWidth / 2;
	this.y = this.row * w + gap / 2 + topSpacing + excessHeight / 2;

	this.top = true;
	this.bottom = true;
	this.left = true;
	this.right = true;

	this.visited = false;

	this.draw = function () {
		if (this.visited) {
			noStroke();
			fill("#495057");
			rect(this.x, this.y, w, w);
		}

		stroke("white");
		strokeWeight(2);

		this.top ? line(this.x, this.y, this.x + w, this.y) : null;
		this.left ? line(this.x, this.y, this.x, this.y + w) : null;
		this.right ? line(this.x + w, this.y, this.x + w, this.y + w) : null;
		this.bottom ? line(this.x, this.y + w, this.x + w, this.y + w) : null;
	};

	this.getRandomNotVisitedNeighbor = function () {
		var neighbors = [];
		var neighbor;

		// top
		if (this.row > 0) {
			neighbor = grid[row - 1][col];
			neighbor.visited
				? null
				: neighbors.push({ cell: neighbor, position: "top" });
		}
		//bottom
		if (this.row < rows - 1) {
			neighbor = grid[row + 1][col];
			neighbor.visited
				? null
				: neighbors.push({ cell: neighbor, position: "bottom" });
		}
		//left
		if (this.col > 0) {
			neighbor = grid[row][col - 1];
			neighbor.visited
				? null
				: neighbors.push({ cell: neighbor, position: "left" });
		}
		//right
		if (this.col < cols - 1) {
			neighbor = grid[row][col + 1];
			neighbor.visited
				? null
				: neighbors.push({ cell: neighbor, position: "right" });
		}

		if (neighbors.length > 0) {
			var r = floor(random(0, neighbors.length));
			return neighbors[r];
		}

		return undefined;
	};

	this.highlight = function () {
		noStroke();
		fill("#06d6a0");
		rect(this.x + 4, this.y + 4, w - 8, w - 8);
	};
}
