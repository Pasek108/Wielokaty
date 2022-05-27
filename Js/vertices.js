"use strict";

class Vertices {
  constructor(board) {
    this.container = document.querySelector(".vertices");
    this.points_container = this.container.querySelector(".coordinates");
    this.board = board;

    this.add_point_button = this.container.querySelector(".add-point");
    this.add_point_button.addEventListener("click", () => this.addPoint());

    this.draw_polygon_button = this.container.querySelector(".draw-polygon");
    this.draw_polygon_button.addEventListener("click", () => this.drawOnBoard());
  }

  addPoint() {
    const point = document.createElement("div");
    point.className = "point";

    const x_label = document.createElement("label");
    x_label.innerText = "x:";
    const x_input = document.createElement("input");
    x_input.type = "number";

    const y_label = document.createElement("label");
    y_label.innerText = "y:";
    const y_input = document.createElement("input");
    y_input.type = "number";

    point.append(x_label, x_input, y_label, y_input);
    this.points_container.insertBefore(point, this.add_point_button);
  }

  activate() {
    this.container.classList.add("active");
    const points = document.querySelectorAll(".point");
    for (let i = 0; i < points.length; i++) points[i].remove();
    this.addPoint();
    this.addPoint();
    this.addPoint();
  }

  drawOnBoard() {
    let vertices = [];
    const points_x = document.querySelectorAll(".point input:first-of-type");
    const points_y = document.querySelectorAll(".point input:last-of-type");

    for (let i = 0; i < points_x.length; i++) {
      if (points_x[i].value != '' && points_y[i].value != '') {
        vertices.push({x: points_x[i].value, y: points_y[i].value});
      }
    }

    this.board.activate(vertices);
  }
}
