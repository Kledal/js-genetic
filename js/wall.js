function Wall(options) {
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
}

Wall.prototype = {
  update: function(dt, game) {
  },

  draw: function(engine) {
    engine.simpleLine(this.x, this.y, this.width, this.height);
  }
};
