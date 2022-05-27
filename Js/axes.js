"use strict";

class AxisX {
  screen_edge_distance = 0;
  position = 0;
  old_position = 0;
  padding = 0;
  labels = {
    numbers: [],
    text: {
      container: [],
      position: [],
      width: [],
    },
    background: {
      container: [],
      position: [],
    },
  };

  constructor() {
    window.addEventListener("resize", () => this.resize());

    this.container = document.querySelector(".scale-axis-x");
    this.axis = document.querySelector(".scale-axis-x");
    this.big_unit = this.axis.querySelector("#bigVerticalUnit");

    //push initial coordinates -250 to 250
    for (let i = -250; i <= 250; i += 10) this.labels.numbers.push(i);

    //calculate position from left side
    this.screen_edge_distance = this.container.getBoundingClientRect().left - this.container.parentElement.getBoundingClientRect().left + 0.5;
    this.padding = parseInt(window.getComputedStyle(this.container).paddingLeft);

    //set position of grid
    this.position = -this.screen_edge_distance - this.padding - 0.5;
    this.old_position = this.position;
    this.big_unit.setAttribute("x", `${this.position}`);

    //add labels
    for (let i = 0; i < this.labels.numbers.length; i++) {
      const text_width = this.labels.numbers[i].toString().length * 8 + 2;
      const label_x_position = this.labels.numbers[i] * 12 - this.screen_edge_distance - this.padding - text_width / 2;

      //add label bg
      const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      background.setAttribute("x", `${label_x_position}`);
      background.setAttribute("y", "22%");
      background.setAttribute("width", `${text_width}`);
      background.setAttribute("height", "13");
      background.setAttribute("fill", "white");
      background.setAttribute("class", "bg");
      this.axis.appendChild(background);
      this.labels.background.container.push(background);
      this.labels.background.position.push(label_x_position);

      //add label text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", `${label_x_position + 1}`);
      text.setAttribute("y", "70%");
      text.setAttribute("font-size", "14");
      text.innerHTML = `${this.labels.numbers[i]}`;
      this.axis.appendChild(text);
      this.labels.text.container.push(text);
      this.labels.text.position.push(label_x_position + 1);
      this.labels.text.width.push(text_width);
    }
  }

  updatePosition(x) {
    this.position += x;
    this.big_unit.setAttribute("x", `${this.position}`);

    for (let i = 0; i < this.labels.numbers.length; i++) {
      this.labels.text.position[i] += x;
      this.labels.background.position[i] += x;
      this.labels.text.container[i].setAttribute("x", `${this.labels.text.position[i]}`);
      this.labels.background.container[i].setAttribute("x", `${this.labels.background.position[i]}`);
    }
  }

  moveLabels() {
    if (this.position < this.old_position) {
      //if user moves grid to right, move labels that are out of screen from left, to right
      for (let i = 0; i < this.labels.numbers.length; i++) {
        if (this.labels.text.container[i].getBoundingClientRect().left + this.labels.numbers[i].toString().length * 4 < -1440) {
          //initial -250 to 250, -250 + 510 = 260 which is next
          this.labels.numbers[i] += 510;
          const text_width = this.labels.numbers[i].toString().length * 8 + 2;
          this.labels.background.position[i] += 12 * 510 + this.labels.text.width[i] / 2 - text_width / 2;
          this.labels.text.position[i] = this.labels.background.position[i] + 1;
          this.labels.text.width[i] = text_width;
          this.updateLabel(i);
        }
      }
    } else if (this.position > this.old_position) {
      //if user moves grid to left, move labels that are out of screen from right, to left
      for (let i = this.labels.numbers.length - 1; i >= 0; i--) {
        if (this.labels.text.container[i].getBoundingClientRect().right - this.labels.numbers[i].toString().length * 4 > window.innerWidth + 1440) {
          this.labels.numbers[i] -= 510;
          const text_width = this.labels.numbers[i].toString().length * 8 + 2;
          this.labels.background.position[i] += -12 * 510 + this.labels.text.width[i] / 2 - text_width / 2;
          this.labels.text.position[i] = this.labels.background.position[i] + 1;
          this.labels.text.width[i] = text_width;
          this.updateLabel(i);
        }
      }
    }

    this.old_position = this.position;
  }

  updateLabel(i) {
    this.labels.text.container[i].setAttribute("x", `${this.labels.text.position[i]}`);
    this.labels.text.container[i].innerHTML = `${this.labels.numbers[i]}`;

    this.labels.background.container[i].setAttribute("x", `${this.labels.background.position[i]}`);
    this.labels.background.container[i].setAttribute("width", `${this.labels.text.width[i]}`);
  }

  resize() {
    const new_screen_edge_distance = this.container.getBoundingClientRect().left + 0.5;

    this.position += this.screen_edge_distance - new_screen_edge_distance;
    this.old_position = this.position;
    this.big_unit.setAttribute("x", `${this.position}`);

    for (let i = 0; i < this.labels.numbers.length; i++) {
      this.labels.background.position[i] += this.screen_edge_distance - new_screen_edge_distance;
      this.labels.text.position[i] = this.labels.background.position[i] + 1;
      this.updateLabel(i);
    }

    this.screen_edge_distance = new_screen_edge_distance;
  }

  remove() {
    setTimeout(() => {
      for (let i = 0; i < this.labels.numbers.length; i++) {
        this.labels.text.container[i].remove();
        this.labels.background.container[i].remove();
      }
    }, 1000);
  }
}

