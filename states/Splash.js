var Splash = function () {};

Splash.prototype = {

    loadScripts: function () {
        game.load.script('style', 'lib/style.js');
        game.load.script('mixins', 'lib/mixins.js');
        game.load.script('WebFont', 'vendor/webfontloader.js');
        game.load.script('gamemenu', 'states/GameMenu.js');
        game.load.script('game', 'states/Game.js');
        game.load.script('gameover', 'states/GameOver.js');
        game.load.script('credits', 'states/Credits.js');
        game.load.script('options', 'states/Options.js');
    },

    loadBgm: function () {
        // thanks Kevin Macleod at http://incompetech.com/
        game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
        game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
        game.load.audio('bongo', 'assets/bgm/Bongo_Madness.mp3');
        game.load.audio('wishful', 'assets/bgm/Wishful_Thinking.mp3');
        game.load.audio('francis', 'assets/bgm/St_Francis.mp3');
    },
    // varios freebies found from google image search
    loadImages: function () {
        game.load.image('options-bg', 'assets/images/options.png');
        game.load.image('menu-bg', 'assets/images/menu-bg.png');
        game.load.image('gameover-bg', 'assets/images/gameover-bg.png');
        game.load.image('green-bar', 'assets/images/green.png');
        game.load.image("paused-board", 'assets/images/number-buttons-90x90.png');
        game.load.image("Game_bg", 'assets/images/inGame_bg.png');

    },

    loadFonts: function () {
        WebFontConfig = {
            custom: {
                families: ['TheMinion'],
                urls: ['assets/style/theminion.css']
            }
        }
    },

    init: function () {
        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 400, "loading");
        this.logo = game.make.sprite(game.world.centerX, 200, 'brand');
        this.status = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
        utils.centerGameObjects([this.logo, this.status]);
    },

    preload: function () {
        game.add.sprite(0, 0, 'star');
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        this.loadScripts();
        this.loadImages();
        this.loadFonts();
        this.loadBgm();

    },

    addGameStates: function () {

        game.state.add("GameMenu", GameMenu);
        game.state.add("Game", Game);
        game.state.add("GameOver", GameOver);
        game.state.add("Credits", Credits);
        game.state.add("Options", Options);
    },

    addGameMusic: function () {
        music_wishful = game.add.audio('wishful');
        music_bongo = game.add.audio('bongo');
        music_francis = game.add.audio('francis');
        music_wishful.loop = true;
        music_bongo.loop = true;
        music_francis.loop = true;
        console.log('splash play', gameOptions.playMusic, gameOptions.playSound);
        if (gameOptions.playMusic !== false) {
            gameOptions.music_current = music_wishful.name;
            music_wishful.play();
        }
    },

    create: function () {
        this.status.setText('Ready!');
        this.addGameStates();
        this.addGameMusic();

        setTimeout(function () {
            game.state.start("GameMenu");
        }, 1000);
    }
};
