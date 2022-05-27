"use strict";

class Edges {
  constructor(board) {
    this.container = document.querySelector(".edges");
  }

  activate() {
    this.container.classList.add("active");
  }
}
