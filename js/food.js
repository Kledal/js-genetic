function Food(options) {
  this.x = options.x;
  this.y = options.y;
  this.radius = 2;
  this.color = { r: 241, g: 196, b: 15 };
  this.eaten = false;
}

Food.prototype.reject = function() {
  return this.eaten;
};

Food.prototype.eat = function() {
  this.eaten = true;
  this.x = -1;
  this.y = -1;
};

Food.prototype.update = function(dt, game) {
};

Food.prototype.draw = function(engine) {
  engine.circle(this);
};
