//Ghost
var ghost, ghostAnimation;

var ghostJumping;

var ghostStanding;

//Background
var tower, towerImage;

//Climber
var climber, climberImage;

//Door
var door, doorImage;

//Gamestates
var gameState = "play";

//Score
var score = 0;

//Sound
var music;

//Groups
var doorGroup;
var climberGroup;
var invisibleBarGroup;

function preload() {
  ghostAnimation = loadAnimation("ghost1.png", "ghost2.png", "ghost3.png");
  ghostJumping = loadAnimation("ghost-jumping.png");
  ghostStanding = loadImage("ghost-standing.png");

  towerImage = loadImage("tower.png");

  doorImage = loadImage("door.png");

  climberImage = loadImage("climber.png");

  music = loadSound("spooky.wav");
}

function setup() {
  createCanvas(600, 600);

  tower = createSprite(300, 300, 50, 50);
  tower.addImage("tower", towerImage);

  ghost = createSprite(300, 300, 80, 80);
  ghost.addAnimation("ghostAnim", ghostAnimation);
  ghost.addAnimation("ghostJumping", ghostJumping);
  ghost.addImage("ghostStanding", ghostStanding);
  ghost.scale = 0.4;
  ghost.setCollider("rectangle", -20, 20, 200, 250);

  //music.loop();

  climberGroup = createGroup();
  invisibleBarGroup = createGroup();
  doorGroup = createGroup();
}

function draw() {
  background("black");

  if (gameState == "play") {

    if (frameCount % 10 == 0) {
      score += 1;
    }

    //Tower
    tower.velocityY = 2;

    if (tower.y > 600) {
      tower.y = 300;
    }

    //Player 
    if (keyDown("D")) {
      ghost.x += 5;
    }

    if (keyDown("A")) {
      ghost.x -= 5;
    }

    if (keyDown("space")) {
      ghost.velocityY = -10;
      ghost.changeAnimation("ghostJumping", ghostJumping);
    }

    gravity(1);

    spawnObstacles();

    if (ghost.isTouching(climberGroup)) {
      ghost.velocityY = tower.velocityY;
      ghost.changeAnimation("ghostStanding", ghostStanding);

      if (keyDown("space")) {
        ghost.velocityY = -10;
        ghost.changeAnimation("ghostJumping", ghostJumping);
      }
    }

    if (ghost.isTouching(invisibleBarGroup) || ghost.y > height || ghost.y < 0 || ghost.x < 60 || ghost.x > 540) {
      gameState = "end";
    }
  }

  if (gameState == "end") {
    ghost.destroy();

    climberGroup.destroyEach();

    doorGroup.destroyEach();

    invisibleBarGroup.destroyEach();

    tower.destroy();

    textAlign(CENTER);
    textSize(20);
    fill("yellow");
    text("GAME OVER", width / 2, height / 2);
    noFill();
  }

  drawSprites();

  //fill("yellow");
  //textSize(20);
  //text(mouseX + " , " + mouseY, mouseX, mouseY);
  //noFill();

  textAlign(CENTER);
  textSize(20);
  fill("yellow");
  text(" Score: " + score, 430, 30);
  noFill();

}

function gravity(g) {
  ghost.velocityY += g;
}

function spawnObstacles() {
  if (frameCount % 200 == 0 || frameCount == 50) {
    door = createSprite(random(100, 500), 0, 20, 20);
    door.addImage("door", doorImage);
    door.velocityY = tower.velocityY;
    door.depth = ghost.depth - 1;

    climber = createSprite(door.x, door.y + 60, 10, 10);
    climber.addImage("climber", climberImage);
    climber.velocityY = door.velocityY;

    invisibleBar = createSprite(climber.x, climber.y + 15, climber.width, 5);
    invisibleBar.velocityY = climber.velocityY;
    invisibleBar.visible = false;

    climberGroup.add(climber);
    invisibleBarGroup.add(invisibleBar);
    doorGroup.add(door);

  }
}