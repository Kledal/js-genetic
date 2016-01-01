function Sensor(parent, width, angle) {
  this.parent = parent;
  this.width = width;
  this._angle = angle;
  this.color = { r: 189, g: 195, b: 199 };
  this.colorNeutral = { r: 189, g: 195, b: 199 };
  this.colorActivated = {r: 231, g: 76, b: 60 };
  this.output = 0;
  this.radius = 10;

  Object.defineProperty(this, 'angle', {
    get: function() { return ((this._angle + 270 + this.parent.direction )%360) * Math.PI / 180; },
    set: function(rad) { this._angle = rad }
  });

  Object.defineProperty(this, 'x', {
    get: function() {
      return this.parent.x + this.parent.radius * Math.cos(this.angle);
    }
  });

  Object.defineProperty(this, 'y', {
    get: function() {
      return this.parent.y + this.parent.radius * Math.sin(this.angle);
    }
  });
}

Sensor.prototype.update = function(dt, game) {
  this.color = this.colorNeutral;
  var output = 0;
  var len = game.objects.length;
  var sensorPoint = this.sensorPoint();

  while (len--) {
    var object = game.objects[len];
    if (!(object instanceof Food)) {
      continue;
    }
    var collision = game.collisionDetect(sensorPoint.x, sensorPoint.y, this.radius, object.x, object.y, object.radius);
    if (collision) {
      output = 1;
      this.color = this.colorActivated;
      break;
    }
  }

  this.output = output;
};

Sensor.prototype.sensorPoint = function() {
  var x2 = this.x + this.width * Math.cos(this.angle);
  var y2 = this.y + this.width * Math.sin(this.angle);
  return { x: x2, y: y2 };
};

Sensor.prototype.draw = function(engine) {
  var x1 = this.x;
  var y1 = this.y;
  var x2 = this.sensorPoint().x;
  var y2 = this.sensorPoint().y;

  //engine.circle({
  //  color: { r: 0, g: 0, b:0 },
  //  x: x2,
  //  y: y2,
  //  radius: this.radius
  //});

  engine.ctx.strokeStyle = engine.rgb(this);
  engine.simpleLine(x1, y1, x2, y2);
  engine.ctx.strokeStyle = engine.rgb({color: { r: 0, g: 0, b: 0}});
};
