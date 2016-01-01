function Creature(options) {
  this.startX = options.x;
  this.startY = options.y;
  this.x = options.x;
  this.y = options.y;
  this.radius = options.radius;
  this.rotation = 0;
  this.direction = 0;

  this.distanceMoved = 0;

  this.color = options.color;
  this.foodEaten = 0;

  this.sensors = [];
  this.sensorWidth = 10;

  this.sensorCount = 5;
  this.sensorAngles = 180;
  this.increase =  this.sensorAngles / this.sensorCount;

  this.sensors.push(new Sensor(this, this.sensorWidth, this.increase));
  this.sensors.push(new Sensor(this, this.sensorWidth, this.increase * 2));
  this.sensors.push(new Sensor(this, this.sensorWidth, this.increase * 3));
  this.sensors.push(new Sensor(this, this.sensorWidth, this.increase * 4));
  this.sensors.push(new Sensor(this, this.sensorWidth, this.increase * 5));

  this.brain = new Architect.Perceptron((2 + this.sensorCount), 25, 2);
}

Creature.prototype.setWeights = function(weights) {
  var w = 0;
  var neurons = this.brain.neurons();
  _.each(neurons, function(obj) {
    var neuron = obj.neuron;
    neuron.clear();
    neuron.old = neuron.state = neuron.activation = 0;
    var connections = neuron.connections.projected;
    var keys = _.keys(connections);
    _.each(keys, function(key) {
      connections[key].weight = weights[w];
      w++;
    });
  });
};

Creature.prototype.getWeights = function() {
  var neurons = this.brain.neurons();
  var weights = _.map(neurons, function(obj) {
    var neuron = obj.neuron;
    var connections = neuron.connections.projected;
    var keys = _.keys(connections);
    return _.map(keys, function(key) {
      return connections[key].weight;
    });
  });

  return _.flatten(weights);
};

Creature.prototype.sensorValues = function() {
  //return [this.sensors[0].output, this.sensors[1].output, this.sensors[2].output];
  return _.map(this.sensors, function(sensor) {
    return sensor.output;
  });
};

Creature.prototype.update = function(dt, game) {
  this.oldX = this.x;
  this.oldY = this.y;

  var sensorValues = this.sensorValues();

  var values = _.flatten([Math.cos(this.rotation), Math.sin(this.rotation), sensorValues]);
  var brainOutput = this.brain.activate(values);
  var x = brainOutput[0];
  var y = brainOutput[1];

  this.rotation += clamp(x - y, 0.3, -0.3);
  if (this.rotation > Math.PI * 2.0) this.rotation -= 2.0 * Math.PI;
  if (this.rotation < 0.0) this.rotation += 2.0 * Math.PI;

  var speed = (x + y) / 2;

  x = Math.cos(this.rotation);
  y = Math.sin(this.rotation);

  this.x += x * speed;
  this.y += y * speed;

  var pointA = Math.pow(this.x - this.oldX, 2);
  var pointB = Math.pow(this.y - this.oldY, 2);
  var distanceMoved = Math.sqrt(pointA + pointB);
  this.distanceMoved += distanceMoved;

  if (this.x > game.width) this.x -= game.width;
  if (this.x < 0) this.x += game.width;
  if (this.y > game.height) this.y -= game.height;
  if (this.y < 0) this.y += game.height;

  this.oldDirection = this.direction;
  this.direction = this.rotation * 180 / Math.PI;
  //this.direction = Math.atan2( (this.y - this.oldY), (this.x - this.oldX) ) * 180 / Math.PI;
  this.updateSensors(dt, game);

  var len = game.objects.length;
  while (len--) {
    var object = game.objects[len];
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

Creature.prototype.reset = function() {
  this.foodEaten = 0;
  this.distanceMoved= 0;
  this.color = { r: 10, g: 10, b: 255 };
};

Creature.prototype.fitness = function() {
  return (this.foodEaten);
};

Creature.prototype.eatFood = function(food, game) {
  food.eat();
  this.foodEaten++;
  game.pushFood();
};

Creature.prototype.updateSensors = function(dt, game) {
  var len = this.sensors.length;
  while(len--) {
    this.sensors[len].update(dt, game);
  }
};

Creature.prototype.draw = function(engine) {
  engine.circle(this);

  var len = this.sensors.length;
  while(len--) {
    this.sensors[len].draw(engine);
  }
  engine.text(this.x, this.y, this.foodEaten);
};

