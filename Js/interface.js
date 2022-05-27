"use strict";

class Interface {
  buttons = {
    container: undefined,
    save: undefined,
    calculate: undefined,
    back: undefined,
    clear: undefined,
  };
  polygon_info = {
    container: undefined,
    button: undefined,
    tabs: undefined,
    tabs_containers: undefined,
  };

  constructor() {
    this.polygon_info.container = document.querySelector(".polygon-info");
    this.polygon_info.button = document.querySelector(".open-info-button");
    this.polygon_info.vertices = document.querySelector(".op ")

    this.buttons.container = document.querySelector(".buttons");

    this.polygon_info.button.addEventListener("click", () => this.toggle());
  }

  toggle() {
    const icon = this.polygon_info.button.children[0];

    if (icon.classList.contains("fa-chevron-right")) {
      icon.classList.replace("fa-chevron-right", "fa-chevron-left");
      this.polygon_info.container.style.right = "-20rem";
      this.buttons.container.style.left = "39vw";
      document.querySelector(".scale-axis-x").style.width = "85vw";
    } else {
      icon.classList.replace("fa-chevron-left", "fa-chevron-right");
      this.polygon_info.container.style.right = "0px";
      this.buttons.container.style.left = "calc(39vw - 11rem)";
      document.querySelector(".scale-axis-x").style.width = "calc(85vw - 20rem)";
    }
  }
}