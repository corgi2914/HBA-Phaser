var coinPickupCount = 0;

function init(){
//Make hero sprite more focused when moving around
    game.renderer.renderSession.roundPixels = true;
}

function preload(){
  game.load.image('background', 'images/background.png');
  // game.load.image('background', 'images/background.png');
  game.load.json('level:1', 'data/level01.json'); 
  // ...
    // game.load.json('level:1', 'data/level01.json');
    //spawn platform sprites
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    game.load.image('grass:4x1', 'images/grass_4x1.png');
    game.load.image('grass:2x1', 'images/grass_2x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');
    // ? - load the image for grass:4x1
    // ? - load the image for grass:2x1
    // ? - load the image for grass:1x1
    // ...

    // load the hero image
    game.load.image('hero', 'images/hero_stopped.png');
    //game.load.image('grass:1x1', 'images/grass_1x1.png');

    //Play a sound effect when jumping
    game.load.audio('sfx:jump', 'audio/jump.wav');
    // ...
    game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);

    game.load.audio('sfx:coin', 'audio/coin.wav');
    // ...
    game.load.spritesheet('spider', 'images/spider.png', 42, 32);

    // game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    // Add invisible "walls" so the spiders don't fall off platforms
    game.load.image('invisible-wall', 'images/invisible_wall.png');
    // ...
    // platforms = game.add.group();
    // spiders = game.add.group();
    enemyWalls = game.add.group();
    // ...

    // ...
    game.load.audio('sfx:stomp', 'audio/stomp.wav');
    // ? - Load the audio 'sfx:stomp' from 'audio/stomp.wav'
    // ...
    game.load.image('icon:coin', 'images/coin_icon.png');
    // ? - load the image 'images/coin_icon.png' and set as 'icon:coin'
    // ...
    game.load.image('font:numbers', 'images/numbers.png');
    // ? - load the image 'images/numbers.png' and set as 'font:numbers'
    // ...
    // ...
    game.load.spritesheet('door', 'images/door.png', 42, 66);
    // ...
    game.load.image('key', 'images/key.png');

};

function create(){
	game.add.image(0, 0, 'background');
  // game.add.image(0, 0, 'background');
  loadLevel(this.game.cache.getJSON('level:1'));
  //This sets the left and right keys as inputs for this game
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(function(){
        jump();
    });
    // game.add.image(0, 0, 'background');

    sfxJump = game.add.audio('sfx:jump');
    sfxCoin = game.add.audio('sfx:coin');

    // ...
    sfxStomp = game.add.audio('sfx:stomp');
    // ? - Add the audio 'sfx:stomp' and set to value of sfxStomp
    coinIcon = game.make.image(40, 0, 'icon:coin');

    hud = game.add.group();
    hud.add(coinIcon);
    hud.position.set(10, 10);
    // ...
    var NUMBERS_STR = "0123456789X ";
    // ? - Declare a variable 'NUMBERS_STR' and set its value as string '0123456789X '
    coinFont = game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);
    // ...
    // let coinIcon = ...
    var coinScoreImg = game.make.image(100 + coinIcon.width, coinIcon.height / 2, coinFont);
    coinScoreImg.anchor.set(1, 0.5);

    // ...
    hud.add(coinScoreImg);
  
}

function update(){
    handleInput();
    handleCollisions();
    moveSpider();
}

function loadLevel(data) {
    platforms = game.add.group();
    // spawn all platforms
    data.platforms.forEach(spawnPlatform, this);
    // game.add.image(0, 0, 'background');
    coins = game.add.group();
    // ? - Add a group to the game and set it to the value of 'coins'
    spiders = game.add.group();
    // ...

    spawnCharacters({hero: data.hero, spiders: data.spiders});  
    // spawn important objects
    data.coins.forEach(spawnCoin, this);

    // ...

    // spawn hero and enemies
    //Enable gravity
    game.physics.arcade.gravity.y = 1200;
    // create all the groups/layers that we need
    //Make sure this line of code is after!
    // ...
    bgDecoration = game.add.group();
    // ...
    // ...
    // after spawning the coins in this line:
    // data.coins.forEach(spawnCoin, this);
    spawnDoor(data.door.x, data.door.y);
    // ...
    // ...
    // add it below the call to spawnDoor
    // spawnDoor(data.door.x, data.door.y);
    spawnKey(data.key.x, data.key.y);
    // ...
    
};

