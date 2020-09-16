let ws
let decoder
let image
let quadSize
let imageSize
let ticksWithoutMouse = 0
let autoMouse
let autoMouseGoal


async function loadModel() {
  decoder = await tf.loadLayersModel('../decoder/model.json');
}

loadModel()

function setup() {
  createCanvas(innerWidth, innerHeight)
  noStroke()

  document.getElementsByTagName('main')[0].style.height = innerHeight + 'px'

  background(0)

  quadSize = (innerHeight - innerWidth) / 28
  imageSize = quadSize * 28

  autoMouse = createVector()
  autoMouseGoal = createVector(random(innerWidth), random(innerWidth))

  alert('Bem vindo ao visualizador de "Mnist auto encoder", toque no plano 2d para escolher valores de entrada ou assista a apresentação automática apertando na imagem inferior.')
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight)

  quadSize = (innerHeight - innerWidth) / 28
  imageSize = quadSize * 28
}

function draw() {
  ticksWithoutMouse++

  fill(255)

  rect(0, innerWidth, innerWidth, innerWidth)

  if (image) {
    for (let x = 0; x < 28; x++) {
      for (let y = 0; y < 28; y++) {
        fill(255 - image[y][x] * 400)
        rect((innerWidth - imageSize) / 2 + x * quadSize, innerWidth + y * quadSize, quadSize, quadSize)
      }
    }
  }

  if (mouseX > 0 && mouseY > 0 && mouseX < innerWidth && mouseY < innerWidth) {
    image = predict(mouseX, mouseY)
    ticksWithoutMouse = 0
  }

  if (ticksWithoutMouse > 5){
    image = predict(autoMouse.x, autoMouse.y)

    const move = autoMouse.copy().sub(autoMouseGoal).normalize().mult(-1)
    autoMouse.add(move)

    if (autoMouse.dist(autoMouseGoal) < 2){
      autoMouseGoal = createVector(random(innerWidth), random(innerWidth))
    }

    fill(255, 0, 0)
    circle(autoMouse.x, autoMouse.y, 2)
    noFill()

  }
}

setInterval(() => {
  if (image && ticksWithoutMouse < 10) {

    for (let x = 0; x < 28; x++) {
      for (let y = 0; y < 28; y++) {
        stroke(max(255 - image[y][x] * 255, 0))
        point(mouseX + x, mouseY + y)
      }
    }

    noStroke()
  }
}, 500)

function predict(x, y) {
  if (decoder) {

    x = x / innerWidth * 2 - 1
    y = y / innerWidth * 2 - 1

    return decoder.predict(tf.tensor2d([[x, y]])).reshape([28, 28]).arraySync()
  }
}