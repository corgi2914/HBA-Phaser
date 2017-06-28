function init(){
	game.renderer.renderSession.roundPixels = true;
}

function preload(){
	game.load.image('background', 'images/background.png');
	game.load.json('level:1', 'data/level01.json');
	// game.load.json('level:1', 'data/level01.json');
    //spawn platform sprites
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    game.load.image('grass:4x1', 'images/grass_4x1.png');
    game.load.image('grass:2x1', 'images/grass_2x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');
    game.load.image('hero', 'images/hero_stopped.png');
    game.load.audio('sfx:jump', 'audio/jump.wav');
};

function create(){
	game.add.image(0, 0, 'background');
	loadLevel(this.game.cache.getJSON('level:1'));
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(function(){
    	jump()
    });
    sfxJump = game.add.audio('sfx:jump');
};

function jump(){
	var canJump = hero.body.touching.down;
	if (canJump) {
		hero.body.velocity.y = -600;
	return canJump
};

function update(){
	handleInput();
	handleCollisions();
    handleInput();
};

function handleCollisions(){
	game.physics.arcade.collide(hero, platforms);
};

function handleInput() {
	if (leftKey.isDown) { // move hero left
		move(-1);
	}
	else if (rightKey.isDown) { // move hero right
	    move(1)
	}
	else { // stop
		move(0);
	}
};

function move(direction){
	hero.body.velocity.x = direction * 200;
	if (hero.body.velocity.x < 0) {
		hero.scale.x = -1;
	}
	else if (hero.body.velocity.y > 1) {
		(hero.scale.y = 0)
	}
}

function loadLevel(data) {
	platforms = game.add.group();
data.platforms.forEach(spawnPlatform, this);
  spawnCharacters({hero: data.hero});
  // create all the groups/layers that we need
    
    //Make sure this line of code is after!
      game.physics.arcade.y = 1200;
};

function spawnCharacters (data) {
	hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
	hero.anchor.set(0.5, 0.5);
	game.physics.enable(hero);
	hero.body.collideWorldBounds = true;

};

function spawnPlatform(platform) {
	game.add.sprite(platform.x, platform.y, platform.image);
	var sprite = platforms.create(platform.x, platform.y, platform.image);
	game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
};

//Create a game state
var game = new Phaser.Game(960, 600, Phaser.CANVAS, 'game', {init: init, preload: preload, create: create, update: update})};