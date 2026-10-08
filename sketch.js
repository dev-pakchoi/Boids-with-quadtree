// BOIDS
const boids = [];
const numBoids = 1000;

const backgroundColour = 30;
const boidBaseColour = [200, 14, 70];

let cohesionSlider, alignmentSlider, separationSlider;
let cohesionRadiusSlider, alignmentRadiusSlider, separationRadiusSlider;

// QUADTREE
let qt;

function setup() {
  createCanvas(1400, 800);
  


  let min = 0;
  let max = 10;
  let step = 0.001;

  alignmentSlider = createSlider(min, max, 1, step);
  cohesionSlider = createSlider(min, max, 3, step);
  separationSlider = createSlider(min, 10, 6, step);

  let RadiusMin = 0;
  let RadiusMax = 200;
  let RadiusStep = 0.01;

  alignmentRadiusSlider = createSlider(RadiusMin, RadiusMax, 5, RadiusStep);
  cohesionRadiusSlider = createSlider(RadiusMin, RadiusMax, 6, RadiusStep);
  separationRadiusSlider = createSlider(RadiusMin, RadiusMax, 15, RadiusStep);
  createP("Alignment Strength | Cohesion Strength | Separation Strength | _Alignment Radius |  Cohesion Radius_ | Separation Radius |")


  for (let i = 0; i < numBoids; i++) {
    boids.push(new Boid());
  }


}

function draw() {
  colorMode(RGB);
  background(0);
  
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  qt = new Quadtree(boundary, 10);
  
  for (let boid of boids) {
    p = new Point(boid.position.x, boid.position.y, boid);
    qt.insert(p);
  }
  qt.show();
  strokeWeight(3);
  for (let boid of boids) {
    boid.update();
  }
  
  fill(255);
  textSize(20);
  text("FPS: " + Math.round(frameRate()), 10, 25);
  
}