//creating global variables
var player, playerImg, playerImg2, bgImg, bg;
var ground1, ground2, ground3;
var obsImg, obstacle, obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var health = 100;
var hunger = 100;
var radiation = 0;
var flag = 0;
var req = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var grunt, bgSound, hop;
var weapon = 0;
var reqGroup;
var groundImg;
var wood, woodImg, rope, ropeImg, stone, stoneImg, axe, axeImg;
var rd, hg, foodGroup, apple, banana, garlic, meat, potato, water;
var rdImg, hgImg, appleImg, bananaImg, garlicImg, meatImg, potatoImg, waterImg;
var gameOver, reset, gameOverImg, resetImg;

function preload(){
  //loading the images
  bgImg = loadImage("images/bg.jpg");
  hgImg = loadImage("images/hunger.png");
  rdImg = loadImage("images/rd.png");
  obsImg = loadImage("images/animal.png");
  appleImg = loadImage("images/apple.png");
  bananaImg = loadImage("images/banana.png");
  garlicImg = loadImage("images/garlic.png");
  meatImg = loadImage("images/meat.png");
  potatoImg = loadImage("images/potato.png");
  waterImg = loadImage("images/water.png");
  gameOverImg = loadImage("images/gameOver.png");
  resetImg = loadImage("images/reset.png");
  playerImg = loadAnimation("images/p1.png","images/p2.png","images/p3.png","images/p4.png","images/p5.png","images/p6.png");
  playerImg2 = loadImage("images/p7.png");
  woodImg = loadImage("images/wood.png");
  ropeImg = loadImage("images/rope.png");
  stoneImg = loadImage("images/stone.png");
  axeImg = loadImage("images/axe.png");
  groundImg = loadImage("images/ground.png");

  //load the sounds
  grunt = loadSound("sounds/grunt.mp3");
  bgSound = loadSound("sounds/bgsound.wav");
  hop = loadSound("sounds/hop.wav");

}

function setup() {
  //creating the canvs
  createCanvas(displayWidth, displayHeight);

  //creating the moving background
  bg = createSprite(width/2,height/2,600,600);
  bg.addImage(bgImg);
  bg.x = bg.width/2;
  bg.scale = 1

  //creating hunger image
  hg = createSprite(50,60);
  hg.addImage(hgImg);
  hg.scale = 0.015;

  //creating radiation image
  rd = createSprite(50,110);
  rd.addImage(rdImg);
  rd.scale = 0.03;

  //creating groups
  foodGroup = new Group();
  obstacleGroup = new Group();
  reqGroup = new Group();
  
  //creating the platforms
  ground1 = createSprite(displayWidth/2,700,displayWidth*2,20);
  ground1.visible = false;
  ground2 = createSprite(displayWidth/2,450,displayWidth*2,20);
  ground2.visible = false;
  ground3 = createSprite(displayWidth/2,250,displayWidth*2,20);
  ground3.visible = false;

  //creating the player
  player = createSprite(200,450,50,50);
  player.addAnimation("player",playerImg);
  player.addAnimation("playerfallen",playerImg2);
  player.scale = 0.3; 
  player.shapeColor = "black";

  //creating weapon which should be visible when weapon is 1
  axe = createSprite(230,380,20,20);
  axe.addImage(axeImg);
  axe.scale = 0.15;
  axe.visible = false;

  //creating the game over image
  gameOver = createSprite(displayWidth/2,300);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;

  //creating the reset image
  reset = createSprite(displayWidth/2,450);
  reset.addImage(resetImg);
  reset.scale = 0.05;
  reset.visible = false;
  
}

