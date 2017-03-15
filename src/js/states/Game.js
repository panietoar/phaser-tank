
BasicGame.Game = function (game) {
	this.game = game;
	this.blueTank = null;
	this.speed = 2;
	this.fireSound = null;
	this.fire = null;
	this.cannon = null;
	this.DIRECTIONS = {
		'UP': -90,
		'DOWN': 90,
		'LEFT': 180,
		'RIGHT': 0
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

BasicGame.Game.prototype = {

	create: function () {
		this.game.stage.backgroundColor = '#dddddd';



		this.blueTank = this.add.sprite(250, 584, 'blueTank');
		this.blueTank.anchor.setTo(0.5, 0.5);
		this.blueTank.frame = 6;


		this.blueTank.animations.add('moving', [6, 7], 5, true);
		this.blueTank.animations.add('firing', [6, 8], 4, true);

		this.fireSound = this.add.audio('fireSound');

		upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
		downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// Game init Code here.

		this.cannon = this.add.weapon(1, 'shot');
		this.cannon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.cannon.trackSprite(this.blueTank, 8, 0, true);
		this.cannon.bulletSpeed = 350;

	},

	update: function () {

		if (this.moving) {
			this.blueTank.animations.play('moving');
		} else {
			this.blueTank.animations.stop();
		}

		if (spaceKey.justUp) {
			if (this.cannon.bullets.countLiving() === 0) {
				this.blueTank.animations.play('firing');
				this.fireSound.play();
				this.fire = this.blueTank.addChild(this.make.sprite(8, -4, 'fireExplosion'));
				this.fire.lifespan = 120;
			}
			this.cannon.fire();
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
