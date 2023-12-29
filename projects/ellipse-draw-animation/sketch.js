var points = [];

// cosmetics
var lineWeight = 5;
var pointWight = 12;

// sliders
var aSlider;
var bSlider;
var increaseSlider;

//
var forward = true;
var x;
var y;
var lineAStartX;
var lineBStartX;

function setup() {
	createCanvas(windowWidth, windowHeight);

	// create sliders
	aSlider = createSlider(100, 0.45 * width, 100, 20);
	aSlider.position(35, 5);
	bSlider = createSlider(100, 0.45 * height, 100, 20);
	bSlider.position(35, 30);
	increaseSlider = createSlider(0.1, 7, 0.1, 0.1);
	increaseSlider.position(35, 55);

	aSlider.input(resetGraph);
	bSlider.input(resetGraph);
	increaseSlider.input(resetGraph);

	x = -aSlider.value();

	updateFociPoints();
}

function draw() {
	scale(1, -1);
	translate(width / 2, -height / 2);

	drawCoordinateSystem();

	drawOldPoints();

	var a = aSlider.value();
	var b = bSlider.value();
	var coefficient = forward ? 1 : -1;
	y = coefficient * sqrt((pow(b, 2) * (pow(a, 2) - pow(x, 2))) / pow(a, 2));

	strokeWeight(lineWeight);
	stroke("#118ab2");
	line(lineAStartX, 0, x, y); // line A
	line(lineBStartX, 0, x, y); // line B

	strokeWeight(pointWight);
	stroke("#06d6a0");
	point(lineAStartX, 0); // line A start
	point(lineBStartX, 0); // line B start
	point(x, y); // intersect point
	points.push({ x: x, y: y });

	drawText();

	var increase = increaseSlider.value();

	if (x + increase > a) {
		forward = false;
	}

	if ((x - increase < -a) & !forward) {
		forward = true;
		drawCoordinateSystem();
		drawOldPoints();
		drawText();
		noLoop();
	}

	if (!forward) {
		increase *= -1;
	}
	x += increase;
}

function updateFociPoints() {
	let a = aSlider.value();
	let b = bSlider.value();
	let eccentricity = sqrt(1 - pow(b, 2) / pow(a, 2));
	lineAStartX = -1 * eccentricity * a;
	lineBStartX = eccentricity * a;
}

function drawCoordinateSystem() {
	background("white");
	stroke("#073b4c");
	strokeWeight(lineWeight);

	line(-width / 2, 0, width / 2, 0);
	line(0, -height / 2, 0, height / 2);
}

function resetGraph() {
	points = [];
	x = -aSlider.value();
	updateFociPoints();
	loop();
}

function drawOldPoints() {
	for (var i = 0; i < points.length; i++) {
		strokeWeight(pointWight);
		stroke("#06d6a0");
		point(points[i].x, points[i].y);
	}
}

function drawText() {
	var lineALength = round(sqrt(pow(x - lineAStartX, 2) + pow(y - 0, 2)), 3);
	var lineBLength = round(sqrt(pow(x - lineBStartX, 2) + pow(y - 0, 2)), 3);
	var linesSum = lineALength + lineBLength;

	strokeWeight(1);
	textSize(16);
	stroke("black");
	translate(-width / 2, height / 2);
	scale(1, -1);

	// slider labels
	text("a", 5, 20);
	text("b", 5, 45);
	text("inc", 5, 70);

	// slider values
	text(aSlider.value(), 180, 20);
	text(bSlider.value(), 180, 45);
	text(increaseSlider.value(), 180, 70);

	// line names and values
	text("line a: " + lineALength, 5, 120);
	text("line b: " + lineBLength, 5, 140);
	text("line sum: " + linesSum, 5, 160);
	scale(1, -1);
	translate(width / 2, -height / 2);
}
