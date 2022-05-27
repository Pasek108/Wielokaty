"use strict";

class Polygon {
  constructor(vertices) {
    this.vertices = vertices;

    this.canvas = document.createElement("canvas");
    this.canvas.width = "500";
    this.canvas.height = "500";
    
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.strokeStyle = "rgb(230, 0, 0)";
    this.ctx.lineWidth = 4;
  }

  addMenu(container) {
    container.innerHTML = "";
    container.appendChild(this.canvas);
    this.drawPolygon();
  }

  drawPolygon() {
    this.ctx.beginPath();
    for (let i = 0; i < this.vertices.length; i++) {
      this.ctx.lineTo(this.vertices[i][0], this.vertices[i][1]);
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }
}

/*
<svg viewBox="0 0 500 500" style="width: 15rem;">
  <polygon points="50, 430, 450, 430, 250, 83.5" style="fill:lime;stroke:purple;stroke-width:1"></polygon>
</svg>
 */

class EquilateralTriangle extends Polygon {
  constructor() {
    const vertices = [[50, 430], [450, 430], [250, 83.5]];
    super(vertices);
    this.name = "Trójkąt równoboczny";
  }
}

const TYPES_OF_POLYGONS = [
  {
    type: "Foremne",
    names: ["Trójkąt równoboczny", "Kwadrat", "Pięciokąt foremny", "Sześciokąt foremny", "n-kąt foremny"],
    objects: [new EquilateralTriangle()]
  },
  {
    type: "Nie foremne",
    names: [
      "Trójkąt równoramienny",
      "Trójkąt różnoboczny",
      "Prostokąt",
      "Romb",
      "Równoległobok",
      "Deltoid",
      "Trapez równoramienny",
      "Trapez różnoramienny",
      "Trapez prostokątny",
    ],
  },
  {
    type: "Wypukłe",
    names: ["Trójkąt", "Kwadrat", "Pięciokąt", "Sześciokąt", "n-kąt"],
  },
  {
    type: "Wklęsłe",
    names: ["Trójkąt", "Kwadrat", "Pięciokąt", "Sześciokąt", "n-kąt"],
  },
  {
    type: "Proste",
    names: ["Trójkąt", "Kwadrat", "Pięciokąt", "Sześciokąt", "n-kąt"],
  },
  {
    type: "Złożone",
    names: ["Trójkąt", "Kwadrat", "Pięciokąt", "Sześciokąt", "n-kąt"],
  },
  {
    type: "Zapisane",
    names: [],
  },
];


class Premade {
  constructor(board) {
    this.container = document.querySelector(".premade");
    this.createPolygonsMenu();
    this.method_details = this.container.querySelector(".polygon-details");
  }

  activate() {
    this.container.classList.add("active");
  }

  createPolygonsMenu() {
    const polygon_types = this.container.querySelector(".polygon-types");

    for (let i = 0; i < TYPES_OF_POLYGONS.length; i++) {
      const polygons_names = document.createElement("div");
      polygons_names.setAttribute("class", "polygons");

      if (TYPES_OF_POLYGONS[i].names.length === 0) {
        polygons_names.innerHTML = "Brak";
      }

      for (let j = 0; j < TYPES_OF_POLYGONS[i].names.length; j++) {
        const polygon_name = document.createElement("div");
        polygon_name.setAttribute("class", "name");
        polygon_name.innerHTML = `${TYPES_OF_POLYGONS[i].names[j]}`;
        polygon_name.addEventListener("click", () => (TYPES_OF_POLYGONS[i].objects[0].addMenu(this.method_details)));

        polygons_names.appendChild(polygon_name);
      }

      const group_name = document.createElement("div");
      group_name.setAttribute("class", "name");
      group_name.innerHTML = `<i class="fa-solid fa-plus"></i> ${TYPES_OF_POLYGONS[i].type}`;
      group_name.addEventListener("click", () => {
        polygons_names.classList.toggle("active");
        group_name.querySelector("i").classList.toggle("fa-plus");
        group_name.querySelector("i").classList.toggle("fa-minus");
      });

      const group = document.createElement("div");
      group.setAttribute("class", "group");
      group.appendChild(group_name);
      group.appendChild(polygons_names);
      polygon_types.appendChild(group);
    }
  }
}

