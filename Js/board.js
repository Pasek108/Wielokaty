"use strict";

class Grid {
  position = { x: 0, y: 0 };
  small_unit = {};
  big_unit = {};

  constructor() {
    this.container = document.querySelector(".grid");

    this.small_unit.pattern = this.container.querySelector("#smallUnit");
    this.small_unit.path = this.container.querySelector("#smallUnit path");

    this.big_unit.pattern = this.container.querySelector("#bigUnit");
    this.big_unit.path = this.container.querySelector("#bigUnit path");
    this.big_unit.rect = this.container.querySelector("#bigUnit rect");
  }

  updatePosition(x, y) {
    this.position.x += x;
    this.position.y += y;

    this.big_unit.pattern.setAttribute("x", `${this.position.x}`);
    this.big_unit.pattern.setAttribute("y", `${this.position.y}`);
  }

  reset() {
    this.position.x = 0;
    this.position.y = 0;

    this.big_unit.pattern.setAttribute("x", "0");
    this.big_unit.pattern.setAttribute("y", "0");
  }
}

class VertexInfo {
  static array = [];
  index = 0;
  position = { x: 0, y: 0 };

  constructor(x, y, vertex) {
    this.vertex = vertex;
    this.index = VertexInfo.array.length;
    VertexInfo.array.push(this);

    this.position.x = Math.round((x - Board.position.x) / Board.scale);
    this.position.y = Math.round((y - Board.position.y) / Board.scale);

    this.create();
  }

  create() {
    this.container = document.createElement("div");
    this.container.className = "vertex-info";
    this.container.addEventListener("mouseenter", () => this.vertex.setBgColor("#5cce1a"));
    this.container.addEventListener("mouseleave", () => this.vertex.setBgColor(null));

    this.number = document.createElement("div");
    this.number.innerHTML = `${this.index + 1}`;

    this.coord_x = document.createElement("div");
    this.coord_x_input = document.createElement("input");
    this.coord_x_input.setAttribute("type", "number");
    this.coord_x_input.value = this.position.x;
    this.coord_x_input.addEventListener("input", this.changeVertexPosition.bind(this));
    this.coord_x.appendChild(this.coord_x_input);

    this.coord_y = document.createElement("div");
    this.coord_y_input = document.createElement("input");
    this.coord_y_input.setAttribute("type", "number");
    this.coord_y_input.value = -this.position.y;
    this.coord_y_input.addEventListener("input", this.changeVertexPosition.bind(this));
    this.coord_y.appendChild(this.coord_y_input);

    this.delete_button = document.createElement("div");
    this.delete_button.className = "delete";
    this.delete_button.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    this.delete_button.addEventListener("click", () => this.vertex.delete(null));

    this.container.appendChild(this.number);
    this.container.appendChild(this.coord_x);
    this.container.appendChild(this.coord_y);
    this.container.appendChild(this.delete_button);

    document.querySelector(".polygon-info .vertices").appendChild(this.container);
  }

  setBgColor(color) {
    this.container.style.backgroundColor = color;
  }

  setPosition(x, y) {
    this.position.x = Math.round((x - Board.position.x) / Board.scale);
    this.position.y = Math.round((y - Board.position.y) / Board.scale);
    this.coord_x_input.value = this.position.x;
    this.coord_y_input.value = -this.position.y;
  }

  setIndex(index) {
    this.index = index;
    this.number.innerHTML = `${this.index + 1}`;
  }

  changeVertexPosition() {
    this.position.x = this.coord_x_input.value * Board.scale;
    this.position.y = -this.coord_y_input.value * Board.scale;
    this.vertex.setPosition(this.position.x + Board.position.x, this.position.y + Board.position.y);
    this.vertex.drawPolygon();
  }

