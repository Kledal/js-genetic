function Camera(game) {
  this.game = game;
  this.top = 250;
  this.left = 250;

  this.width = 500;
  this.height = 500;

  this.follow = false;
};

Camera.prototype = {
  focus: function(x, y) {
    this.left = x - (this.width/2);
    this.top = y - (this.height/2);
  },
  relativePosition: function(x, y) {
    var newX = x - this.left;
    var newY = y - this.top;
    if (newX > this.game.width) newX -= this.game.width;
    if (newX < 0) newX += this.game.width;
    if (newY > this.game.height) newY -= this.game.height;
    if (newY < 0) newY += this.game.height;

    return { x: newX, y: newY };
  }
};
