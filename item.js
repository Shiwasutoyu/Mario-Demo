

class Item extends Sprite{

  //----床の判定------
  checkFloor() {
    if(this.vy<=0)return;
    let lx = ((this.x+this.vx)>>4);
    let ly = ((this.y+this.vy)>>4);

    //-----足下の二点で判定------
    if(field.isBlock(lx+1, ly+15) || field.isBlock(lx+14, ly+15)) {
      
      this.vy = 0;
      this.y = ((((ly+15)>>4)<<4)-16)<<4;

    }
  }

  update() {

  if(this.kill)return;
  this.checkFloor();
  super.update();

  }


}


