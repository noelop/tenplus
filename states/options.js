var Options = function(game) {};

Options.prototype = {

    menuConfig: {
        className: "inverse",
        startY: 260,
        startX: "center"
    },


    init: function () {
        this.titleText = game.make.text(game.world.centerX, 100, "Game Title", {
            font: 'bold 60pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;
    },
    create: function () {
        var playSound = gameOptions.playSound,
            playMusic = gameOptions.playMusic;

        game.add.sprite(0, 0, 'options-bg');
        game.add.existing(this.titleText);
        this.addMenuOption(playMusic ? 'Mute Bg Music' : 'Play Bg Music', function (target) {
            playMusic = !playMusic;
            target.text = playMusic ? 'Mute Bg Music' : 'Play Bg Music';
            gameOptions.playMusic = !!playMusic;
            // musicPlayer.volume = playMusic ? 1 : 0;
            if (gameOptions.playMusic === false) {
                music_wishful.stop();
                music_bongo.stop();
            }
        });
        this.addMenuOption(playSound ? 'Mute Ef Sound' : 'Play Ef Sound', function (target) {
            playSound = !playSound;
            target.text = playSound ? 'Mute Ef Sound' : 'Play Ef Sound';
            gameOptions.playSound = !!playSound;
        });
        this.addMenuOption('<- Back', function () {
            game.state.start("GameMenu");
        });
    }
};

Phaser.Utils.mixinPrototype(Options.prototype, mixins);
