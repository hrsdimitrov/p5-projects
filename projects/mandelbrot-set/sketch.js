var minSlider;
var maxSlider;

function setup() {
	createCanvas(windowHeight, windowHeight);

	minSlider = createSlider(-2.5, 0, -2.5, 0.01);
	minSlider.position(5, 10);
	maxSlider = createSlider(0, 2.5, 2.5, 0.01);
	maxSlider.position(5, 30);

	pixelDensity(1);
}

function draw() {
	loadPixels();

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var maxIterations = 100;

			var min = minSlider.value();
			var max = maxSlider.value();

			var cRealComponent = map(x, 0, width, min, max);
			var cComplexComponent = map(y, 0, height, min, max);
			var zRealComponent = cRealComponent;
			var zComplexComponent = cComplexComponent;

			var n;

			for (n = 0; n < maxIterations; n++) {
				var newZRealComponent =
					zRealComponent * zRealComponent -
					zComplexComponent * zComplexComponent;
				var newZComplexComponent =
					2 * zRealComponent * zComplexComponent;

				zRealComponent = newZRealComponent + cRealComponent;
				zComplexComponent = newZComplexComponent + cComplexComponent;

				if (pow(zRealComponent, 2) + pow(zComplexComponent, 2) > 16) {
					break;
				}
			}

			var pix = (x + y * width) * 4;

			var brightness = map(n, 0, maxIterations, 0, 255);

			if (n === 100) {
				brightness = 0;
			}

			pixels[pix] = brightness; //red
			pixels[pix + 1] = brightness; //green
			pixels[pix + 2] = brightness; //blue
			pixels[pix + 3] = 255; //alpha
		}
	}

	updatePixels();
}
