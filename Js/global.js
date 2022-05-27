"use strict";

initMenu();
activateBackButtons();

function initMenu() {
  const calculations = new Calculations();
  const start = new Start();

  const options = document.querySelectorAll(".menu .option");
  options[0].addEventListener("click", () => start.activate());
  options[1].addEventListener("click", () => calculations.activate());
}

function activateBackButtons() {
  const back_button = document.querySelectorAll(".back");

  for (let i = 0; i < back_button.length; i++) {
    back_button[i].addEventListener("click", () => {
      back_button[i].parentNode.classList.toggle("active");
      menu_background.stopAnimation();
      menu_background.animate(0);
    });
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function roundNumber(number, digits) {
  return Math.round((number + Number.EPSILON) * 10 ** digits) / 10 ** digits;
}