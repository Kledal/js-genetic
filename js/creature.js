function Creature(options) {
  this.x = options.x;
  this.y = options.y;
  this.radius = options.radius;
  this.rotation = 0;
  this.direction = 0;

  this.color = options.color;
  this.foodEaten = 0;

  this.sensors = [];
  this.sensorWidth = 10;
  this.sensorCount = 5;
  this.sensorAngles = 180;
  this.increase =  this.sensorAngles / this.sensorCount;

  for(var i = 0; i < this.sensorCount; i++) {
    var angle = this.increase * (i+1);
    this.sensors[this.sensors.length] = new Sensor(this, this.sensorWidth, angle);
  }

  this.brain = new Brain([(2 + this.sensorCount), 18, 2]);
}

Creature.prototype.setBrain = function(brain) {
  this.brain = brain;
}

Creature.prototype.setWeights = function(weights) {
  this.brain.setWeights(weights);
};

Creature.prototype.getWeights = function() {
  return this.brain.getWeights();
};

Creature.prototype.sensorValues = function() {
  return _.map(this.sensors, function(sensor) {
    return sensor.output;
  });
};

Creature.prototype.update = function(dt, game) {
  var sensorValues = this.sensorValues();
  var values = _.flatten([Math.cos(this.rotation), Math.sin(this.rotation), sensorValues]);
  var output = this.brain.activate(values);
  var x = output[0];
  var y = output[1];

  this.rotation += clamp(x - y, 0.3, -0.3);
  if (this.rotation > Math.PI * 2.0) this.rotation -= 2.0 * Math.PI;
  if (this.rotation < 0.0) this.rotation += 2.0 * Math.PI;

  var speed = (x + y) / 2;

  x = Math.cos(this.rotation);
  y = Math.sin(this.rotation);

  this.x += x * speed * dt;
  this.y += y * speed * dt;

  if (this.x > game.width) this.x -= game.width;
  if (this.x < 0) this.x += game.width;
  if (this.y > game.height) this.y -= game.height;
  if (this.y < 0) this.y += game.height;

  this.oldDirection = this.direction;
  this.direction = this.rotation * 180 / Math.PI;
  this.updateSensors(dt, game);
  this.lookForFood(game);
};

Creature.prototype.lookForFood = function(game) {
  var len = game.objects.length;
  for(var i = 0; i < len; i++) {
    var object = game.objects[i];
    if (!(object instanceof Food)) {
      continue;
    }

    var collision = game.collisionDetect(this.x, this.y, this.radius, object.x, object.y, object.radius);
    if (collision) {
      this.eatFood(object, game);
      break;
    }
  }
};

Creature.prototype.eatFood = function(food, game) {
  food.eat();
  this.foodEaten++;
  game.pushFood();
};

Creature.prototype.reset = function() {
  this.foodEaten = 0;
  this.color = { r: 10, g: 10, b: 255 };
};

Creature.prototype.fitness = function() {
  return (this.foodEaten);
};

Creature.prototype.updateSensors = function(dt, game) {
  var len = this.sensors.length;
  for(var i = 0; i < len; i++) {
    this.sensors[i].update(dt, game);
  }
};

Creature.prototype.draw = function(engine) {
  engine.circle(this);

  var len = this.sensors.length;
  for(var i = 0; i < len; i++) {
    this.sensors[i].draw(engine);
  }
  engine.text(this.x, this.y, this.foodEaten);
};
