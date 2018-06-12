var Game = function(game) {
    optionCount = 1;
    w = game.world.width;
    h = game.world.height;
    menu_board = null;
    choiseLabel = null;
    targetNumber = 3;
    digitals = null;
    board_cols=5;
    board_rows=5;
    SIZE = 84;
    spaced=24;
    SIZE_SPACED=SIZE + spaced;
    triggerSenstive = 0.8;
    allowInput = true;
    stepCount = 0;
    selectedDIGI = null;
    supportLabel = null;
    numberStyle = {
        font: '60pt Impact',
        fill: 'white',
        align: 'left',
        stroke: 'rgba(0,0,0,0)',
        srokeThickness: 4
    };
    no1digi=null;
    no2digi=null;
    no3digi=null;
    no4digi=null;
    score = 0;
    scoreText = 0;
    DigiXAlter = 30;
    DigiYAlter = 400;
    winFactorCount = 10;
    winFactorText = 0;
};

Game.prototype = {

    init: function () {
        score = 0;
        winFactorCount = 10;

        this.game.add.sprite(0, 0, 'Game_bg');
        this.game.add.sprite(0, 20, 'green-bar');

        if (gameOptions.music_curren !== "bongo" && gameOptions.playMusic !== false) {
            music_wishful.stop();
            gameOptions.music_curren = music_bongo.name;
            music_bongo.play();
        }
        this.stage.disableVisibilityChange = false;

        this.addTextOption('H', w - 500, 65, function (e) {
            this.game.state.start("GameMenu");
        });

        this.addTextOption('R', w - 400, 65, function (e) {
            this.game.state.start("Game");
        });
        //this.addTextOption('O', w - 100, 65, function (e) {
        	//this.gameOver();
        	//console.log('game:',score)
        //	GameOver.Score=score;
        //    this.game.state.start("GameOver");
        //});
        this.addTextOption('P', w - 300, 65, function (e) {
            this.onPaused();
        });
        game.input.onDown.add(this.unPause, self);

        this.addTextOption('Q', w - 200, 65, function (e) {
            music_wishful.stop();
            music_bongo.stop();

            gameOptions.playMusic = false;
        });

        this.addTextOption(gameOptions.targetNumber? 5+'x' : 3+'x' , w / 2, 210, null, 80, 'Impact');

        this.addTextOption(gameOptions.winFactor? 'step' : 'time', w / 2 - 150, 160, null, 35);
        winFactorText = this.addTextOption(winFactorCount, w / 2 - 150, 210, null, 30, 'Impact');

        this.addTextOption('Score', w / 2 + 150, 160, null, 35);


        scoreText = this.addTextOption(score, w / 2 + 150, 210, null, 30, 'Impact');
        supportLabel = this.addTextOption('Connect Numbers', w / 2, 330, null, 35, 'Impact');

        },

    create: function () {
        this.spawnBoard();
        this.game.input.addMoveCallback(this.slideDIGI, this);


    },

    spawnBoard: function () {

        digitals = this.game.add.group();
        digitals.x = DigiXAlter;
        digitals.y = DigiYAlter;
        for (var i = 0; i < board_cols;i++){
            for (var j = 0; j < board_rows; j++) {
                var txt = this.game.add.text(i*SIZE_SPACED,j*SIZE_SPACED, this.randomizeDigiNumber(),numberStyle);
                txt.name = 'digi'+i.toString()+'x'+j.toString();
                txt.inputEnabled = true;
                txt.events.onInputDown.add(this.selectDIGI, this);
                txt.events.onInputUp.add(this.releaseDIGI,this);
                //txt.events.onInputOver.add(onOver, this);
                //txt.events.onInputOut.add(onOut, this);
                this.setDigiPos(txt,i,j);
                digitals.add(txt);

            }
        }

    },

    onOver_f: function (target) {
        if (target !== null) {
            target.fill = "#f9f900";
            target.stroke = "rgba(200,200,200,0.5)";
            // target.useHandCursor = true;

        }
        return target;
    },

    onOut_f: function (target) {
        target.fill = "white";
        target.stroke = "rgba(0,0,0,0)";
        // target.useHandCursor = false;
    },


    getDigiText: function(digi){

        if (digi ===null){
            return 0;
        }
        return Number(digi.text);
    },

    slideDIGI: function(pointer, x, y){

         if (selectedDIGI && pointer.isDown){

             var cursorDigiPosX = this.getDIGIPos(x-DigiXAlter);
             var cursorDigiPosY = this.getDIGIPos(y-DigiYAlter);

             console.log('X:', cursorDigiPosX,'Y:', cursorDigiPosY);
             var n1=this.getDigiText(selectedDIGI),
                n2=this.getDigiText(no1digi),
                n3=this.getDigiText(no2digi),
                n4=this.getDigiText(no3digi),
                n5=this.getDigiText(no4digi);
             console.log(n1, n2, n3, n4, n5);

             if (this.checkIfDigiCanBeMovedHere(cursorDigiPosX,cursorDigiPosY)) {
                 this.DuplicatePath(cursorDigiPosX, cursorDigiPosY)
             }
        }
    },

    DuplicatePath: function(x,y){


            // console.log('dup',n1,n2,n3,n4,n5);
            // console.log('dup',x,y,stepCount);

        if (x===null || y===null) {
            return;
        }
        if (x===selectedDIGI.posX && y===selectedDIGI.posY){
            return ;
        }
        if (no1digi!==null) {
            if (x===no1digi.posX && y===no1digi.posY){
                return ;
            }
        }
        else{
            no1digi=this.getDigi(x,y);
            supportLabel.text = this.getDigiText(selectedDIGI)+'+'+this.getDigiText(no1digi)+'='+(this.getDigiText(selectedDIGI)+this.getDigiText(no1digi));
            stepCount=2;
            return ;
        }
        if (no2digi!==null) {
            if (x===no2digi.posX && y===no2digi.posY){
                return ;
            }
        }
        else{
            no2digi=this.getDigi(x,y);
            supportLabel.text = this.getDigiText(selectedDIGI)+'+'+this.getDigiText(no1digi)+'+'+this.getDigiText(no2digi)+'='+(this.getDigiText(selectedDIGI)+this.getDigiText(no1digi)+this.getDigiText(no2digi));
            stepCount=3;
            return ;
        }
        if (no3digi!==null) {
            if (x===no3digi.posX && y===no3digi.posY){
                return ;
            }
        }
        else{
            no3digi=this.getDigi(x,y);
            supportLabel.text = this.getDigiText(selectedDIGI)+'+'+this.getDigiText(no1digi)+'+'+this.getDigiText(no2digi)+'+'+this.getDigiText(no3digi)+'='+(this.getDigiText(selectedDIGI)+this.getDigiText(no1digi)+this.getDigiText(no2digi)+this.getDigiText(no3digi));
            stepCount=4;
            return ;
        }
        if (no4digi!==null) {
            if (x===no4digi.posX && y===no4digi.posY){
                return ;
            }
        }
        else{
            no4digi=this.getDigi(x,y);
            supportLabel.text = this.getDigiText(selectedDIGI)+'+'+this.getDigiText(no1digi)+'+'+this.getDigiText(no2digi)+'+'+this.getDigiText(no3digi)+'+'+this.getDigiText(no4digi)+'='+(this.getDigiText(selectedDIGI)+this.getDigiText(no1digi)+this.getDigiText(no2digi)+this.getDigiText(no3digi)+this.getDigiText(no4digi));
            stepCount=5;
            return ;
        }
        return ;
    },

    getDigi:function(x,y){
        return digitals.iterate("id", this.calcDigiId(x, y), Phaser.Group.RETURN_CHILD);
    },

    checkIfDigiCanBeMovedHere: function(toPosX, toPosY) {

        if (toPosX < 0 || toPosX >= board_cols || toPosY < 0 || toPosY >= board_rows)
        {
            return false;
        }
        if (stepCount===1) {

            if (toPosX-selectedDIGI.posX>1||toPosX-selectedDIGI.posX<(-1)||toPosY-selectedDIGI.posY>1||toPosY-selectedDIGI.posY<-1) {
                return false;
            }

        }
        if (stepCount===2) {
            if (toPosX===selectedDIGI.posX &&toPosY===selectedDIGI.posY ){
                supportLabel.text = this.getDigiText(selectedDIGI)+'='+(this.getDigiText(selectedDIGI));
                stepCount=1;
                no1digi=null;
                return false;
            }
            if (toPosX-no1digi.posX>1||toPosX-no1digi.posX<(-1)||toPosY-no1digi.posY>1||toPosY-no1digi.posY<-1) {
                return false;
            }

        }
        if (stepCount===3) {
            if (toPosX===no1digi.posX &&toPosY===no1digi.posY ){
                supportLabel.text = this.getDigiText(selectedDIGI)+'+'+this.getDigiText(no1digi)+'='+(this.getDigiText(selectedDIGI)+this.getDigiText(no1digi));
                stepCount=2;
                no2digi=null;
                return false;
            }

            if (toPosX-no2digi.posX>1||toPosX-no2digi.posX<(-1)||toPosY-no2digi.posY>1||toPosY-no2digi.posY<-1) {
                return false;
            }
        }
        if (stepCount===4)
        {
            if (toPosX===no2digi.posX &&toPosY===no2digi.posY ){
                supportLabel.text = this.getDigiText(selectedDIGI)+'+'+this.getDigiText(no1digi)+'+'+this.getDigiText(no2digi)+'='+(this.getDigiText(selectedDIGI)+this.getDigiText(no1digi)+this.getDigiText(no2digi));
                stepCount=3;
                no3digi=null;
                return false;
            }
            if (toPosX-no3digi.posX>1||toPosX-no3digi.posX<(-1)||toPosY-no3digi.posY>1||toPosY-no3digi.posY<-1) {
                return false;
            }
        }
        if (stepCount===5){
            if (toPosX===no3digi.posX &&toPosY===no3digi.posY ){
                supportLabel.text = this.getDigiText(selectedDIGI)+'+'+this.getDigiText(no1digi)+'+'+this.getDigiText(no2digi)+'+'+this.getDigiText(no3digi)+'='+(this.getDigiText(selectedDIGI)+this.getDigiText(no1digi)+this.getDigiText(no2digi)+this.getDigiText(no3digi));
                stepCount=4;
                no4digi=null;
                return false;
            }
            return false;
        }
        return true;

    },


    getDIGIPos: function(x){
	b = x / SIZE_SPACED;
    a = Math.floor(x / SIZE_SPACED);
    if ((b-a)>SIZE/SIZE_SPACED*triggerSenstive){
    	a=null
    }
    return a;
    },


    releaseDIGI: function(){

        if (stepCount < 3) {
            stepCount = 0;
            selectedDIGI = null;
            no1digi = null;
            no2digi = null;
            no3digi = null;
            no4digi = null;
            supportLabel.text = 'At Least Need 3 Numbers';
            return;
        }
        this.KillDigital();
        stepCount = 0;
        selectedDIGI = null;
        no1digi = null;
        no2digi = null;
        no3digi = null;
        no4digi = null;
        this.removeKilledDigi();
        var dropDigiDuration = this.dropDigis();
        // alert(this.property);
        game.time.events.add(dropDigiDuration * 100, this.refillBoard,this);

        // allowInput = false;
    },



    dropDigis: function() {

        var dropRowCountMax = 0;

        for (var i = 0; i < board_cols; i++)
        {
            var dropRowCount = 0;

            for (var j = board_rows - 1; j >= 0; j--)
            {
                var digi = this.getDigi(i, j);

                if (digi === null)
                {
                    dropRowCount++;
                }
                else if (dropRowCount > 0)
                {
                    digi.dirty = true
                    this.setDigiPos(digi, digi.posX, digi.posY + dropRowCount);
                    this.tweenDigiPos(digi, digi.posX, digi.posY, dropRowCount);

                }

            }

            dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
        }

        return dropRowCountMax;

    },

    tweenDigiPos: function(Digi, newPosX, newPosY, durationMultiplier) {

        if (durationMultiplier === null || typeof durationMultiplier === 'undefined') {
            durationMultiplier = 1;
        }

        return game.add.tween(Digi).to({
            x: newPosX * SIZE_SPACED,
            y: newPosY * SIZE_SPACED
        }, 100 * durationMultiplier, Phaser.Easing.Linear.None, true);
    },

    calcDigiId: function(posX, posY) {
        return posX + posY * board_cols;
    },


    removeKilledDigi: function() {
        digitals.forEach(function(digi) {
            if (!digi.alive) {
                digi.posX = -2;
                digi.posY = -2;
                digi.id = -2;
            }
        });

    },

    setDigiPos: function(digi, posX, posY) {

        digi.posX = posX;
        digi.posY = posY;
        digi.id = this.calcDigiId(posX, posY);
    },

    KillDigital: function(){

        if ((this.getDigiText(selectedDIGI)+this.getDigiText(no1digi)+this.getDigiText(no2digi)+this.getDigiText(no3digi)+this.getDigiText(no4digi)) % (gameOptions.targetNumber? 5 :　3)===0) {
            score += this.getDigiText(selectedDIGI) + this.getDigiText(no1digi) + this.getDigiText(no2digi) + this.getDigiText(no3digi) + this.getDigiText(no4digi);
            scoreText.text = score;
            winFactorCount -= 1;
            winFactorText.text = winFactorCount;
            if(winFactorCount===0){
            	GameOver.Score=score;
                this.game.state.start("GameOver");
            }
            selectedDIGI.kill();
            no1digi.kill();
            no2digi.kill();
            if (no3digi !== null) {
                no3digi.kill();
            }
            if (no4digi !== null) {
                no4digi.kill();
            }
            selectedDIGI = null;
            no1digi = null;
            no2digi = null;
            no3digi = null;
            no4digi = null;
            stepCount = 0;
        }
        else {
            supportLabel.text = 'Not A Target Multiple!!';
        }
    },


    selectDIGI: function(digi){

        if (allowInput)
        {
            stepCount=1;
            console.log(stepCount);
            selectedDIGI = digi;
            supportLabel.text=digi.text+'='+digi.text;
        }
    },

    randomizeDigiNumber: function() {
        return game.rnd.integerInRange(0, gameOptions.digitRange? 10 - 1 :　5);
    },
    onPaused: function() {
        // When the paus button is pressed, we pause the game
        this.game.paused = true;

        // Then add the menu
        menu_board = this.game.add.sprite(w / 2, h / 2, 'paused-board');
        menu_board.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = this.game.add.text(w / 2, h / 2 + 150, 'Click outside menu to continue', {
            font: '30px Arial',
            fill: 'white'
        });
        choiseLabel.anchor.setTo(0.5, 0.5);
    },

    unPause: function(event) {
        // Only act if paused
        if (this.game.paused) {
            // Calculate the corners of the menu
            var x1 = w / 2 - 270 / 2, x2 = w / 2 + 270 / 2,
                y1 = h / 2 - 180 / 2, y2 = h / 2 + 180 / 2;

            // Check if the click was inside the menu
            if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choise = Math.floor(x / 90) + 3 * Math.floor(y / 90);

                // Display the choice
                this.choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else {
                // Remove the menu and the label
                menu_board.destroy();
                choiseLabel.destroy();

                // Unpause the game
                this.game.paused = false;
            }
        }
    },

    addTextOption: function(text,x, y, callback=null, fontSize=30, fontStyle='TheMinion') {
        var optionStyle = {
            font: fontSize+'pt '+fontStyle,
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

    refillBoard: function() {

        allowInput = false;

        var maxDigiMissingFromCol = 0;

        for (var i = 0; i < board_cols; i++)
        {
            var digisMissingFromCol = 0;

            for (var j = board_rows - 1; j >= 0; j--)
            {
                //alert(this.Game)
                var digi = this.getDigi(i, j);

                if (digi === null)
                {
                    digisMissingFromCol++;
                    digi = digitals.getFirstDead();
                    digi.reset(i * SIZE_SPACED, -digisMissingFromCol * SIZE_SPACED);
                    digi.dirty = true;
                    digi.text = this.randomizeDigiNumber(digi);
                    console.log(digi.text);
                    this.setDigiPos(digi, i, j);
                    this.tweenDigiPos(digi, digi.posX, digi.posY, digisMissingFromCol * 2);
                }
            }
            maxDigiMissingFromCol = Math.max(maxDigiMissingFromCol, digisMissingFromCol);
        }

        game.time.events.add(maxDigiMissingFromCol * 2 * 100, this.boardRefilled, this);

        allowInput = true;
    },

    boardRefilled: function() {

        var canKill = false;

        if(canKill){
            this.removeKilledDigi();
            var dropDigiDuration = this.dropDigis();

            game.time.events.add(dropDigiDuration * 100, this.refillBoard);
            allowInput = false;
        } else {
            allowInput = true;
        }

    }
};

