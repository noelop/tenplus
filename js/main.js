// import EventsOfButtonClicked from 'events_of_button_clicked';

var game = new Phaser.Game(470, 750, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create
});

var SIZE = 64;
var spaced=20;
var SIZE_SPACED=SIZE + spaced;
var board_cols=5;
var board_rows=5;
var digitals;
var no1digi=null;
var no2digi=null;
var no3digi=null;
var no4digi=null;
var stepCount;
var selectedDIGI=null;
var allowInput=true;
var scoreText;
var DigiXAlter = 10;
var DigiYAlter = 290;
var DigiXScale = 1.1;
var DigiYScale = 1.1;
var sTest;
var score = 0;
var triggerSenstive = 0.8;
var w = 470, h = 750;
var target = 3;
var step = 10;

function preload() {

    game.load.spritesheet("DigitalImg", "assets/digital.png", SIZE, SIZE);
    game.load.spritesheet("SlectedDigital", "assets/digital_2.png", SIZE, SIZE);
    game.stage.backgroundColor = '#0ebfe7';

}

function create() {

    spawnBoard();
    game.input.addMoveCallback(slideDIGI, this);
    supportText = game.add.text(30, 215, ' ', { font: "30px Arial", fill: "#fff"});
    scoreText = game.add.text(w - 100, 70, 'score: 0.00', { font: "16px Arial", fill: "#fff"});
    timeText = game.add.text(w - 100, 100, 'time: 0.00', { font: "16px Arial", fill: "#fff"});
    stepText = game.add.text(w - 100, 130, 'step: 0/'+step, { font: "16px Arial", fill: "#fff"});
    target_number = game.add.text(w/2 - 30, 100, target, { font: "60px Arial", fill: "#fff"});
    pause_label = game.add.text(w - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff'});
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(paused);
    game.input.onDown.add(unpause, self);
    game.add.sprite(0, 10, 'green');
}

function paused() {
      // When the paus button is pressed, we pause the game
      game.paused = true;

      // Then add the menu
      menu = game.add.sprite(w/2, h/2, 'menu');
      menu.anchor.setTo(0.5, 0.5);

      // And a label to illustrate which menu item was chosen. (This is not necessary)
      choiseLabel = game.add.text(w/2, h-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#000000' });
      choiseLabel.anchor.setTo(0.5, 0.5);
  }

  function unpause(event){
      // Only act if paused
      if(game.paused){
          // Calculate the corners of the menu
          var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
              y1 = h/2 - 180/2, y2 = h/2 + 180/2;

          // Check if the click was inside the menu
          if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
              // The choicemap is an array that will help us see which item was clicked
              var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

              // Get menu local coordinates for the click
              var x = event.x - x1,
                  y = event.y - y1;

              // Calculate the choice
              var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

              // Display the choice
              choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
          }
          else{
              // Remove the menu and the label
              menu.destroy();
              choiseLabel.destroy();

              // Unpause the game
              game.paused = false;
          }
      }
  }
function spawnBoard(){

    digitals=game.add.group();
    digitals.x = DigiXAlter;
    digitals.y = DigiYAlter;
    for (var i = 0; i < board_cols;i++){
        for (var j = 0; j < board_rows; j++) {
            var digital=digitals.create(i*SIZE,j*SIZE,"DigitalImg");
            digital.name = 'digi'+i.toString()+'x'+j.toString();
            digital.inputEnabled = true;
            digital.events.onInputDown.add(selectDIGI, this);
            digital.events.onInputUp.add(releaseDIGI,this);
            randomizeDigiNumber(digital);
            setDigiPos(digital,i,j);
            digital.kill()
        }
    }
    digitals.scale = new Phaser.Point(DigiXScale, DigiYScale);

    removeKilledDigi();

    var dropDigiDuration = dropDigis();
    game.time.events.add(dropDigiDuration * 100, refillBoard);
    selectedDIGI = null;
}

function slectedDigitels() {
    var s=digitals.create(i*SIZE_SPACED,j*SIZE_SPACED,"DigitalImg");

}

function setDigiPos(digi, posX, posY) {

    digi.posX = posX;
    digi.posY = posY;
    digi.id = calcDigiId(posX, posY);
}

function getDIGIPos(x){
    b = x / SIZE_SPACED;
    a = Math.floor(x / SIZE_SPACED);
    if ((b-a)>SIZE/SIZE_SPACED*triggerSenstive){
        a=null
    }
    return a;
}

function getDigi(x,y){
    return digitals.iterate("id", calcDigiId(x, y), Phaser.Group.RETURN_CHILD);
}

function calcDigiId(posX, posY) {
    return posX + posY * board_cols;
}

function DuplicatePath(x,y){

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
        no1digi=getDigi(x,y);
        supportText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi));
        stepCount=2;
        return ;
    }
    if (no2digi!==null) {
        if (x===no2digi.posX && y===no2digi.posY){
            return ;
        }
    }
    else{
        no2digi=getDigi(x,y);
        supportText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi));
        stepCount=3;
        return ;
    }
    if (no3digi!==null) {
        if (x===no3digi.posX && y===no3digi.posY){
            return ;
        }
    }
    else{
        no3digi=getDigi(x,y);
        supportText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'+'+getDigiColor(no3digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi));
        stepCount=4;
        return ;
    }
    if (no4digi!==null) {
        if (x===no4digi.posX && y===no4digi.posY){
            return ;
        }
    }
    else{
        no4digi=getDigi(x,y);
        supportText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'+'+getDigiColor(no3digi)+'+'+getDigiColor(no4digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi)+getDigiColor(no4digi));
        stepCount=5;
        return ;
    }
    return ;
}

