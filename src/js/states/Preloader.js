
BasicGame.Preloader = function (game) {

	this.game = game;
	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		this.load.image('titlepage', 'assets/img/title800.jpeg');
		this.load.image('playButton', 'assets/img/playButton.png');
		this.load.spritesheet('blueTank', 'assets/img/blue.png', 32, 32);
		this.load.spritesheet('redTank', 'assets/img/red.png', 32, 32);
		this.load.image('fireExplosion', 'assets/img/right.png');
		this.load.image('shot', 'assets/img/shot.png');
		this.load.image('grassField', 'assets/img/backgrounds/backgrounddetailed1.png');
		//this.load.atlas('playButton', 'assets/img/x.png', 'assets/img/button_texture_atlas.json');

		this.load.audio('fireSound', ['assets/audio/fire.wav']);
		//this.load.bitmapFont('caslon', 'assets/img/desyrel-pink.png', 'asstes/img/desyrel-pink.xml');
	},

	create: function () {
        //this.preloadBar.cropEnabled = false;
	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.

        this.ready = true;
        this.game.state.start('MainMenu');

		/*if (this.cache.isSoundDecoded('titleMusic') && this.ready === false)
		{
			this.ready = true;
			this.game.state.start('MainMenu');
		}*/

	}

};
