var upKey;
var downKey;
var leftKey;
var rightKey;
var spaceKey;
var enemyAngle;

BasicGame.Game = function (game) {
	this.game = game;
	this.blueTank = null;
	this.enemyTank = null;
	this.speed = 2;
	this.fireSound = null;
	this.fire = null;
	this.enemyFire = null;
	this.cannon = null;
	this.enemyCannon = null;
	this.enemyExplotion = null;
	this.playerExplotion = null;
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

		this.add.tileSprite(0, 0, 800, 576, 'grassField');

		this.physics.startSystem(Phaser.Physics.ARCADE);
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
		this.updateEnemy();
		//this.physics.arcade.collide(this.blueTank, this.enemyTank);

		this.physics.arcade.overlap(this.cannon.bullets, this.enemyTank, this.enemyImpactHandler, null, this);
		this.physics.arcade.overlap(this.enemyCannon.bullets, this.blueTank, this.playerImpactHandler, null, this);
	},

	fireCannon: function () {
		if (this.cannon.bullets.countLiving() === 0) {
			this.fire = this.blueTank.addChild(this.make.sprite(16, -8, 'fireExplotion'));
			this.blueTank.animations.play('firing');
			this.fireSound.play();
			this.fire.lifespan = 120;
		}
		this.cannon.fire();
	},


	handleInput: function () {

		if (spaceKey.justUp) {
			this.fireCannon();
		}

		if (leftKey.isDown) {
			this.blueTank.angle = this.DIRECTIONS.LEFT;
			this.blueTank.x -= this.speed;
			this.moving = true;
		}
		else if (rightKey.isDown) {
			this.blueTank.angle = this.DIRECTIONS.RIGHT;
			this.blueTank.x += this.speed;
			this.moving = true;
		}
		else if (upKey.isDown) {
			this.blueTank.angle = this.DIRECTIONS.UP;
			this.blueTank.y -= this.speed;
			this.moving = true;
		}
		else if (downKey.isDown) {
			this.blueTank.angle = this.DIRECTIONS.DOWN;
			this.blueTank.y += this.speed;
			this.moving = true;
		} else {
			this.moving = false;
		}
	},

	createInput: function () {
		upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
		downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	enemyImpactHandler: function (enemy, bullet) {
		bullet.kill();
		this.enemyExplotion.play(10, false, true);
		this.createEnemyTank();
	},

	playerImpactHandler: function (enemy, bullet) {
		bullet.kill();
		this.playerExplotion.play(10, false, true);
		//this.quitGame();
	},

	createTank: function () {
		this.blueTank = this.add.sprite(16, 584, 'blueTank');
		this.blueTank.anchor.setTo(0.5, 0.5);
		this.blueTank.animations.add('moving', [1, 0], 15, true);
		this.blueTank.animations.add('firing', [0, 2], 2, true);
		this.playerExplotion = this.blueTank.animations.add('explotion', [3, 4, 5, 6, 7], 20, false);
		this.createEnemyTank();
	},

	createCannon: function () {
		this.cannon = this.add.weapon(1, 'shot');
		this.cannon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.cannon.trackSprite(this.blueTank, 32, 0, true);
		this.cannon.bulletSpeed = 350;
	},

	createEnemyTank: function () {
		this.enemyTank = this.add.sprite(this.world.randomX, this.world.randomY, 'redTank');
		this.enemyTank.anchor.setTo(0.5, 0.5);
		this.physics.arcade.enable([this.blueTank, this.enemyTank]);
		this.enemyExplotion = this.enemyTank.animations.add('explotion', [3, 4, 5, 6, 7], 20, false);
		this.enemyTank.body.immovable = true;
		this.blueTank.body.collideWorldBounds = true;
		this.createEnemyCannon();
	},

	createEnemyCannon: function () {
		this.enemyCannon = this.add.weapon(1, 'shot');
		this.enemyCannon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.enemyCannon.trackSprite(this.enemyTank, 32, 0, true);
		this.enemyCannon.bulletSpeed = 350;
	},

	fireEnemyCannon: function () {
		this.enemyFire = this.enemyTank.addChild(this.make.sprite(16, -8, 'fireExplotion'));
		this.enemyTank.animations.play('firing');
		this.fireSound.play();
		this.enemyFire.lifespan = 120;
		this.enemyCannon.fire();
	},

	updateEnemy: function () {
		if (this.enemyCannon.bullets.countLiving() === 0) {
			this.fireEnemyCannon();
		}

		var enemyAngle = this.physics.arcade.angleBetween(this.enemyTank, this.blueTank);

		if (enemyAngle >= -0.78 && enemyAngle < 0.78) {
			this.enemyTank.angle = this.DIRECTIONS.RIGHT;
			this.enemyTank.x += (this.speed - 1);
		} else
			if (enemyAngle >= 0.78 && enemyAngle < 2.35) {
				this.enemyTank.angle = this.DIRECTIONS.DOWN;
				this.enemyTank.y += (this.speed - 1);
			} else
				if (enemyAngle >= 2.35 || enemyAngle < -2.35) {
					this.enemyTank.angle = this.DIRECTIONS.LEFT;
					this.enemyTank.x -= (this.speed - 1);
				} else
					if (enemyAngle >= -2.35 && enemyAngle < -0.78) {
						this.enemyTank.angle = this.DIRECTIONS.UP;
						this.enemyTank.y -= (this.speed - 1);
					}

	},

	quitGame: function (pointer) {
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.game.state.start('MainMenu');
	}

};
