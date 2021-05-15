
const GAME_FPS = 1000/60;
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;


//-----一画面あたりのブロック数--------
const MAP_SIZE_W = SCREEN_SIZE_W/16;
const MAP_SIZE_H = SCREEN_SIZE_H/16;

//-------------------
const FIELD_SIZE_W = 256;
const FIELD_SIZE_H = 14;



//-------基本クラス-------
class Sprite {

  constructor(sp, x, y, vx, vy) {

    this.sp = sp;
    this.x = x<<8;
    this.y = y<<8;
    this.vx = vx;
    this.vy = vy;
    
    this.kill = false;
    this.count = 0;

  }

  update() {
    if(this.vy<64)this.vy+=GRAVITY;
    this.x+=this.vx;
    this.y+=this.vy;
    if((this.y>>4) > FIELD_SIZE_H*16)this.kill = true;
  }

  draw() {
    let an = this.sp;
    let sx =(an & 15)<<4;
    let sy =(an>>4)<<4;
    let px = (this.x>>4) - (field.scx);
    let py = (this.y>>4) - (field.scy);

    vcon.drawImage(chImg, sx, sy, 16, 16, px, py, 16, 16);
  }
}

