var GameOver = function(game) {};

GameOver.prototype = {

    preload: function () {
        this.optionCount = 1;
    },

    addMenuOption: function (text, callback) {
        var optionStyle = {
            font: '30pt TheMinion',
            fill: 'white',
            align: 'left',
            stroke: 'rgba(0,0,0,0)',
            srokeThickness: 4
        };
        var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 300, text, optionStyle);
        txt.anchor.setTo(0.5);
        txt.stroke = "rgba(0,0,0,0";
        txt.strokeThickness = 4;
        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            txt.useHandCursor = true;
        };
        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            txt.useHandCursor = false;
        };
        //txt.useHandCursor = true;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);

        this.optionCount++;


    },
    addTextOption: function (text, x, y, callback = null, fontSize = 30, fontStyle = 'TheMinion') {
        var optionStyle = {
            font: fontSize + 'pt ' + fontStyle,
            fill: 'white',
            align: 'left',
            stroke: 'rgba(0,0,0,0)',
            srokeThickness: 4
        };
        var txt = game.add.text(x, y, text, optionStyle);
        txt.anchor.setTo(0.5);
        txt.stroke = "rgba(0,0,0,0)";
        txt.strokeThickness = 4;
        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            txt.useHandCursor = true;
        };
        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            txt.useHandCursor = false;
        };
        //txt.useHandCursor = true;
        if (callback !== null) {
            txt.inputEnabled = true;
            txt.events.onInputUp.add(callback, this);
            txt.events.onInputOver.add(onOver, this);
            txt.events.onInputOut.add(onOut, this);
        }
        return txt;
    },


  addCredit: function(s, r, x, y) {
      var authorStyle = {
          font: '40pt Impact',
          fill: 'white',
          align: 'center',
          stroke: 'rgba(0,0,0,0)',
          strokeThickness: 4
      };
      var taskStyle = {
          font: '30pt Impact',
          fill: 'white',
          align: 'center',
          stroke: 'rgba(0,0,0,0)',
          strokeThickness: 4
      };
      var authorText = game.add.text(x, 1000, r, authorStyle);
      var taskText = game.add.text(x, 1050, s, taskStyle);
      authorText.anchor.setTo(0.5);
      authorText.stroke = "rgba(0,0,0,0)";
      authorText.strokeThickness = 4;
      taskText.anchor.setTo(0.5);
      taskText.stroke = "rgba(0,0,0,0)";
      taskText.strokeThickness = 4;
      game.add.tween(authorText).to({y: game.world.centerY+100 + y}, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
      game.add.tween(taskText).to({y: game.world.centerY+150 + y}, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
      this.creditCount++;
  },

    create: function () {

        if (gameOptions.music_curren !== "francis" && gameOptions.playMusic !== false) {
            music_bongo.stop();
            gameOptions.music_current = music_francis.name;
            music_francis.play();
        }

        game.add.sprite(0, 0, 'gameover-bg');
        var titleStyle = {font: 'bold 60pt TheMinion', fill: '#FDFFB5', align: 'center'};
        var text = game.add.text(game.world.centerX, 100, "Game Over", titleStyle);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        text.anchor.set(0.5);

        this.addMenuOption('Play Again', function (e) {
            music_francis.stop();
            this.game.state.start("Game");
        });
        this.addMenuOption('Main Menu', function (e) {
            music_francis.stop();
            this.game.state.start("GameMenu");
        });
        var scoreText = this.addTextOption(GameOver.Score, w / 2 , 210, null, 60, 'Impact');
        var sort_leader_board = gameOptions.leaderBoard.sort((a,b) => b - a);
        console.log(sort_leader_board);
        this.addCredit(sort_leader_board[0], '1 st', game.world.centerX, 0);
        this.addCredit(sort_leader_board[1], '2 st', game.world.centerX + 125, 50);
        this.addCredit(sort_leader_board[2], '3 st', game.world.centerX - 125, 50);

    }
};