function draw() {
  //setting background
  background(255);

  //making the axe follow the player y position
  axe.y = player.y;

  //displaying hunger text when mouse is hovering hunger image
  if(mouseX === 50 && mouseY === 60){
    text("Hunger",mouseX, mouseY);
  }


  //make the player and obstacle collide with the grounds
  player.collide(ground1);
  player.collide(ground2);
  player.collide(ground3);
  obstacleGroup.collide(ground1);
  obstacleGroup.collide(ground2);
  obstacleGroup.collide(ground3);

  if(gameState === PLAY){
  
    //bgSound.play();

    //give weapon if requirement is 3
    if(req === 3){
      weapon = 1; 
    }else{
      weapon = 0;
    }

    //destroy the
    if(req === 3 && player.isTouching(obstacleGroup) && weapon === 1){
      weapon = 0;
      req = 0;
      obstacleGroup.destroyEach();
      gameState = PLAY;
    }

    bg.velocityX = -3;
    if(bg.x < 0){
      bg.x = bg.width/2;
    }
    
    //console.log(player.y)
    //moving player
    if(player.position.y <= 220){
      if(keyDown("LEFT")){
        player.x -= 4;
      }
      if(keyDown("RIGHT")){
        player.x += 4;
      }
    }
    
    if(keyDown("UP")){
      player.shapeColor = "red";
      player.y = 205;
    }
    
    if(keyDown("R")){
      player.shapeColor = "red";
      player.y = 415;
    }
    
    if(keyDown("DOWN")){
      player.shapeColor = "red";
      player.y = 665;
    }

    //making player jump
    if(keyDown("SPACE")){
      player.velocityY = -10;
      hop.play();

    }
  
    //add gravity
    player.velocityY = player.velocityY + 0.5;

    if(frameCount % 15 === 0 && health >= 1 && radiation === 100){
      health -= 1;
    }

    if(frameCount % 100 === 0){
      hunger -= 1;
    }

    if(frameCount % 150 === 0 && radiation <= 99){
      radiation += 1;
    }

    if(foodGroup.isTouching(player)){
      hunger += 5;
      foodGroup.destroyEach();
      player.shapeColor = "yellow"
    }

    if(health === 0 && weapon === 0){
      gameState = END;
      grunt.play();
    }

    if(hunger >= 100){
      hunger = 100;
    }

    if(player.isTouching(obstacleGroup)){
      health = Math.round(health-50);
    }

    if(player.isTouching(reqGroup)){
      req += 1;
      reqGroup.destroyEach();

    }
    
  spawnFoods();
  spawnObstacles();
  weapons();

  }else if(gameState === END){
    foodGroup.setVelocityXEach(0);
    foodGroup.setLifetimeEach(-1);
    bg.velocityX = 0;

    player.changeAnimation("playerfallen",playerImg2);
    player.y = player.y + 50;
    
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
   
    player.setVelocity(0,0);

    gameOver.visible = true;
    reset.visible = true;

    if(mousePressedOver(reset)){
      restart();
    }

  }
  
  /*ground1.display();
  ground2.display();
  ground3.display();
  player.display();
  obstacle.display();*/

  drawSprites();

  image(groundImg,-250,210,displayWidth*2,50);
  image(groundImg,-250,410,displayWidth*2,50);
  image(groundImg,-250,660,displayWidth*2,50);

  text("x:"+mouseX+" y:"+mouseY ,mouseX,mouseY);

  stroke(25);
  strokeWeight(3);
	textSize(30);
	fill(255,100,100);
  text("Health:  " + health, 25, 25);
  text(hunger, 85, 70);

	fill(100,255,100);
  text(radiation, 85, 120);

  if(mouseIsOver(hg)){
    textSize(15);
    fill(200);
    text("Hunger", mouseX, mouseY);
  }

  if(mouseIsOver(rd)){
    textSize(15);
    fill(200);
    text("Radiation", mouseX, mouseY);
  }

  textSize(15);
  fill(200);
  text("Requirements: "+ req, width-150, 20);
  text("Weapon(lifeLine): " + weapon, width-150, 50);

}

function spawnFoods() {
  if(frameCount % 120 === 0) {
    var food = createSprite(width,random(200,685));
    food.velocityX  = -4;
    //- (6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: food.addImage(appleImg);        
      food.scale = 0.07;
              break;
      case 2: food.addImage(bananaImg);        
      food.scale = 0.04;
              break;
      case 3: food.addImage(garlicImg);        
      food.scale = 0.05;
              break;
      case 4: food.addImage(meatImg);        
      food.scale = 0.05;
              break;
      case 5: food.addImage(potatoImg);        
      food.scale = 0.03;
              break;
      case 6: food.addImage(waterImg);        
      food.scale = 0.1;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle   
    food.lifetime = width/4;
    foodGroup.add(food);
  }
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(width,random(210,685),50,50);
    obstacle.velocityX  = -(4 + flag);
    obstacle.velocityY  = 4;
    flag = flag++;

    obstacle.addImage(obsImg);
    obstacle.scale = 0.2;
    
    //assign scale and lifetime to the obstacle   
    obstacle.lifetime = width/4;
    obstacleGroup.add(obstacle);
  }
}

function restart(){
  gameState = PLAY;

  req = 0;
  player.changeAnimation("player");
  player.x = 200;
  player.y = 425;
  foodGroup.destroyEach();
  obstacleGroup.destroyEach();
  gameOver.visible = false;
  reset.visible = false;
  health = 100;
  hunger = 100;
  radiation = 0;
}

function weapons(){
  if(frameCount === 50){
    wood = createSprite(width,200,20,20);
    wood.addImage(woodImg);
    wood.scale = 0.25;
    wood.velocityX = -6;
    reqGroup.add(wood);

  }

  if(frameCount === 250){
    rope = createSprite(width,200,20,20);
    rope.addImage(ropeImg);
    rope.scale = 0.15;
    rope.velocityX = -6;
    reqGroup.add(rope);
    
  }

  if(frameCount === 400){
    stone = createSprite(width,200,20,20);
    stone.addImage(stoneImg);
    stone.scale = 0.07;
    stone.velocityX = -6;
    reqGroup.add(stone);

  }
  
}
