const c = document.getElementById("canvas")
const ctx = c.getContext("2d")

var alive = true

class Hitbox{
  constructor(x, y, w, h){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
  show(){
    ctx.fillStyle = "#FF0000"
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
  detectCollision(obj){
    var lowerBoundX = obj.x
    var upperBoundX = obj.x + (obj.w)
    var lowerBoundY = obj.y
    var upperBoundY = obj.y + (obj.h)
    origin = [this.x, this.y]
    if(origin[0] <= upperBoundX && lowerBoundX <= origin[0]+(this.w)){
      if(origin[1] <= upperBoundY && lowerBoundY <= origin[1]+(this.h)){
        //What to do on collision
        return true
      }
    } else if(origin[1] <= upperBoundY && lowerBoundY <= origin[1]+(this.h)){
      if(origin[0] <= upperBoundX && lowerBoundX <= origin[0]+(this.w)){
        //What to do on collision
        return true
      }
    }
  }
  wallDetection(){
    if(this.y < 0){
      return "top"
    }else if(this.y-this.h > c.height){
      return "bottom"
    }
    if(this.x < 0){
      return "left"
    }else if(this.y-this.w>c.width){
      return "right"
    }
    
  }
}

var v = [0, 1]

class Gnome{
  constructor(x, y, w, h, jumpHeight){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.jumpHeight = jumpHeight
    this.hitbox = new Hitbox(this.x, this.y, this.w, this.h)
    this.isJumping = false
    this.maxJumps = 3
    this.jumps = this.maxJumps
  }
  draw(){
    this.hitbox.x = this.x
    this.hitbox.y = this.y
    ctx.fillStyle = "#000000"
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
  gravity(array){
    //Apply Gravity to veolicty
    var g = 1

    for(let obj of array){
      //If the bottom of the gnome is above
      if(this.y <= obj.y){
        if(this.hitbox.detectCollision(obj.hitbox)){
          //console.log(this.isJumping)
          if(this.isJumping != true){
            v[1]=0
            g=0
            this.y = obj.hitbox.y-this.h
            this.jumps=this.maxJumps
          }
        }
      }
    }
    
    if(this.hitbox.wallDetection() == "bottom"){
      v[1] = 0
      g=0
      this.y = array[0].y - this.h
    }
    
    v[1] += g

    const maxVelocity = 19
    
    if(v[1]>maxVelocity){
      v[1] = maxVelocity
    }

    this.y += v[1]
    this.x += v[0]

    //console.log(v[1])
  }
  jump(){
    if(this.jumps>0){
      v[1] = -1 * this.jumpHeight
      this.jumps--
    }
  }
  move(a){
    v[0] = a
  }
}

class Platform{
  constructor(x, y, w, h, color){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
    this.hitbox = new Hitbox(this.x, this.y, this.w, this.h+10)
    this.breaking = false
  }
  draw(){
    this.hitbox.x = this.x
    this.hitbox.y = this.y
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
  getRandomPosition(){
    return [Math.floor(Math.random() * (c.width - this.w)), Math.floor(Math.random() * (c.height - this.h))]
  }
}

class Projectile{
  constructor(x, y, w, h, v, speed, color){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.v = v
    this.color = color
    this.speed = speed
    this.hitbox = new Hitbox(this.x, this.y, this.w, this.h)
  }
  draw(){
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
  move(){
    this.x += this.v.x * this.speed
    this.y += this.v.y * this.speed

    //console.log(this.v.x)
    //console.log(this.v.y)
  }
  isOffscreen(){
    if(this.hitbox.wallDetection()){
      return true
    }
  }
}

let player = new Gnome(20, 20, 20, 20, 15)
player.draw()
player.hitbox.show()

let platforms = []
let bullets = []

for(var i = 0; i < 3; i++){
  let randomWidth = 70
  let randomX = Math.floor(Math.random() * (c.width - randomWidth))
  let randomY = Math.floor((Math.random() * (c.height - player.h))) + player.h
  platforms.push(new Platform(randomX, randomY, randomWidth, 10, "#FF0000"))
}



function main(){
  ctx.clearRect(0, 0, c.width, c.height)
  player.draw()
  player.gravity(platforms)
  player.isJumping = false
  
  for(let entity of platforms){
    entity.draw()
    if(entity.hitbox.detectCollision(player)){
      const newPosition =entity.getRandomPosition()
      entity.breaking = true
      setTimeout(function(){
        //Makes it so that it only picks a new spot
        //one time
        if(entity.breaking){
          entity.x = newPosition[0]
          entity.y = newPosition[1]
          entity.breaking=false
        }
      }, 3000)
    }
  }
  for(let bullet of bullets){
    //console.log(bullet)
    bullet.draw()
    bullet.move()
    if(bullet.isOffscreen=="bottom" || bullet.isOffscreen=="top" || bullet.isOffscreen=="left" || bullet.isOffscreen=="right"){
      console.log()
      
      bullets.splice(bullets.find(bullet), bullets.find(bullet))
    }
  }
}

addEventListener("keypress", function(e){
  const moveSpeed = 20
  if(e.key == "w"){
    
    player.isJumping = true
    player.jump()
  }
  if(e.key=="d"){
    player.move(moveSpeed)
  }
  if(e.key=="a"){
    player.move(-1 * moveSpeed)
  }
  if(e.key == "c"){
    console.log(player.x + " " + player.y)
    console.log(bullets.length)
  }
})
addEventListener("keyup", function(e){
  //console.log(e.key)
  if(e.key == "a" || e.key == "d"){
    v[0]=0
  }
})
addEventListener("click", function(e){
  
  var mouseX = e.clientX - c.offsetLeft
  var mouseY = e.clientY - c.offsetTop
  const angle = Math.atan2(player.y-mouseY, player.x-mouseX)
  const center = [player.x + player.w/2, player.y + player.h/2]
  //Projectile(x, y, w, h, v, color)
  bullets.push(new Projectile(center[0], center[1], 5, 5, {
    x: -1 * Math.cos(angle),
    y: -1 * Math.sin(angle)
  }, 10,"#FF00FF"))
})




setInterval(main, 40)

const car = {x: 100, y: 100}
console.log(car.x)
