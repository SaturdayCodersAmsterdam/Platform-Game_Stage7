var cursors;
var game = new Phaser.Game(640,480, Phaser.AUTO, 'world', {
  preload: preload, create: create, update: update });

var mexicanX = 200;
var mexicanY= 100;
var boxX = 200;
var boxY = 250;
var liftX = 400;
var liftY = 250;
var lift ;
var mySprite;
var mexican;

var armX = 46;
var armY= 93;
var pumpX = 62;
var pumpY= 168;
var weightX = 0;
var weightY= 345;

var x = game.width/2;
var y = game.height/2;
var dirX = 10;
var dirY = 10;
var emitter;
var path;
var index;
var weapon;
var fireButton;
var student;

function preload() {
    game.load.image('mySprite', 'assets/sprite.png');

    game.load.image('arm', 'assets/arm.png');
    game.load.image('pump', 'assets/pump.png');
    game.load.image('weight', 'assets/weight.png');

    game.load.image('fire1', 'assets/fire1.png');
    game.load.image('fire2', 'assets/fire2.png');
    game.load.image('fire3', 'assets/fire3.png');
    game.load.image('smoke', 'assets/smoke-puff.png');

    game.load.image('pixel', 'assets/trans-pixel.png');

    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('box', 'assets/box.png');
    game.load.image('lift', 'assets/lift.png');
    game.load.image('background', 'assets/header.jpg');
    game.load.atlasJSONHash('student', 'assets/student.png','assets/student.json');
    game.load.atlasJSONHash('mexican', 'assets/mexican.png', 'assets/mexican.json');

    game.load.image('pixel', 'assets/trans-pixel.png');
    game.load.script('HudManager', 'plugins/HUDManager.js');
}


function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#333';
    game.add.tileSprite(-400,-400, 2000, 1600, 'background');
    emitter = game.add.emitter(game.world.centerX, game.world.centerY, 400);

    emitter.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );


    emitter.gravity = 800;
    emitter.setAlpha(1, 0, 3000);

    mySprite = game.add.sprite( 600,480, 'student');
    mySpritePixel = game.add.sprite( 600,480, 'pixel');


    game.physics.enable(mySpritePixel, Phaser.Physics.ARCADE);

    mySpritePixel.body.enable          = true;
    mySpritePixel.body.allowRotation   = true;

    //mySpritePixel.anchor.setTo(0.5, 0.5);
    //mySpritePixel.body.offset.setTo(0,0);


    mySprite.animations.add('left', ['left1', 'left2','left3', 'left4','left5', 'left6','left7', 'left8','left9']);
    mySprite.animations.add('right', ['right1', 'right2','right3', 'right4','right5', 'right6','right7', 'right8', 'right9']);
    mySprite.animations.add('up'), ['up1', 'up2','up3', 'up4','up5', 'up6','up7', 'up8','up9'];
    mySprite.animations.add('down', ['down1', 'down2']);


    mexican = game.add.sprite( mexicanX, mexicanY, 'mexican');
    box = game.add.sprite( boxX, boxY, 'box');
    lift = game.add.sprite( liftX, liftY, 'lift');


    pump = game.add.sprite( pumpX, pumpY, 'pump');
    arm = game.add.sprite( armX, armY, 'arm');
    weight = game.add.sprite( weightX, weightY, 'weight');

    mexican.animations.add('stop');
    mexican.animations.play('stop', 5, true);


    mexican.id                  = 1;
    mexican.maxHealth           = 100;
    mexican.health              = 100;
    mexican.anchor.setTo(0.5, 0.5);
    game.physics.enable(mexican, Phaser.Physics.ARCADE);
    mexican.hud                 = Phaser.Plugin.HUDManager.create(mexican.game, mexican, 'enemyhud');
    mexican.healthHUD           =mexican.hud.addBar(0, -20, 32, 2, mexican.maxHealth, 'health', mexican, Phaser.Plugin.HUDManager.HEALTHBAR, false);
    mexican.healthHUD.bar.anchor.setTo(0.5, 0.5);
    mexican.addChild(mexican.healthHUD.bar);
    mexican.body.immovable      = true;

    game.physics.arcade.enable(mexican);
    game.physics.arcade.enable(box);
    game.physics.arcade.enable(lift);
    mexican.body.gravity.set(0, 180);
    mexican.body.collideWorldBounds = true;
    lift.body.collideWorldBounds = true;
    box.body.collideWorldBounds = true;
    //mySprite.scale.x = 0.99;
    //mySprite.scale.y = 0.99;
    mySprite.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(mySprite);
    mySprite.body.velocity.setTo(200, 200);
    // makes image collideable
    mySprite.body.collideWorldBounds = true;
    // mySprite.bounce.set(0.8);
    mySprite.body.gravity.set(0, 180);
    //mySprite.inputEnabled = true;

    game.physics.arcade.enable(box);

    game.physics.arcade.enable(lift);

    cursors = game.input.keyboard.createCursorKeys();

    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 600;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 100;

    game.physics.arcade.enable(weapon);
    //  Tell the Weapon to track the 'mySprite' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    weapon.trackSprite(mySpritePixel, 0, 0, true);

}