  focus() {
    const coords_container_height = this.container.offsetHeight;
    const coords_container_position = coords_container_height * (this.index + 2);
    const parent_container_height = this.container.parentElement.offsetHeight;

    const scroll_position = document.querySelector(".polygon-info .vertices").scrollTop;

    const is_element_out_of_top = coords_container_position > scroll_position + parent_container_height;
    const is_element_out_of_bottom = coords_container_position - 2 * coords_container_height < scroll_position;

    if (is_element_out_of_top || is_element_out_of_bottom) {
      document.querySelector(".polygon-info .vertices").scrollTo({
        top: coords_container_position - coords_container_height - parent_container_height / 2,
        behavior: "smooth",
      });
    }
  }

  remove() {
    this.container.remove();
    VertexInfo.array.splice(this.index, 1);
    for (let i = this.index; i < VertexInfo.array.length; i++) VertexInfo.array[i].setIndex(i);
  }
}

class Vertex {
  static array = [];
  position = { x: 0, y: 0 };
  offset = { x: 0, y: 0 };

  constructor(x, y, drawPolygon) {
    this.index = Vertex.array.length;
    this.drawPolygon = drawPolygon;
    Vertex.array.push(this);

    this.container = document.createElement("div");
    this.container.setAttribute("class", "vertex");
    this.container.style.left = `${x - 6}px`;
    this.container.style.top = `${y - 6}px`;
    Board.container.appendChild(this.container);

    this.position.x = x;
    this.position.y = y;
    this.info = new VertexInfo(x, y, this);

    this.grabEvent = (evt) => this.grab(evt);
    this.dragEvent = (evt) => this.drag(evt);
    this.stopDragEvent = () => this.stopDragging();
    this.hilightEvent = () => this.hilight();
    this.removeHilightEvent = () => this.removeHilight();
    this.delteEvent = (evt) => this.delete(evt);
    this.container.addEventListener("contextmenu", this.delteEvent);
    this.container.addEventListener("mousedown", this.grabEvent);
    this.container.addEventListener("mouseenter", this.hilightEvent);
    this.container.addEventListener("mouseleave", this.removeHilightEvent);
  }

  updatePosition(x, y) {
    this.position.x += x;
    this.position.y += y;
    this.container.style.left = `${this.position.x - 6}px`;
    this.container.style.top = `${this.position.y - 6}px`;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.container.style.left = `${this.position.x - 6}px`;
    this.container.style.top = `${this.position.y - 6}px`;
  }

  grab(e) {
    if (e.button !== 0) return;

    this.container.removeEventListener("mouseenter", this.hilightEvent);
    document.addEventListener("mousemove", this.dragEvent);
    document.addEventListener("mouseup", this.stopDragEvent);
  }

  hilight() {
    this.info.setBgColor("#5cce1a");
    this.info.focus();
  }

  removeHilight() {
    this.info.setBgColor(null);
    this.setBgColor(null);
  }

  drag(evt) {
    this.info.setBgColor("#5cce1a");
    this.setBgColor("#5cce1a");

    this.position.x = Math.round((evt.pageX - this.position.x) / Board.scale) * Board.scale + this.position.x;
    this.position.y = Math.round((evt.pageY - this.position.y) / Board.scale) * Board.scale + this.position.y;

    this.container.style.left = `${this.position.x - 6}px`;
    this.container.style.top = `${this.position.y - 6}px`;

    this.info.setPosition(this.position.x, this.position.y);

    this.drawPolygon();
  }

  stopDragging() {
    this.removeHilight();

    this.container.addEventListener("mouseenter", this.hilightEvent);
    document.removeEventListener("mousemove", this.dragEvent);
    document.removeEventListener("mouseup", this.stopDragEvent);

    if (this.container.backgroundColor != null) this.setBgColor(null);
  }

  delete(evt) {
    if (evt !== null) evt.preventDefault();

    this.info.remove();
    this.container.remove();
    Vertex.array.splice(this.index, 1);
    for (let i = this.index; i < Vertex.array.length; i++) Vertex.array[i].index--;
    this.drawPolygon();
  }

  setBgColor(color) {
    this.container.style.backgroundColor = color;
  }
}

class Board {
  static scale = 12;
  static position = { x: 0, y: 0 };
  static container = document.querySelector(".board");
  mouse = { x: 0, y: 0 };
  canvas_ratio = 1800 / window.innerWidth;

