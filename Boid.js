class Boid {

    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = createVector(random(-2, 2), random(-2, 2));
        this.acceleration = createVector();
        this.maxSpeed = 5;
        this.maxForce = 0.05;
        this.size = 2;
        this.colour = [235, 100, 50];

    }

    edgeWrap() {
        if (this.position.x > width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = width;

        if (this.position.y > height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = height;
    }
    
    calculateColour(velocity) {
        
        let magnitude = velocity.mag();
        let hue = map(magnitude, 0, this.maxSpeed, 240, 100);
        return [hue, 100, 60];

    }

    show() {
        colorMode(HSL);

        this.colour = this.calculateColour(this.velocity);
        stroke(this.colour);
        fill(this.colour);
        push();
        translate(this.position.x, this.position.y)
        rotate(this.velocity.heading());
        triangle(-this.size, -this.size / 2, -this.size, this.size / 2, this.size, 0);
        
        pop();

    }

    flock() {

        let alignment = this.alignment(alignmentRadiusSlider.value());
        let cohesion = this.cohesion(cohesionRadiusSlider.value());
        let separation = this.separation(separationRadiusSlider.value());

        separation.mult(separationSlider.value());
        cohesion.mult(cohesionSlider.value());
        alignment.mult(alignmentSlider.value());
        
        if (this.getDistToMouse() < 75) {
            let mousePos = createVector(mouseX, mouseY);
            let fleeForce = this.separateFromPos(mousePos);
            this.acceleration.add(fleeForce);
        }

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    pointDirection(x1, y1, x2, y2) {
        angleMode(DEGREES);
        let xDiff = x2 - x1;
        let yDiff = y2 - y1;
        let hyp = sqrt((xDiff * xDiff) + (yDiff * yDiff));
        return asin(yDiff / hyp);
        

        
    }

    getDistToMouse() {
        return dist(this.position.x, this.position.y, mouseX, mouseY);
    }


    seek(seekPos) {
        let force = p5.Vector.sub(seekPos, this.position);
        force.setMag(this.maxSpeed);
        force.sub(this.velocity);
        force.limit(this.maxForce * 5);
        return force;

    }

    flee(fleePos) {
        let force = p5.Vector.sub(fleePos, this.position);
        force.setMag(this.maxSpeed);
        force.sub(this.velocity);
        force.limit(this.maxForce * 15);
        force.mult(-1);
        return force;
    }

    separateFromPos(pos) {
        let distance = dist(this.position.x, this.position.y, pos.x, pos.y);
        let force = p5.Vector.sub(this.position, pos);
        force.div(distance * distance);

        force.setMag(this.maxSpeed);
        force.sub(this.velocity);
        force.limit(this.maxForce * 6.5);

        return force;   
    }

    update() {
        // this.colour = this.calculatecolour();

        this.acceleration.set(0, 0);

        this.flock();
        // this.acceleration.limit(this.maxSpeed);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.edgeWrap();
        this.show();
    }

    alignment(alignmentRadius) {

        let total = 0;
        let steering = createVector();
        let range = new Circle(this.position.x, this.position.y, alignmentRadius);
        let points = qt.query(range);

        
        
        for (let point of points) {

            if (point.userData !== this) {
                steering.add(point.userData.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;

    }

    cohesion(cohesionRadius) {

        let total = 0;
        let steering = createVector();
        let range = new Circle(this.position.x, this.position.y, cohesionRadius);
        let points = qt.query(range);
        
        
        for (let point of points) {

            if (point.userData !== this) {
                steering.add(point.userData.position);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;

    }

    separation(separationRadius) {

        let total = 0;
        let steering = createVector();
        let range = new Circle(this.position.x, this.position.y, separationRadius);
        let points = qt.query(range);

        for (let point of points) {
            
            let XDiff = point.x - this.position.x;
            let YDiff = point.y - this.position.y;

            let distanceToBoid = sqrt((XDiff * XDiff) + (YDiff * YDiff));

            if (point.userData !== this) {
                let diff = p5.Vector.sub(this.position, point.userData.position);
                diff.div(distanceToBoid * distanceToBoid);
                steering.add(diff);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;

    }

}