function update () {

    game.physics.arcade.collide(mexican, box, yahoo);
    game.physics.arcade.collide(mexican, weapon.bullets, bomb, null, this);



    game.physics.arcade.collide(mySprite, box, yahoo);
    game.physics.arcade.collide(mySprite, lift, yahoo);



    if (x > game.width - mySprite.width || x < 0) {
        dirX = -dirX;
    }
    if (y > game.height - mySprite.height || y < 0) {
        dirY = -dirY;
    }


    if (cursors.down.isDown) {
      //  mySprite.y = mySprite.y + 1;
     //   mySpritePixel.y =   mySprite.y;
     //   console.log(mySprite.y);
    }
    if (cursors.up.isDown) {
        mySprite.y = mySprite.y - 10;
        particleBurst();
        //  emitter.start(false, 3000, 5);
        mySprite.animations.play('up', 30, false);

        console.log(mySprite.y);
    }
    else {
        mySprite.animations.play('stop', 30, false);
    }

    if (cursors.left.isDown) {
        if (cursors.up.isDown) {
            mySprite.x = mySprite.x - 10;
        } else {
            mySprite.x = mySprite.x - 5;
        }
        mySprite.animations.play('left', 15, false);

       // mySpritePixel.x = x;
        mySpritePixel.angle = 180;

    }
    else if (cursors.right.isDown) {
        if (cursors.up.isDown) {
            mySprite.x = mySprite.x + 10;
        } else {
            mySprite.x = mySprite.x + 5;
        }
        mySprite.animations.play('right', 15, false);
        mySpritePixel.x = x;
        mySpritePixel.angle = 0;


    } else {
        mySprite.animations.play('stop', 15, false);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        weapon.fire();
    }

    mySpritePixel.y =   mySprite.y;
    mySpritePixel.x =   mySprite.x;


}


function bomb(whatsthis, bullet){
    console.log(bullet);

    mexican.health = mexican.health -10;

    if  (mexican.health<=60){

        mexican.kill();
    }
    bullet.kill();
}


function particleBurst() {
    var px = mySprite.body.velocity.x;
    var py = mySprite.body.velocity.y;

    px *= -1;
    py *= -1;

    emitter.minParticleSpeed.set(px, py);
    emitter.maxParticleSpeed.set(px, py);

    emitter.emitX = mySprite.x;
    emitter.emitY = mySprite.y;

    // Phaser.Particles.Arcade.Emitter.setScale(minX, maxX, minY, maxY, rate, ease, yoyo) : void;
    emitter.setScale(0.1,0, 0.1,0, 3000);

    emitter.start(true, 100, null, 5);

    //  And 2 seconds later we'll destroy the emitter
    game.time.events.add(500, destroyEmitter);

}

function destroyEmitter() {

    if (emitter !== null){
        //   emitter.destroy();
    }
}

function yahoo(){

    console.log('yahoo');

}

function onDown(dog) {
  console.log('clicked');
  console.log(mySprite.x);
  console.log(mySprite.y);
}
