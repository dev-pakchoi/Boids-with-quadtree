class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h)
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(point) {
        let xDiff = point.x - this.x;
        let yDiff = point.y - this.y;
        let distanceToPoint = sqrt((xDiff * xDiff) + (yDiff * yDiff));
        return distanceToPoint <= this.r;
    }

    intersects(range) {

        let xDist = Math.abs(range.x - this.x);
        let yDist = Math.abs(range.y - this.y);

        let edges = Math.pow((xDist - range.w), 2) + Math.pow((yDist - range.h), 2);

        if (xDist > (this.r + range.w) || yDist > (this.r + range.h)) {
            return false;
        }

        if (xDist <= range.w || yDist < range.h) {
            return true;
        }

        return edges <= this.rSquared;
    }
}

class Quadtree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let halfW = this.boundary.w / 2;
        let halfH = this.boundary.h / 2;


        let tr = new Rectangle(x + halfW, y - halfH, halfW, halfH);
        let tl = new Rectangle(x - halfW, y - halfH, halfW, halfH);
        let br = new Rectangle(x + halfW, y + halfH, halfW, halfH);
        let bl = new Rectangle(x - halfW, y + halfH, halfW, halfH);

        this.topLeft = new Quadtree(tl, this.capacity);
        this.topRight = new Quadtree(tr, this.capacity);
        this.bottomLeft = new Quadtree(bl, this.capacity);
        this.bottomRight = new Quadtree(br, this.capacity);

        this.divided = true;
    }

    insert(point) {

        if (!this.boundary.contains(point)) {
            return false;
        }


        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else { // at capacity

            if (!this.divided) {
                this.subdivide();

            }

            if (this.topLeft.insert(point)) return true;
            if (this.topRight.insert(point)) return true;
            if (this.bottomLeft.insert(point)) return true;
            if (this.bottomRight.insert(point)) return true;

        }
    }

    query(range, found) {

        if (!found) {
            found = [];
        }
        
        if (!range.intersects(this.boundary)) {
            return;
        } else {
            for (let p of this.points) {
                
                if (range.contains(p)) {
                    found.push(p);
                }
            }

            if (this.divided) {
                this.topLeft.query(range, found);
                this.topRight.query(range, found);
                this.bottomLeft.query(range, found);
                this.bottomRight.query(range, found);

            }
        }
     
        return found
    }

    show() {
        rectMode(CENTER);
        stroke(221,16,355);
        noFill();
        strokeWeight(1);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        if (this.divided) {
            this.topLeft.show();
            this.topRight.show();
            this.bottomLeft.show();
            this.bottomRight.show();
        }


    }
}