function slideDIGI(pointer, x, y){

     if (selectedDIGI && pointer.isDown){

         var cursorDigiPosX = getDIGIPos((x-DigiXAlter)/DigiXScale);
         var cursorDigiPosY = getDIGIPos((y-DigiYAlter)/DigiYScale);

         console.log('X:', cursorDigiPosX);
         console.log('Y:', cursorDigiPosY);

         if (checkIfDigiCanBeMovedHere(cursorDigiPosX,cursorDigiPosY)){



             DuplicatePath(cursorDigiPosX, cursorDigiPosY)

        }
    }
}

function tweenDigiPos(Digi, newPosX, newPosY, durationMultiplier) {

    if (durationMultiplier === null || typeof durationMultiplier === 'undefined')
    {
        durationMultiplier = 1;
    }

    return game.add.tween(Digi).to({x: newPosX  * SIZE_SPACED, y: newPosY * SIZE_SPACED}, 100 * durationMultiplier, Phaser.Easing.Linear.None, true);
}

function removeKilledDigi() {

    digitals.forEach(function(digi) {
        if (!digi.alive) {
            setDigiPos(digi, -1,-1);
        }
    });

}

function dropDigis() {

    var dropRowCountMax = 0;

    for (var i = 0; i < board_cols; i++)
    {
        var dropRowCount = 0;

        for (var j = board_rows - 1; j >= 0; j--)
        {
            var digi = getDigi(i, j);

            if (digi === null)
            {
                dropRowCount++;
            }
            else if (dropRowCount > 0)
            {
                digi.dirty = true
                setDigiPos(digi, digi.posX, digi.posY + dropRowCount);
                tweenDigiPos(digi, digi.posX, digi.posY, dropRowCount);
            }
        }
        dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
    }
    return dropRowCountMax;
}


function refillBoard() {

    allowInput = false;

    var maxDigiMissingFromCol = 0;

    for (var i = 0; i < board_cols; i++)
    {
        var digisMissingFromCol = 0;

        for (var j = board_rows - 1; j >= 0; j--)
        {
            var digi = getDigi(i, j);

            if (digi === null)
            {
                digisMissingFromCol++;
                digi = digitals.getFirstDead();
                digi.reset(i * SIZE_SPACED, -digisMissingFromCol * SIZE_SPACED);
                digi.dirty = true;
                randomizeDigiNumber(digi);
                setDigiPos(digi, i, j);
                tweenDigiPos(digi, digi.posX, digi.posY, digisMissingFromCol * 2);
            }
        }
        maxDigiMissingFromCol = Math.max(maxDigiMissingFromCol, digisMissingFromCol);
    }

    game.time.events.add(maxDigiMissingFromCol * 2 * 100, boardRefilled);

    allowInput = true;
}

function boardRefilled() {

    var canKill = false;

    if(canKill){
        removeKilledDigi();
        var dropDigiDuration = dropDigis();

        game.time.events.add(dropDigiDuration * 100, refillBoard);
        allowInput = false;
    } else {
        allowInput = true;
    }

}

function randomizeDigiNumber(digi) {
    digi.frame = game.rnd.integerInRange(0, digi.animations.frameTotal - 1);
}

function KillDigital(){

    if ((getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi)+getDigiColor(no4digi)) % target===0) {
      score += getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi)+getDigiColor(no4digi);
      scoreText.text='Score: '+score;
          selectedDIGI.kill();
        no1digi.kill();
        no2digi.kill();
        if (no3digi !==null){
            no3digi.kill();
        }
        if (no4digi !== null) {
            no4digi.log('SlectedDigital');
        }
        selectedDIGI=null;
        no1digi=null;
        no2digi=null;
        no3digi=null;
        no4digi=null;
        stepCount=0;
    }
}

function getDigiColor(digi){

    if (digi ===null){
        return 0;
    }
    return digi.frame;
}

function releaseDIGI(){

    if (stepCount < 3){
        stepCount=0;
        selectedDIGI=null;
        no1digi=null;
        no2digi=null;
        no3digi=null;
        no4digi=null;
        return;
    }
    KillDigital();
    no1digi=null;
    no2digi=null;
    no3digi=null;
    no4digi=null;
    stepCount=0;
    removeKilledDigi()
    var dropDigiDuration = dropDigis();

    game.time.events.add(dropDigiDuration * 100, refillBoard);

    allowInput = false;
}
 
function selectDIGI(digital){

    if (allowInput)
    {
        stepCount=1;
        selectedDIGI = digital;
        // selectedDIGI.loadTexture('SlectedDigital', SIZE, SIZE )
        // scoreText.text='123';
        supportText.text=getDigiColor(selectedDIGI)+'='+getDigiColor(selectedDIGI);
    }
}

function checkIfDigiCanBeMovedHere(toPosX, toPosY) {

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
            supportText.text = getDigiColor(selectedDIGI)+'='+getDigiColor(selectedDIGI);
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
            supportText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi));
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
            supportText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi));
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
            supportText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'+'+getDigiColor(no3digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi));
            stepCount=4;
            no4digi=null;
            return false;
        }
        return false;
    }
    return true;
}