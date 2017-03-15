
BasicGame.Game = function (game) {
	this.game = game;
	this.blueTank = null;
	this.speed = 4;
	this.fireSound = null;
	this.fire = null;
	this.DIRECTIONS = {
		'UP': 0,
		'DOWN': 180,
		'LEFT': -90,
		'RIGHT': 90
	};
	this.DIRECTION_FRAMES = {
		'up': 9,
		'down': 0,
		'left': 3,
		'right': 6
	};
	this.currentDirection = this.DIRECTIONS.UP;
	this.moving = false;
};

var upKey;
var downKey;
var leftKey;
var rightKey;
var spaceKey;
var tankGroup;

BasicGame.Game.prototype = {

	create: function () {
		this.game.stage.backgroundColor = '#dddddd';


		tankGroup = this.add.group();

		this.blueTank = this.add.sprite(250, 584, 'blueTank');
		this.blueTank.anchor.setTo(0.5, 0.5);
		this.blueTank.frame = 9;

		tankGroup.add(this.blueTank);

		this.blueTank.animations.add('moving', [9, 10], 15, true);

		this.fireSound = this.add.audio('fireSound');

		upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
		downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// Game init Code here.
	},


	update: function () {

		if (this.moving) {
			this.blueTank.animations.play('moving');
		} else {
			this.blueTank.animations.stop();
		}

		if (spaceKey.justUp) {
			this.fire = tankGroup.create(0, 0, 'fireExplosion');
			this.blueTank.frame = this.DIRECTION_FRAMES[this.currentDirection + 2];
			this.fireSound.play();
		} else if(this.fire) {
			this.fire.kill();
		}

		if (leftKey.isDown && this.blueTank.x > 8) {
			this.currentDirection = this.DIRECTIONS.LEFT;
			this.blueTank.angle = this.DIRECTIONS.LEFT;
			this.blueTank.x -= this.speed;
			this.moving = true;
		}
		else if (rightKey.isDown && this.blueTank.x < 792) {
			this.currentDirection = this.DIRECTIONS.RIGHT;
			this.blueTank.angle = this.DIRECTIONS.RIGHT;
			this.blueTank.x += this.speed;
			this.moving = true;
		}
		else if (upKey.isDown && this.blueTank.y > 8) {
			this.blueTank.y -= this.speed;
			this.blueTank.angle = this.DIRECTIONS.UP;
			this.currentDirection = this.DIRECTIONS.UP;
			this.moving = true;
		}
		else if (downKey.isDown && this.blueTank.y < 592) {
			this.blueTank.y += this.speed;
			this.blueTank.angle = this.DIRECTIONS.DOWN;
			this.currentDirection = this.DIRECTIONS.DOWN;
			this.moving = true;
		} else {
			this.moving = false;
		}
	},

	quitGame: function (pointer) {
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.game.state.start('MainMenu');
	}
};
