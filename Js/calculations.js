"use strict";

class Calculations {
  constructor() {
    this.container = document.querySelector(".calculations");

    this.options = document.querySelectorAll(".calculations .option");
    this.options_window = document.querySelectorAll(".calculations .option-window");

    this.options[0].addEventListener("click", this.toggleActiveOption.bind(this));
    this.options[1].addEventListener("click", this.toggleActiveOption.bind(this));
  }

  activate() {
    this.container.classList.add("active");
  }

  toggleActiveOption() {
    this.options[0].classList.toggle("active");
    this.options[1].classList.toggle("active");
    this.options_window[0].classList.toggle("active");
    this.options_window[1].classList.toggle("active");
  }
}

