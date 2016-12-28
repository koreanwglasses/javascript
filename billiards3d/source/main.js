var Bounds = function(left, bottom, back, right, top, front) {
    this.left = left;
    this.bottom = bottom;
    this.back = back;
    this.right = right;
    this.top = top;
    this.front = front;
}

var Physics = (function() {
    var collisionK = 0.8;
    var bounceK = 0.75;
    var ug = 1.9;

    var bounds = new Bounds(-25,-25,-25,25,25,25);

    var Ball = function() {
        this.radius = 1;
        this.mass = 1;
        this.position = new THREE.Vector3(0,0,0);
        this.velocity = new THREE.Vector3(0,0,0);
    }

    Ball.prototype.update = function(step) {
        // Bounce

        if(this.position.x - this.radius < bounds.left) {
            this.position.x = bounds.left + this.radius;
            this.velocity.x = -bounceK * this.velocity.x;
        }
        if(this.position.x + this.radius > bounds.right) {
            this.position.x = bounds.right - this.radius;
            this.velocity.x = -bounceK * this.velocity.x;
        }
        if(this.position.y - this.radius < bounds.bottom) {
            this.position.y = bounds.bottom + this.radius;
            this.velocity.y = -bounceK * this.velocity.y;
        }
        if(this.position.y + this.radius > bounds.top) {
            this.position.y = bounds.top - this.radius;
            this.velocity.y = -bounceK * this.velocity.y;
        }
        if(this.position.z - this.radius < bounds.back) {
            this.position.z = bounds.back + this.radius;
            this.velocity.z = -bounceK* this.velocity.z;
        }
        if(this.position.z + this.radius > bounds.front) {
            this.position.z = bounds.front - this.radius;
            this.velocity.z = -bounceK *    this.velocity.z;
        }

        // Friction

        var fricAcc = this.velocity.clone().normalize().multiplyScalar(-ug);
        var newVel = this.velocity.clone().addScaledVector(fricAcc, step);
        if(newVel.dot(fricAcc) < 0) {
            this.velocity.copy(newVel);
        } else {
            this.velocity.set(0,0,0);
        }

        // Movement

        this.position.addScaledVector(this.velocity, step);
    }

    var balls = [];
    balls.push(new Ball());
    balls[0].velocity.set(20,2,1);
    balls.push(new Ball());
    balls[1].position.set(10,0,0);

    var update = function(step) {
        for(i = 0; i < balls.length; i++) {
            for(j = i + 1; j < balls.length; j++) {
                if(balls[i].position.distanceTo(balls[j].position) <= balls[i].radius + balls[j].radius) {
                    var dr = balls[i].position.clone().sub(balls[j].position);
                    var p1 = balls[i].velocity.clone().multiplyScalar(balls[i].mass);
                    var p2 = balls[j].velocity.clone().multiplyScalar(balls[j].mass);
                    var dp = p2.clone().sub(p1); 

                    var I = dr.clone().multiplyScalar(collisionK * dp.dot(dr) / dr.lengthSq());
                    var p4 = p2.clone().sub(I);
                    var p3 = p1.clone().add(I);

                    balls[i].velocity.copy(p3.divideScalar(balls[i].mass));
                    balls[j].velocity.copy(p4.divideScalar(balls[j].mass));

                    var disp = (balls[i].radius + balls[j].radius - dr.length()) / (2 * dr.length());
                    balls[i].position.addScaledVector(dr, disp)
                    balls[j].position.addScaledVector(dr, -disp)
                } 
            }
        }
        for(i = 0; i < balls.length; i++) {
            balls[i].update(step);
        }
    }

    return {balls: balls, update: update};
})();

var Graphics = (function(physics) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var light = new THREE.AmbientLight(0x55504B);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffefe0, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0 });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    var sphere2 = new THREE.Mesh(geometry, material);
    scene.add(sphere2);

    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var cube = new THREE.Mesh(geometry);
    var box = new THREE.BoxHelper(cube, 0xffffff);
    scene.add(box);

    camera.position.z = 50;

    var balls = physics.balls;
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);

        physics.update(1.0/60.0);
        sphere.position.copy(balls[0].position);
        sphere2.position.copy(balls[1].position);
        // console.log(balls[0].velocity);
    }
    render();

    return {camera: camera}
})(Physics);

var Input = (function (document, graphics, physics) {
    var camera = graphics.camera;

    var isMouseDown = false;
    var mouseX_0 = 0;
    var mouseY_0 = 0;
    var theta_0 = 0;
    var phi_0 = 0;

    document.onmousedown = function(e) {
        isMouseDown = true;

        mouseX_0 = e.clientX;
        mouseY_0 = e.clientY;

        theta_0 = Math.atan2(camera.position.z, camera.position.x);
        phi_0 = Math.atan2(Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z), camera.position.y);
    }

    document.onmousemove = function(e) {
        if (isMouseDown) {
            DMouseX = e.clientX - mouseX_0;
            DMouseY = e.clientY - mouseY_0;

            theta = theta_0 + 0.01 * DMouseX;
            phi = phi_0 - 0.01 * DMouseY;
            if(phi < 0.01) phi = 0.01;
            if(phi > Math.PI) phi = Math.PI;

            r = 50;

            camera.position.x = r * Math.sin(phi) * Math.cos(theta);
            camera.position.y = r * Math.cos(phi);
            camera.position.z = r * Math.sin(phi) * Math.sin(theta);

            camera.up = new THREE.Vector3(0, 1, 0);
            camera.lookAt(new THREE.Vector3(0,0,0));
        }
    }

    document.onmouseup = function() {
        isMouseDown = false;
    }

    document.onkeypress = function(e) {
        if(String.fromCharCode(e.keyCode) == ' ') {
            physics.balls[0].velocity.copy(camera.position.clone().sub(physics.balls[0].position).normalize().multiplyScalar(-25));
        }
    }
})(document, Graphics, Physics);