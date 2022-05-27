"use strict";

class MenuBgAnimation {
  width = 1236;
  height = 1236;
  fps = 60;
  now;
  then;
  elapsed;

  constructor() {
    this.canvas = document.querySelector(".menu > .background");

    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 3;
    this.ctx.imageSmoothingEnabled = false;

    this.startAnimation();
  }

  animate(newtime) {
    this.animation = window.requestAnimationFrame(this.animate.bind(this));

    this.now = newtime;
    this.elapsed = this.now - this.then;

    if (this.elapsed > this.fpsInterval) {
      this.then = this.now - (this.elapsed % this.fpsInterval);

      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < shapes.length; i++) {
        shapes[i].move(this.width, this.height);
        shapes[i].draw(this.ctx);
      }
    }
  }

  startAnimation() {
    this.fpsInterval = 1000 / this.fps;
    this.then = window.performance.now();
    this.startTime = this.then;
    this.animation = window.requestAnimationFrame(this.animate.bind(this));
  }

  stopAnimation() {
    window.cancelAnimationFrame(this.animation);
  }
}

class Shape {
  constructor(line_color, vertex_color, vertices) {
    this.line_color = line_color;
    this.vertex_color = vertex_color;
    this.vertices = vertices;

    this.vector = {
      x: roundNumber(randomNumber(-0.3, 0.3), 3),
      y: roundNumber(randomNumber(-0.3, 0.3), 3),
    };

    this.rotate_deg = roundNumber(randomNumber(-0.3, 0.3), 3);
    this.rotate = roundNumber(randomNumber(-1, 1), 3) > 0 ? 1 : -1;

    let sum_vertices_x = 0;
    let sum_vertices_y = 0;

    for (let j = 0; j < vertices.length; j++) {
      sum_vertices_x += vertices[j][0];
      sum_vertices_y += vertices[j][1];
    }

    this.center = {
      x: roundNumber(sum_vertices_x / vertices.length, 2),
      y: roundNumber(sum_vertices_y / vertices.length, 2),
    };
  }

  move(canv_w, canv_h) {
    this.center.x = roundNumber(this.center.x + this.vector.x, 2);
    this.center.y = roundNumber(this.center.y + this.vector.y, 2);

    for (let j = 0; j < this.vertices.length; j++) {
      this.vertices[j][0] = roundNumber(this.vertices[j][0] + this.vector.x, 2);
      this.vertices[j][1] = roundNumber(this.vertices[j][1] + this.vector.y, 2);
    }

    //bouncing shape on screen
    for (let j = 0; j < this.vertices.length; j++) {
      const prev = j - 1 < 0 ? this.vertices.length - 1 : j - 1;
      const next = (j + 1) % this.vertices.length;

      //is out of x
      if (this.vertices[j][0] < -50 || this.vertices[j][0] > canv_w + 50) {
        //change direction
        this.vector.x = -this.vector.x;

        //change rotation
        const should_change_rotation = this.vertices[prev][0] < this.vertices[next][0];
        if (this.vector.x < 0) {
          if (should_change_rotation) this.rotate = -1;
          else this.rotate = 1;
        } else {
          if (should_change_rotation) this.rotate = 1;
          else this.rotate = -1;
        }

        break;
      }

      //is out of y
      if (this.vertices[j][1] < -50 || this.vertices[j][1] > canv_h + 50) {
        //change direction
        this.vector.y = -this.vector.y;

        //change rotation
        const should_change_rotation = this.vertices[prev][1] < this.vertices[next][1];
        if (this.vector.x < 0) {
          if (should_change_rotation) this.rotate = 1;
          else this.rotate = 1;
        } else {
          if (should_change_rotation) this.rotate = -1;
          else this.rotate = -1;
        }

        break;
      }
    }

    //rotate shape
    this.rotate_deg = roundNumber(this.rotate_deg + this.rotate * 0.1, 2);
    if (this.rotate_deg < 0) this.rotate_deg = 360;
    else if (this.rotate_deg > 360) this.rotate_deg = 0;
  }

  draw(ctx) {
    ctx.strokeStyle = this.line_color;
    ctx.fillStyle = this.vertex_color;

    ctx.translate(this.center.x, this.center.y);
    ctx.rotate((Math.PI / 180) * this.rotate_deg);
    ctx.translate(-this.center.x, -this.center.y);

    //draw lines polygon
    ctx.beginPath();
    for (let j = 0; j < this.vertices.length; j++) {
      ctx.lineTo(this.vertices[j][0], this.vertices[j][1]);
    }
    ctx.closePath();
    ctx.stroke();

    //draw vertices of polygon
    ctx.beginPath();
    for (let j = 0; j < this.vertices.length; j++) {
      ctx.moveTo(this.vertices[j][0], this.vertices[j][1]);
      ctx.arc(this.vertices[j][0], this.vertices[j][1], 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

let shapes = [
  new Shape("rgb(181, 230, 29)", "rgb(34, 177, 76)", [
    [140, 80],
    [90, 200],
    [240, 230],
  ]),
  new Shape("rgb(255, 201, 14)", "rgb(255, 127, 39)", [
    [700, 60],
    [1000, 60],
    [1000, 360],
    [700, 360],
  ]),
  new Shape("rgb(195, 195, 195)", "rgb(127, 127, 127)", [
    [1100, 160],
    [1200, 160],
    [1100, 260],
    [1200, 260],
  ]),
  new Shape("rgb(200, 191, 231)", "rgb(163, 73, 164)", [
    [90, 350],
    [120, 390],
    [80, 380],
    [70, 420],
    [40, 380],
  ]),
  new Shape("rgb(255, 174, 201)", "rgb(237, 28, 36)", [
    [1100, 370],
    [1020, 430],
    [1050, 520],
    [1150, 520],
    [1180, 430],
  ]),
  new Shape("rgb(153, 217, 234)", "rgb(0, 162, 232)", [
    [280, 430],
    [270, 500],
    [420, 440],
    [460, 550],
    [360, 540],
    [410, 480],
  ]),
  new Shape("rgb(185, 122, 87)", "rgb(133, 32, 3)", [
    [500, 100],
    [440, 280],
    [600, 170],
    [400, 170],
    [560, 280],
  ]),
];

const menu_background = new MenuBgAnimation();