  constructor() {
    this.canvas = document.querySelector(".drawing-board");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 1.5;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = "rgba(72, 81, 103, 0.6)";
    this.ctx.strokeStyle = "rgb(0, 0, 0)";

    this.grid = new Grid();
    this.axis_x = new AxisX();
    this.axis_y = new AxisY();
    this.interface = new Interface();

    window.addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("mousedown", (evt) => this.moveBoard(evt));
    this.canvas.addEventListener("contextmenu", (evt) => this.addPoint(evt));
    Board.container.querySelector(".back").addEventListener("click", () => this.reset());
  }

  activate(vertices = []) {
    Board.container.classList.add("active");

    if (vertices.length > 0) {
      for (let i = 0; i < vertices.length; i++) {
        const x = vertices[i].x * Board.scale + Board.position.x;
        const y = -vertices[i].y * Board.scale + Board.position.y;
        new Vertex(x, y, this.drawPolygon.bind(this));
      }
      this.drawPolygon();
    }
  }

  reset() {
    setTimeout(() => {
      this.grid.reset();
      this.axis_x.remove();
      this.axis_y.remove();
      this.axis_x = new AxisX();
      this.axis_y = new AxisY();

      this.mouse.x = 0;
      this.mouse.y = 0;
      Board.scale = 12;
      Board.position = { x: 0, y: 0 };
      for (let i = Vertex.array.length - 1; i >= 0; i--) Vertex.array[i].delete(null);
      Vertex.array = [];

      this.ctx.clearRect(0, 0, window.innerWidth * this.canvas_ratio, window.innerHeight * this.canvas_ratio);
    }, 1000);
  }

  moveBoard(e) {
    if (e.button !== 0) return;

    this.mouse.x = e.pageX;
    this.mouse.y = e.pageY;

    this.axis_x.moveLabels();
    this.axis_y.moveLabels();

    const mousemove = moveGrid.bind(this);
    Board.container.addEventListener("mousemove", mousemove);
    Board.container.addEventListener("mouseup", (e) => {
      Board.container.removeEventListener("mousemove", mousemove);
    });

    function moveGrid(e) {
      Board.position.x += e.pageX - this.mouse.x;
      Board.position.y += e.pageY - this.mouse.y;
      this.grid.updatePosition(e.pageX - this.mouse.x, e.pageY - this.mouse.y);
      this.axis_x.updatePosition(e.pageX - this.mouse.x);
      this.axis_y.updatePosition(e.pageY - this.mouse.y);

      for (let i = 0; i < Vertex.array.length; i++) {
        Vertex.array[i].updatePosition(e.pageX - this.mouse.x, e.pageY - this.mouse.y);
      }

      this.mouse.x = e.pageX;
      this.mouse.y = e.pageY;
      this.drawPolygon();
    }
  }

  addPoint(e) {
    e.preventDefault();

    this.mouse.x = e.pageX - Board.position.x;
    this.mouse.y = e.pageY - Board.position.y;
    const x = Math.round(this.mouse.x / Board.scale) * Board.scale + Board.position.x;
    const y = Math.round(this.mouse.y / Board.scale) * Board.scale + Board.position.y;

    new Vertex(x, y, this.drawPolygon.bind(this));
    this.drawPolygon();
  }

  drawPolygon() {
    if (Vertex.array.length === 0) return;

    this.ctx.clearRect(0, 0, window.innerWidth * this.canvas_ratio, window.innerHeight * this.canvas_ratio);
    this.ctx.beginPath();
    this.ctx.moveTo(Vertex.array[0].position.x * this.canvas_ratio, Vertex.array[0].position.y * this.canvas_ratio);
    for (let i = 1; i < Vertex.array.length; i++) {
      this.ctx.lineTo(Vertex.array[i].position.x * this.canvas_ratio, Vertex.array[i].position.y * this.canvas_ratio);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  }

  resize() {
    this.canvas_ratio = 1800 / window.innerWidth;
    this.drawPolygon();
  }
}
