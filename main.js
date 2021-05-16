

//----仮想画面------
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

//----実画面-----
let can = document.getElementById("can");
let con = can.getContext("2d");

//-----------------
// vcan.width = SCREEN_SIZE_W;
// vcan.height = SCREEN_SIZE_H;

let gameDisp = document.getElementById("gameDisp");
vcan.width = gameDisp.clientWidth;
vcan.height = gameDisp.clientHeight;

// can.width = SCREEN_SIZE_W*2;
// can.height = SCREEN_SIZE_H*2;

can.width = gameDisp.clientWidth*2;
can.height = gameDisp.clientHeight*2;

// con.mozimageSmoothingEnabled = false;
// con.msimageSmoothingEnabled = false;
// con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;   
                     //<- これだけで鮮明化OK

let SSW = SCREEN_SIZE_W*2;
let SSH = SCREEN_SIZE_H*2;

//----フレームレート維持------
let frameCount = 0;
let startTime;

let chImg = new Image();
chImg.src = "images/sprite_mario.png";

//-------------オブジェクトたち-------------
//-----キーボード-----
let keyb = {};

//-----おじさん------
let ojisan = new Ojisan(100,100);

//-----フィールド------
let field = new Field();

//------ブロック--------
let block = [];
let item = [];

//---------------更新処理------------------

function updateObj(obj) {
  //------スプライトのブロック------
  for(let i = obj.length - 1; i>=0; i--) {
    obj[i].update();
    if(obj[i].kill)obj.splice(i,1);
  }
}

function update(){

  //------マップ------
  field.update();

  updateObj(block);
  updateObj(item);
  
  //------おじさん------
  ojisan.update();  

}

//----スプライトの描画-----
function drawSprite(snum, x, y) {
  let sx = (snum&15)*16;
  let sy = (snum>>4)*16;
  vcon.drawImage(chImg,sx,sy,16,32, x,y,16,32);
}

//--------------描画---------------------------

function drawObj(obj) {
  //------スプライトのブロックを表示------
  for(let i = 0; i<obj.length; i++) {
    obj[i].draw();
  }
}

function draw(){
  
  //------画面を水色でクリア-------
  vcon.fillStyle = "#66AAFF";
  vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);

  //------マップを表示--------
  field.draw();
  
  drawObj(block);
  drawObj(item);
  //-------おじさんを表示--------
  ojisan.draw();
  
  //------デバッグ情報---------
  vcon.font = "24px 'Impact'";
  vcon.fillStyle = "white";
  vcon.fillText("FRAME:" + frameCount, 10,20);
    
  //----仮想画面から実画面へ拡大転送-------

  if(sizeUp==false){
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SSW, SSH);
  }
  else{
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SSW, SSH);
  }
  
}



//---メインループ-----

window.onload = function() {
  startTime = performance.now();
  no_scaling();
  resize();     
  mainLoop();
  
}

function mainLoop() {

  let nowTime = performance.now();
  let nowFrame = (nowTime - startTime)/ GAME_FPS;
   
  // resize();  

  if(nowFrame > frameCount) {
    let c = 0;
    while(nowFrame > frameCount) {

      frameCount++;
      update();

      if(++c >= 4)break;

    } 
    draw();
  }

  requestAnimationFrame(mainLoop);
}


//----押されたとき------
document.onkeydown = function(e) {

  if(e.keyCode == 37){
    keyb.Left = true;  //left
    console.log('OK');
  }
  if(e.keyCode == 39)keyb.Right = true;  //rigth
  if(e.keyCode == 90)keyb.BBUTTON = true;  //z
  if(e.keyCode == 88)keyb.ABUTTON = true;  //x

  
  if(e.keyCode == 65 )field.scx--;  //a
  if(e.keyCode == 83 )field.scx++;  //s
}

//----離されたとき------
document.onkeyup = function(e) {

  if(e.keyCode == 37)keyb.Left = false;
  if(e.keyCode == 39)keyb.Right = false;
  if(e.keyCode == 90)keyb.BBUTTON = false;
  if(e.keyCode == 88)keyb.ABUTTON = false;


}

//---------------スマホでタッチのとき--------------------

//-----レスポンシブ対応（ロード時に一度だけ）----
// let gameDisp = document.getElementById("gameDisp");

let resize = () => {
  can.width = gameDisp.clientWidth;
  can.height = gameDisp.clientHeight;
  con.imageSmoothingEnabled = false;  //---鮮明化----
};

//---------ズームできないようにする------------
function no_scaling(){
  document.addEventListener("touchmove",mobile_no_scroll,{passive:false});
}
function mobile_no_scroll(event){
  if(event.touches.length >= 1) {
    event.preventDefault();
  }
}

//-----L & R------
LeftBTN.addEventListener("touchstart", () =>{
  keyb.Left = true; 
})

RightBTN.addEventListener("touchstart", () =>{
  keyb.Right = true; 
})

LeftBTN.addEventListener("touchend", () =>{
  keyb.Left = false; 
})

RightBTN.addEventListener("touchend", () =>{
  keyb.Right = false; 
})

//------A & B----------

aBTN.addEventListener("touchstart", () =>{
  keyb.ABUTTON = true; 
})

bBTN.addEventListener("mousedown", () =>{
  keyb.ABUTTON = true;
})

aBTN.addEventListener("touchend", () =>{
  keyb.ABUTTON = false; 
})

bBTN.addEventListener("mouseup", () =>{
  keyb.ABUTTON = false;
})

//---------Resize-------------

resizeBTN.addEventListener("mousedown", () =>{

  if(sizeUp==false) {
    vcon.fillStyle = "#FFF";
    vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SSW, SSH);
    SSW = SCREEN_SIZE_W*1.8;
    SSH = SCREEN_SIZE_H*1.8;
    sizeUp = true;
  }
  else {
    vcon.fillStyle = "#FFF";
    vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SSW, SSH);
    SSW = SCREEN_SIZE_W*2;
    SSH = SCREEN_SIZE_H*2;
    sizeUp = false;
  }
})

// resizeBTN.addEventListener("mouseup", () =>{

// })


