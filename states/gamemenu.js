var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 30
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
    console.log('mucis_current:', music_current);
    console.log('Music:', gameOptions.playMusic);
    if (music_current !== "wishful" || gameOptions.playMusic !== false) {
      music_bongo.stop();
      music_current = music_wishful.name;
      music_wishful.play();
    }
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

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
    this.addMenuOption(targetNumber ? 'T:five':'T:three' , function (target) {
      targetNumber = !targetNumber;
      target.text = targetNumber ? 'T:five':'T:three';
      gameOptions.targetNumber = targetNumber;
    });
    this.addMenuOption(digitRange ? 'R:ten':'R:five', function (target) {
      digitRange = !digitRange;
      target.text = digitRange ? 'R:ten':'R:five';
      gameOptions.digitRange = digitRange;
    });
    this.addMenuOption(winFactor ? 'F:step':'F:time', function (target) {
      winFactor = !winFactor;
      target.text = winFactor ? 'F:step':'F:time';
      gameOptions.winFactor = winFactor;
    });
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
