import React from 'react'
import Sketch from 'react-p5'
let x = 50
let y = 50

// export default (props) => {
// 	const setup = (p5, canvasParentRef) => {
// 		// use parent to render the canvas in this ref
// 		// (without that p5 will render the canvas outside of your component)
// 		p5.createCanvas(500, 500).parent(canvasParentRef);
// 	};
// 	const draw = (p5) => {
// 	if (mouseIsPressed) {
//     fill(0);
//   } else {
//     fill(255);
//   }
//   ellipse(mouseX, mouseY, 80, 80);
// 	};
// 	return <Sketch setup={setup} draw={draw} />;
// };

export default class Drawing extends React.Component {
  constructor() {
    super()
    this.setup = this.setup.bind(this)
    this.draw = this.draw.bind(this)
  }

  setup() {
    createCanvas(400, 400)
  }
  draw(p5) {
    if (mouseIsPressed) {
      fill(0)
    } else {
      fill(255)
    }
    ellipse(mouseX, mouseY, 80, 80)
  }

  render() {
    return <Sketch setup={this.setup} draw={this.draw} />
  }
}
