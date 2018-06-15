// Global Variables
var game = new Phaser.Game(540, 960, Phaser.AUTO, 'game'),
    Main = function () {},
    gameOptions = {
        playSound: true,
        playMusic: true,
        music_current: null,
        targetNumber: true,
        digitRange: true,
        winFactor: true
    },
    musicPlayer;




Main.prototype = {

    preload: function () {
        game.load.image('star', 'assets/images/star.png');
        game.load.image('loading', 'assets/images/loading.png');
        game.load.image('brand', 'assets/images/logo.png');
        game.load.script('polyfill', 'lib/polyfill.js');
        game.load.script('utils', 'lib/utils.js');
        game.load.script('splash', 'states/Splash.js');
    },

    create: function () {
        game.state.add('Splash', Splash);
        game.state.start('Splash');
    }

};

game.state.add('Main', Main);
game.state.start('Main');
