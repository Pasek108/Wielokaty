"use strict";

class Start {
  constructor() {
    const board = new Board();
    const premade = new Premade(board);
    const edges = new Edges(board);
    const vertices = new Vertices(board);

    this.container = document.querySelector(".start");

    this.options = document.querySelectorAll(".start .option");
    this.options[0].addEventListener("click", () => this.activateWindow(premade));
    this.options[1].addEventListener("click", () => this.activateWindow(edges));
    this.options[2].addEventListener("click", () => this.activateWindow(vertices));
    this.options[3].addEventListener("click", () => this.activateWindow(board));
  }

  activate() {
    this.container.classList.add("active");
  }

  activateWindow(namespace) {
    if (this.options_lock === 1) return;

    this.options_lock = 1;
    setTimeout(() => (this.options_lock = 0), 1200);

    menu_background.stopAnimation();
    namespace.activate();
  }
}
