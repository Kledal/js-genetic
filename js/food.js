function Food(options) {
  this.x = options.x;
  this.y = options.y;
  this.radius = 2;
  this.color = { r: 241, g: 196, b: 15 };
  this.life = 100;
}

Food.prototype.reject = function() {
  return this.life <= 0;
};

Food.prototype.eat = function() {
  this.life = -1;
  this.x = -1;
  this.y = -1;
};

Food.prototype.update = function(dt, game) {
  //this.life -= dt * 10;
};

Food.prototype.draw = function(engine) {
  engine.circle(this);
};
