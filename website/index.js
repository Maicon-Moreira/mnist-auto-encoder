let ws
let model

async function loadModel() {
  model = await tf.loadLayersModel('../js_model/model.json');
}

loadModel()

function setup() {
  createCanvas(innerWidth, innerHeight)
  noStroke()

  document.getElementsByTagName('main')[0].style.height = innerHeight + 'px'

  background(0)
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight)
}

function draw() {
  fill(255)

  rect(0, innerWidth, innerWidth, innerWidth)

  console.log(predict(mouseX, mouseY))
}

function predict(x, y) {
  if (model) {

    x = x / innerWidth
    y = y / innerWidth

    return model.predict(tf.tensor2d([[x, y]])).dataSync()
  }
}