var game = new Phaser.Game(320, 350, Phaser.CANVAS, 'phaser-example', { preload: preload,
    create: create });
var SIZE = 64;
var digitals;
var no1digi=null;
var no2digi=null;
var no3digi=null;
var no4digi=null;
var stepCount;
var selectedDIGI=null;
var allowInput=true;
var scoreText;
function preload() {

    game.load.spritesheet("digital_img", "assets/digital.png", SIZE, SIZE);
    game.load.spritesheet("digital_img_2", "assets/digital_2.png", SIZE, SIZE);

}

function create() {
    spawnBoard();
    game.input.addMoveCallback(slideDIGI, this);
    scoreText = game.add.text(30, 325, '++', { font: "20px Arial", fill: "#ffffff", align: "left" });

}
function setDigiPos(digi, posX, posY) {
    digi.posX = posX;spawnBoard
    digi.posY = posY;
    digi.id = calcDigiId(posX, posY);
}
function getDIGIPos(x){
    return Math.floor(x / SIZE);
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
        var cursorDigiPosX = getDIGIPos(x);
        var cursorDigiPosY = getDIGIPos(y);
        if (checkIfDigiCanBeMovedHere(cursorDigiPosX,cursorDigiPosY)){
            DuplicatePath(cursorDigiPosX,cursorDigiPosY)
        }
    }
}
function dropDigis() {
    var dropRowCountMax = 0;//掉落最多的列的总掉落数

    //从左往右
    for (var i = 0; i < board_cols; i++)
    {
        var dropRowCount = 0;//本列的掉落数
        //从下往上检查
        for (var j = board_rows - 1; j >= 0; j--)
        {
            var gem = getDigi(i, j);//根据理论位置找而不是画面位置

            if (gem === null)
            {//发现空格，记录总空格数量
                dropRowCount++;
            }//将它扔下去
            else if (dropRowCount > 0)
            {
                setDigiPos(gem, gem.posX, gem.posY + dropRowCount);//改变理论位置，这会使钻石原位置变空，而原空格变满
                tweenDigiPos(gem, gem.posX, gem.posY, dropRowCount);//改变画面位置，播放动画让钻石从原位置移动到目标位置
            }
        }

        dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
    }

    return dropRowCountMax;

}
function tweenDigiPos(Digi, newPosX, newPosY, durationMultiplier) {

    console.log('Tween ',Digi.name,' from ',Digi.posX, ',', Digi.posY, ' to ', newPosX, ',', newPosY);
    if (durationMultiplier === null || typeof durationMultiplier === 'undefined')
    {
        durationMultiplier = 1;
    }

    return game.add.tween(Digi).to({x: newPosX  * SIZE, y: newPosY * SIZE}, 100 * durationMultiplier, Phaser.Easing.Linear.None, true);

}
function spawnBoard(){
    board_cols=5;
    board_rows=5;
    digitals=game.add.group();
    for (var i = 0; i < board_cols;i++){
        for (var j = 0; j < board_rows; j++) {
            var digital=digitals.create(i*SIZE,j*SIZE,"digital_img");
            digital.name = 'digi'+i.toString()+'x'+j.toString();
            digital.inputEnabled = true;
            digital.events.onInputDown.add(selectDIGI, this);
            digital.events.onInputUp.add(releaseDIGI,this);
            randomizeGemColor(digital);
            setDigiPos(digital,i,j);
        }
    }
    var dropDigiDuration = dropDigis();
    game.time.events.add(dropDigiDuration * 100, refillBoard);
    selectedGem = null;
}
function refillBoard() {
	allowInput = false;
    for (var i = 0; i < board_cols; i++)
    {
        var digisMissingFromCol = 0;

        for (var j = board_rows - 1; j >= 0; j--)
        {
            var digi = getDigi(i, j);

            if (digi === null)
            {
                digisMissingFromCol++;
                gem = gems.getFirstDead();
                gem.reset(i * SIZE, -digisMissingFromCol * SIZE);
                gem.dirty = true;
                randomizeGemColor(gem);
                setGemPos(gem, i, j);
                tweenGemPos(gem, gem.posX, gem.posY, digisMissingFromCol * 2);
            }
        }
    }
    allowInput = true;
}

function randomizeGemColor(digi) {
    digi.frame = game.rnd.integerInRange(0, digi.animations.frameTotal - 1);
}
function KillDigital(){
    if ((getDigiColor(selectedDIGI)+getDigiColor(no1digi)+getDigiColor(no2digi)+getDigiColor(no3digi)+getDigiColor(no4digi))%10===0) {
        selectedDIGI.kill();
        no1digi.kill();
        no2digi.kill();
        selectedDIGI=null;
        no1digi=null;
        no2digi=null;
        if (no3digi !==null){
            no3digi.kill();
            no3digi=null;
        }
        if (no4digi !== null) {
            no4digi.kill();
            no4digi=null;
        }

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
        return;
    }
    KillDigital();
    no1digi=null;
    no2digi=null;
    no3digi=null;
    no4digi=null;
    var dropGemDuration = dropDigis();

    // delay board refilling until all existing gems have dropped down
    game.time.events.add(dropGemDuration * 100, refillBoard);

    allowInput = false;
}
function selectDIGI(digital){
	console.log(allowInput);
    if (allowInput)
    {
        stepCount=1;
        selectedDIGI = digital;
        scoreText.text='123';
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
