var GameMenu = function() {};


GameMenu.prototype = {

    menuConfig: {
        startY: 260,
        startX: 30
    },

    init: function () {
        this.titleText = game.make.text(game.world.centerX, 100, "Numeral!", {
            font: 'bold 60pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;

        this.targetMul = game.make.text(285, 330, "Target Mul", {
            font: 'bold 25pt TheMinion',
            fill: '#ffffff',
        });
        this.numRange = game.make.text(285, 450, "Num Range", {
            font: 'bold 25pt TheMinion',
            fill: '#ffffff',
        });
        console.log("gamemenu music = "+gameOptions.playMusic);
    },

    create: function () {

        if (gameOptions.playMusic !== false) {
            if (gameOptions.music_current !== "wishful") {
                console.log('menu play');
                music_bongo.stop();
                gameOptions.music_current = music_wishful.name;
                music_wishful.play();
            }
        }
        game.stage.disableVisibilityChange = true;
        game.add.sprite(0, 0, 'menu-bg');
        game.add.existing(this.titleText);
        game.add.existing(this.targetMul);
        game.add.existing(this.numRange);

        this.addMenuOption('Start', function () {
            game.state.start("Game");
        });
        this.addMenuOption('Options', function () {
            game.state.start("Options");
        });
        this.addMenuOption('Credits', function () {
            game.state.start("Credits");
        });

        var targetNumber = gameOptions.targetNumber,
            digitRange = gameOptions.digitRange,
            winFactor = gameOptions.winFactor;
        this.addMenuOption(targetNumber ? 'five' : 'three', function (target) {
            targetNumber = !targetNumber;
            target.text = targetNumber ? 'five' : 'three';
            gameOptions.targetNumber = targetNumber;
        });
        this.addMenuOption(digitRange ? 'ten' : 'five', function (target) {
            digitRange = !digitRange;
            target.text = digitRange ? 'ten' : 'five';
            gameOptions.digitRange = digitRange;
        });
        
        //this.addMenuOption(winFactor ? 'F:step' : 'F:time', function (target) {
        //    winFactor = !winFactor;
        //    target.text = winFactor ? 'F:step' : 'F:time';
        //    gameOptions.winFactor = winFactor;
        //});
    }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