class AxisY {
  screen_edge_distance = 0;
  position = 0;
  old_position = 0;
  padding = 0;
  labels = {
    numbers: [],
    text: {
      container: [],
      position: [],
      width: [],
    },
    background: {
      container: [],
      position: [],
    },
  };

  constructor() {
    window.addEventListener("resize", () => this.resize());

    this.container = document.querySelector(".scale-axis-y");
    this.axis = document.querySelector(".scale-axis-y");
    this.big_unit = this.axis.querySelector("#bigHorizontalUnit");

    //push initial coordinates -250 to 250
    for (let i = -250; i <= 250; i += 10) this.labels.numbers.push(i);

    //calculate position from top side
    this.screen_edge_distance = this.container.getBoundingClientRect().top + 0.5;
    this.padding = parseInt(window.getComputedStyle(this.container).paddingTop);

    //set position of grid
    this.position = -this.screen_edge_distance - this.padding - 0.5;
    this.old_position = this.position;
    this.big_unit.setAttribute("y", `${this.position}`);

    //add labels
    for (let i = 0; i < this.labels.numbers.length; i++) {
      const text_width = this.labels.numbers[i].toString().length * 8 + 2;
      const label_x_position = this.labels.numbers[i] * 12 + this.screen_edge_distance + this.padding - text_width / 2;
      const label_y_position = this.container.clientWidth / 2 - 10;

      //add label bg
      const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      background.setAttribute("x", `${label_x_position}`);
      background.setAttribute("y", `${label_y_position + 0.5}`);
      background.setAttribute("width", `${text_width}`);
      background.setAttribute("height", "13");
      background.setAttribute("fill", "white");
      background.setAttribute("class", "bg");
      background.setAttribute("transform", `rotate(270)`);
      this.axis.appendChild(background);
      this.labels.background.container.push(background);
      this.labels.background.position.push(label_x_position);

      //add label text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", `${label_x_position + 1}`);
      text.setAttribute("y", `${label_y_position + 12}`);
      text.setAttribute("font-size", "14");
      text.setAttribute("transform", `rotate(270)`);
      text.innerHTML = `${this.labels.numbers[i]}`;
      this.axis.appendChild(text);
      this.labels.text.container.push(text);
      this.labels.text.position.push(label_x_position + 1);
      this.labels.text.width.push(text_width);
    }
  }

  updatePosition(x) {
    this.position += x;
    this.big_unit.setAttribute("y", `${this.position}`);

    for (let i = 0; i < this.labels.numbers.length; i++) {
      this.labels.text.position[i] -= x;
      this.labels.background.position[i] -= x;
      this.labels.text.container[i].setAttribute("x", `${this.labels.text.position[i]}`);
      this.labels.background.container[i].setAttribute("x", `${this.labels.background.position[i]}`);
    }
  }

  moveLabels() {
    if (this.position < this.old_position) {
      //if user moves grid to top, move labels that are out of screen from bottom, to top
      for (let i = 0; i < this.labels.numbers.length; i++) {
        if (this.labels.text.container[i].getBoundingClientRect().top + this.labels.numbers[i].toString().length * 4 < -1440) {
          //initial -250 to 250, 250 - 510 = -260 which is next
          this.labels.numbers[i] -= 510;
          const text_width = this.labels.numbers[i].toString().length * 8 + 2;
          this.labels.background.position[i] += -12 * 510 + this.labels.text.width[i] / 2 - text_width / 2;
          this.labels.text.position[i] = this.labels.background.position[i] + 1;
          this.labels.text.width[i] = text_width;
          this.updateLabel(i);
        }
      }
    } else if (this.position > this.old_position) {
      //if user moves grid to bottom, move labels that are out of screen from top, to bottom
      for (let i = this.labels.numbers.length - 1; i >= 0; i--) {
        if (this.labels.text.container[i].getBoundingClientRect().bottom - this.labels.numbers[i].toString().length * 4 > window.innerWidth + 1440) {
          this.labels.numbers[i] += 510;
          const text_width = this.labels.numbers[i].toString().length * 8 + 2;
          this.labels.background.position[i] += 12 * 510 + this.labels.text.width[i] / 2 - text_width / 2;
          this.labels.text.position[i] = this.labels.background.position[i] + 1;
          this.labels.text.width[i] = text_width;
          this.updateLabel(i);
        }
      }
    }

    this.old_position = this.position;
  }

  updateLabel(i) {
    this.labels.text.container[i].setAttribute("x", `${this.labels.text.position[i]}`);
    this.labels.text.container[i].innerHTML = `${this.labels.numbers[i]}`;

    this.labels.background.container[i].setAttribute("x", `${this.labels.background.position[i]}`);
    this.labels.background.container[i].setAttribute("width", `${this.labels.text.width[i]}`);
  }

  resize() {
    const new_screen_edge_distance = this.container.getBoundingClientRect().top + 0.5;

    this.position += this.screen_edge_distance - new_screen_edge_distance;
    this.old_position = this.position;
    this.big_unit.setAttribute("y", `${this.position}`);

    for (let i = 0; i < this.labels.numbers.length; i++) {
      this.labels.background.position[i] += new_screen_edge_distance - this.screen_edge_distance;
      this.labels.text.position[i] = this.labels.background.position[i] + 1;
      this.updateLabel(i);
    }

    this.screen_edge_distance = new_screen_edge_distance;
  }

  remove() {
    setTimeout(() => {
      for (let i = 0; i < this.labels.numbers.length; i++) {
        this.labels.text.container[i].remove();
        this.labels.background.container[i].remove();
      }
    }, 1000);
  }
}