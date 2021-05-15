
const ANIME_STAND = 1;
const ANIME_WALK  = 2;
const ANIME_BREAK = 4;
const ANIME_JUMP  = 8;
const GRAVITY     = 4;
const MAX_SPEED = 32;


class Ojisan {
  constructor(x,y) {
    this.x      = x<<4;
    this.y      = y<<4;
    this.vx     = 0;
    this.vy     = 0;
    this.anime  = 0;
    this.snum   = 0;
    this.aCount = 0;
    this.direc  = 0;
    this.jump   = 0;
  }

  //----床の判定------
  checkFloor() {
    if(this.vy<=0)return;
    let lx = ((this.x+this.vx)>>4);
    let ly = ((this.y+this.vy)>>4);

    //-----足下の二点で判定------
    if(field.isBlock(lx+1, ly+31) || field.isBlock(lx+14, ly+31)) {
      if(this.anime==ANIME_JUMP)this.anime = ANIME_WALK;
      this.jump = 0;
      this.vy = 0;
      this.y = ((((ly+31)>>4)<<4)-32)<<4;

    }
  }

  //----横の壁の判定------
  checkWall() {
    
    let lx = ((this.x+this.vx)>>4);
    let ly = ((this.y+this.vy)>>4);

    //-----右側のチェック------
    if(field.isBlock(lx+15, ly+9) ||   //----体の横三点で判定-----
       field.isBlock(lx+15, ly+15) ||
       field.isBlock(lx+15, ly+24)) {
         this.vx = 0;
         this.x -= 16;
       }

    //----左側のチェック-----
    else
    if(field.isBlock(lx, ly+9) ||
       field.isBlock(lx, ly+15) ||
       field.isBlock(lx, ly+24)) {
         this.vx = 0;
         this.x += 8;
       }
  }

  //----天井の判定------
  checkCeil() {
    if(this.vy>=0)return;
    let lx = ((this.x+this.vx)>>4); 
    let ly = ((this.y+this.vy)>>4);

    let bl;
    if(bl=field.isBlock(lx+8, ly+5)) {   //-----頭上の一点で判定------
      this.jump = 15;
      this.vy = 0;

      let x = (lx+8)>>4;
      let y = (ly+5)>>4;

      if(bl!=371) {

        block.push(new Block(bl, x, y));
        item.push(new Item(218,x, y,0,0));
      
      }
        else {
          block.push(new Block(bl, x, y, 1, 20, -60));
          block.push(new Block(bl, x, y, 1, -20, -60));
          block.push(new Block(bl, x, y, 1, 20, -20));
          block.push(new Block(bl, x, y, 1, -20, -20));
        }
    }
  }

  updateJump() {                   //-----ジャンプ------

    if(keyb.ABUTTON) {
      if(this.jump == 0) {
        this.anime = ANIME_JUMP;
        this.jump = 1;
      }
      if(this.jump<15)this.vy = -(64-this.jump);
    }
    if(this.jump)this.jump++;

  }

  updateWalkSub(direc) {

    if(direc == 0 && this.vx < MAX_SPEED)this.vx++;
    if(direc == 1 && this.vx > -MAX_SPEED)this.vx--;

    //-----ジャンプしてないとき------
    if(!this.jump) {

      //--------立ってるときはカウンタリセット----------
      if(this.anime == ANIME_STAND)this.aCount = 0;

      //----アニメを歩きアニメ-----
      this.anime = ANIME_WALK;

      //----方向を設定-----
      this.direc = direc;

      //----逆方向のときはブレーキをかける-----
      if(direc == 0 && this.vx < 0)this.vx++;
      if(direc == 1 && this.vx > 0)this.vx--;

      //----逆に強い加速のときはブレーキアニメ-----
      if(direc == 1 && this.vx > 8 || direc == 0 && this.vx < -8)this.anime = ANIME_BREAK;

    }
  }

  updateWalk() {

    //-----横移動----
    if(keyb.Left) {
      this.updateWalkSub(1);
        
    } else if(keyb.Right) {
      this.updateWalkSub(0);
        
    } else {
      if(!this.jump) {
        if(this.vx > 0)this.vx-=1;
        if(this.vx < 0)this.vx+=1;
        if(!this.vx)this.anime=ANIME_STAND;
      }
    }

  }

  updateAnime() {

    //-------スプライトの決定------
    switch(this.anime) {

      case ANIME_STAND:
        this.snum = 0;
        break;
      case ANIME_WALK:
        this.snum = 2 + ((this.aCount / 6)%3);
        break;
      case ANIME_JUMP:
        this.snum = 6;
        break;
      case ANIME_BREAK:
        this.snum = 5;
        break;

    }

    //-----左向きのとき-------
    if(this.direc)this.snum += 48;

  }

  update() {
    this.aCount++;        //-----アニメ用カウンタ------
    if(Math.abs(this.vx)==MAX_SPEED)this.aCount++;

    this.updateJump();
    this.updateWalk();
    this.updateAnime();


    //--------重力------
    if(this.vy < 64)this.vy+=GRAVITY;
    
    //-----床のチェック-----
    this.checkFloor();

    //-----横の壁のチェック-----
    this.checkWall();

    //-----天井のチェック------
    this.checkCeil();

    //-----実際の座標------
    this.x += this.vx;
    this.y += this.vy;



  }

  draw() {
    let px = (this.x>>4)-field.scx;
    let py = (this.y>>4)-field.scy;
    drawSprite(this.snum, px, py);
  }


}