function Game(options) {
  this.width = options.width;
  this.height = options.height;
  this.canvasId = options.id;

  this.population = new Population(this, {
    mutationRate: 0.1,
    new: this.newCreature,
    baseBrain: options.baseBrain || null
  });

  this.camera = new Camera(this);
  this.drawEngine = new Draw(this, this.canvasId, this.camera);

  this.lastUpdate = Date.now();
  this.objects = [];
  this.initLoop();
}

Game.prototype.addWalls = function() {
  var topWall = new Wall({x: 0, y: 0, width: this.width, height: 0});
  var bottomWall = new Wall({x: 0, y: this.height, width: this.width, height: this.height});

  var leftWall = new Wall({x: 0, y: 0, width: 0, height: this.height});
  var rightWall = new Wall({x: this.width, y: 0, width: this.width, height: this.height});
  this.objects.push(topWall, bottomWall, leftWall, rightWall);
};

Game.prototype.collisionDetect = function(x, y, r, x1, y1, r1) {
  var distX = x - x1;
  var distY = y - y1;
  var squareDist = (distX * distX) + (distY * distY);
  return squareDist <= (r + r1) * (r + r1);
}

Game.prototype.initLoop = function() {
  var _this = this;

  var setupDraw = function() {
    _this.update();
    _this.draw();
    window.requestAnimationFrame(setupDraw);
  };
  window.requestAnimationFrame(setupDraw);
};

Game.prototype.draw = function() {
  this.drawEngine.clear();
  var len = this.objects.length;

  for(var i = 0; i < len; i++) {
    this.objects[i].draw(this.drawEngine);
  }

  this.population.draw(this.drawEngine);
};

Game.prototype.update = function() {
  var now = Date.now();
  var dt = now - this.lastUpdate;
  this.lastUpdate = now;

  var gameDt = dt / 5;

  var len = this.objects.length;
  for(var i = 0; i < len; i++) {
    this.objects[i].update(gameDt, this);
  }
  this.population.update(gameDt, this);

  this.followBestCreature();

  this.objects = _.reject(this.objects, function(object) {
    return (object.reject && object.reject()) || false;
  });
};

Game.prototype.followBestCreature = function() {
  if (!this.bestLastCandidate) return;
  if (!this.camera.follow) return;
  this.camera.focus(this.bestLastCandidate.x, this.bestLastCandidate.y);
};

Game.prototype.newCreature = function(brain) {
  var creature = new Creature({
    x: (this.width * Math.random()), y: (this.height * Math.random()), radius: 5,
    color: { r: 10, g: 10, b: 255 }
  });
  if (brain) {
    creature.setBrain(brain);
  }

  return creature;
};

Game.prototype.newFood = function() {
  return new Food({ x: Math.random()*this.width, y: Math.random()*this.height });
};

Game.prototype.pushFood = function() {
  this.objects[this.objects.length] = this.newFood();
};

Game.prototype.newPopulation = function() {
  this.bestLastCandidate = this.population.sortByFitness()[0];
  this.population.newPopulation();
};

Game.prototype.replacePopulation = function(creatures) {
  this.population.replacePopulation(creatures);
};

Game.prototype.initialGeneration = function(amount) {
  var foodCount = _.filter(this.objects, function(obj) { return obj instanceof Food }).length;
  for(var i = foodCount; i < 200; i++) {
    this.objects.push(this.newFood());
  }

  return this.population.initialGeneration(amount);
};
