var upKey;
var downKey;
var leftKey;
var rightKey;
var spaceKey;

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
	this.moving = false;
};

BasicGame.Game.prototype = {

	create: function () {
		this.game.stage.backgroundColor = '#dddddd';
		this.fireSound = this.add.audio('fireSound');

		this.createTank();
		this.createInput();
		this.createCannon();
	},

	update: function () {

		if (this.moving) {
			this.blueTank.animations.play('moving');
		} else {
			this.blueTank.animations.stop();
		}

		this.handleInput();

		if (spaceKey.justUp) {
			this.fireCannon();
		}

	},

	fireCannon: function () {
		if (this.cannon.bullets.countLiving() === 0) {
			this.blueTank.animations.play('firing');
			this.fireSound.play();
			this.fire = this.blueTank.addChild(this.make.sprite(8, -4, 'fireExplosion'));
			this.fire.lifespan = 120;
		}
		this.cannon.fire();
	},

	handleInput: function () {
		if (leftKey.isDown && this.blueTank.x > 16) {
			this.blueTank.angle = this.DIRECTIONS.LEFT;
			this.blueTank.x -= this.speed;
			this.moving = true;
		}
		else if (rightKey.isDown && this.blueTank.x < 784) {
			this.blueTank.angle = this.DIRECTIONS.RIGHT;
			this.blueTank.x += this.speed;
			this.moving = true;
		}
		else if (upKey.isDown && this.blueTank.y > 16) {
			this.blueTank.angle = this.DIRECTIONS.UP;
			this.blueTank.y -= this.speed;
			this.moving = true;
		}
		else if (downKey.isDown && this.blueTank.y < 584) {
			this.blueTank.angle = this.DIRECTIONS.DOWN;
			this.blueTank.y += this.speed;
			this.moving = true;
		} else {
			this.moving = false;
		}
	},

	createTank: function () {
		this.blueTank = this.add.sprite(16, 584, 'blueTank');
		this.blueTank.anchor.setTo(0.5, 0.5);
		this.blueTank.frame = 7;
		this.blueTank.scale.setTo(2, 2);
		this.blueTank.animations.add('moving', [7, 6], 10, true);
		this.blueTank.animations.add('firing', [7, 8], 20, true);
	},

	createInput: function () {
		upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
		downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	createCannon: function() {
		this.cannon = this.add.weapon(1, 'shot');
		this.cannon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.cannon.trackSprite(this.blueTank, 16, 0, true);
		this.cannon.bulletSpeed = 350;
	},

	quitGame: function (pointer) {
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.game.state.start('MainMenu');
	}

};
