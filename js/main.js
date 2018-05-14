
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


function preload() {

    game.load.spritesheet("digital_img", "assets/digital.png", SIZE, SIZE);
    game.load.spritesheet("digital_img_2", "assets/digital_2.png", SIZE, SIZE);
    game.stage.backgroundColor = '#0ebfe7';

}

function create() {

    spawnBoard();
    game.input.addMoveCallback(slideDIGI, this);
    scoreText = game.add.text(30, 225, '++', { font: "20px Arial", fill: "#ffffff", align: "left" });
	sText = game.add.text(30, 245, 'Score = ', { font: "20px Arial", fill: "#ffffff", align: "left" });

}

function spawnBoard(){

    digitals=game.add.group();
    digitals.x = DigiXAlter;
    digitals.y = DigiYAlter;
    for (var i = 0; i < board_cols;i++){
        for (var j = 0; j < board_rows; j++) {
            var digital=digitals.create(i*SIZE_SPACED,j*SIZE_SPACED,"digital_img");
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

function setDigiPos(digi, posX, posY) {

    digi.posX = posX;
    digi.posY = posY;
    digi.id = calcDigiId(posX, posY);
}

function getDIGIPos(x){
	b = x / SIZE_SPACED;
    a = Math.floor(x / SIZE_SPACED);
    if ((b-a)>SIZE/SIZE_SPACED){
    	a=null
    }
    // if(x - SIZE_SPACED*(a-1) > SIZE){
    //     a = null
    // }
    return a;
}

function getDigi(x,y){
    return digitals.iterate("id", calcDigiId(x, y), Phaser.Group.RETURN_CHILD);
}

function calcDigiId(posX, posY) {
    return posX + posY * board_cols;
}

function DuplicatePath(x,y){

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
        scoreText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi));
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
        scoreText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi));
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
        scoreText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'+'+getDigiColor(no3digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi));
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
        scoreText.text = getDigiColor(selectedDIGI)+'+'+getDigiColor(no1digi)+'+'+getDigiColor(no2digi)+'+'+getDigiColor(no3digi)+'+'+getDigiColor(no4digi)+'='+(getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi)+getDigiColor(no4digi));
        stepCount=5;
        return ;
    }
    return ;
}

function slideDIGI(pointer, x, y){

     if (selectedDIGI && pointer.isDown){

         var cursorDigiPosX = getDIGIPos((x-DigiXAlter)/DigiXScale);
         var cursorDigiPosY = getDIGIPos((y-DigiYAlter)/DigiYScale);
         if (cursorDigiPosX===null ||cursorDigiPosY===null){
         	cursorDigiPosX=null;
         	cursorDigiPosY=null;
         	return;
         }
         console.log('X:', cursorDigiPosX);
         console.log('Y:', cursorDigiPosY);

         // var cursorDigi = getDigi((x-DigiXAlter)/DigiXScale, (y-DigiYAlter)/DigiYScale);
         // var cursorDigi = getDigi(x, y);

         if (checkIfDigiCanBeMovedHere(cursorDigiPosX,cursorDigiPosY)){
             DuplicatePath(cursorDigiPosX, cursorDigiPosY)
             // console.log(cursorDigi.frame);

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

    if ((getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi)+getDigiColor(no4digi))%10===0) {
		score += getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi)+getDigiColor(no4digi);
		sText.text='Score = '+score;
        selectedDIGI.kill();
        no1digi.kill();
        no2digi.kill();
        if (no3digi !==null){
            no3digi.kill();
        }
        if (no4digi !== null) {
            no4digi.kill();
        }
        selectedDIGI=null;
        no1digi=null;
        no2digi=null;
        no3digi=null;
        no4digi=null;
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
        // scoreText.text='123';
        scoreText.text=getDigiColor(selectedDIGI)+'='+getDigiColor(selectedDIGI);
    }
}

function checkIfDigiCanBeMovedHere(toPosX, toPosY) {

    if (toPosX < 0 || toPosX >= board_cols || toPosY < 0 || toPosY >= board_rows)
    {
        return false;
    }

    if (stepCount===5)
    {
        return false;
    }
    return true;
}