function spawnCharacters (data) {
    // spawn hero
    hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
    // spawn hero
    // hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
    hero.anchor.set(0.5, 0.5);
    // hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
    //Make the main character use the physics engine for movement
    game.physics.enable(hero);

    //Prevent the main character to get out of the screen
    hero.body.collideWorldBounds = true;

    // ...
    data.spiders.forEach(function (spider){
        var sprite = game.add.sprite(spider.x, spider.y, 'spider');
        spiders.add(sprite);
        sprite.anchor.set(0.5);
        // animation
        sprite.animations.add('crawl', [0, 1, 2], 8, true);
        sprite.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        sprite.animations.play('crawl');
        game.physics.enable(sprite);
        sprite.body.collideWorldBounds = true;
        sprite.body.velocity.x = 100
        // ? - Set the sprite.body.velocity.x to value 100
    })

};

function spawnPlatform(platform) {
    game.add.sprite(platform.x, platform.y, platform.image);
    var sprite = platforms.create(platform.x, platform.y, platform.image);
    game.physics.enable(sprite);
    // ? - Enable the game physics for the sprite
    // game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    // sprite.body.allowGravity = false;
    sprite.body.immovable = true;
     // ...
    spawnEnemyWall(platform.x, platform.y, 'left');
    spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

function move(direction){
    hero.body.velocity.x = direction * 200;
    // hero.body.velocity.x = direction * 200;
    if (hero.body.velocity.x < 0) {
        hero.scale.x = -1;
    }
    else if (hero.body.velocity.x > 1) {
        hero.scale.x= 1
    }
}

function handleInput(){
    if (leftKey.isDown) { // move hero left
        move(-1);
    }
    else if (rightKey.isDown) { // move hero right
        move(1);
    }
    else { // stop
        move(0);
    }
}

function handleCollisions(){
    game.physics.arcade.collide(hero, platforms);
    //...
    game.physics.arcade.overlap(hero, coins, onHeroVsCoin, null);
    
    game.physics.arcade.collide(spiders, platforms);
    // ? - Set the collision between spiders and platforms
    game.physics.arcade.collide(spiders, enemyWalls);
    // ...
    // ...
    game.physics.arcade.overlap(hero, spiders, onHeroVsEnemy, null);
};

function jump(){
var canJump = hero.body.touching.down;
    //Ensures hero is on the ground or on a platform
    if (canJump) {
        hero.body.velocity.y = -600;
        sfxJump.play();
        return canJump;
    }
    // ? - return the variable canJump
}

function spawnCoin(coin) {
    var sprite = coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    // ...
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
    // ...
    game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

function onHeroVsCoin(hero, coin){
    coinPickupCount++;
    coin.kill();
    sfxCoin.play();
    // ...
    coinFont.text = `x${coinPickupCount}`;
    // ...
};

function spawnEnemyWall(x, y, side){
    var sprite = enemyWalls.create(x, y, 'invisible-wall');
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
}

function moveSpider(){
    spiders.forEach(function (spider){
        if (spider.body.touching.right || spider.body.blocked.right) {
            spider.body.velocity.x = -100; // turn left
        }
        else if (spider.body.touching.left || spider.body.blocked.left) {
            spider.body.velocity.x = 100;
            // ? - Change spiders velocity to turn right
        }
    })
}

function onHeroVsEnemy(hero, enemy) {
    if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
        hero.body.velocity.y = -200;
        die(enemy);
        sfxStomp.play();
    }
    else { // game over -> restart the game
        sfxStomp.play();
        game.state.restart();
    }
 };

function die(spider){
    spider.body.enable = false;
    spider.animations.play('die');
    spider.animations.play('die').onComplete.addOnce(function () {
        spider.kill();
    });
}

function spawnSpider(){
    spider = spiders.create(spider.x, spider.y, 'spider');
    spider.anchor.set(0.5);
    spider.animations.add('crawl', [0, 1, 2], 8, true);
    spider.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 1);
    spider.animations.play('crawl');

    // physic properties
    game.physics.enable(spider);
    spider.body.collideWorldBounds = true;
    spider.body.velocity.x = Spider.speed;
}

function spawnDoor(x, y){
    door = bgDecoration.create(x, y, 'door');
    door.anchor.setTo(0.5, 1);
    game.physics.enable(door);
    door.body.allowGravity = false;
}

function spawnKey(x, y){
    key = bgDecoration.create(x, y, 'key');
    key.anchor.set(0.5, 0.5);
    game.physics.enable(key);
    key.body.allowGravity = false;
}

//Create a game state
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});