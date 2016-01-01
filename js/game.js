function Game(options) {
  this.width = options.width;
  this.height = options.height;
  this.canvasId = options.id;
  this.baseBrain = options.baseBrain || null;
  this.drawEngine = new Draw(this, this.canvasId);
  this.generation = 0;

  this.lastUpdate = Date.now();
  this.objects = [];
  this.addWalls();
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

  setInterval(function() {
    _this.update();
  }, 0);

  //setInterval(function() {
  //  _this.draw();
  //}, 200);

  var setupDraw = function() {
    _this.draw();
    window.requestAnimationFrame(setupDraw);
  };
  window.requestAnimationFrame(setupDraw);
};

Game.prototype.draw = function() {
  this.drawEngine.clear();
  var len = this.objects.length;

  while(len--) {
    this.objects[len].draw(this.drawEngine);
  }
};

Game.prototype.update = function() {
  var now = Date.now();
  var dt = now - this.lastUpdate;
  this.lastUpdate = now;

  var gameDt = dt / 1000;
  var len = this.objects.length;
  while(len--) {
    this.objects[len].update(gameDt, game);
  }

  this.objects = _.reject(this.objects, function(object) {
    return (object.reject && object.reject()) || false;
  });
};

Game.prototype.newCreature = function(weights) {
  var creature = new Creature({
    x: (this.width/2) + (Math.random() * 50), y: (this.height/2) + (Math.random() * 50), radius: 5,
    color: { r: 10, g: 10, b: 255 }
  });
  if (weights) {
    creature.setWeights(weights);
  }

  return creature;
};

Game.prototype.newFood = function() {
  return new Food({ x: Math.random()*this.width, y: Math.random()*this.height });
};

Game.prototype.pushFood = function() {
  this.objects.push(this.newFood());
};

Game.prototype.removeCreatures = function() {
  this.objects = _.reject(this.objects, function(object) {
    return object instanceof Creature;
  });
};

Game.prototype.generatePopulation = function(amount) {
  var creatures = [];
  while(amount--) {
    var creature = this.newCreature();
    if (this.baseBrain !== null) {
      creature.brain = this.baseBrain;
    }
    creatures.push(creature);
  };

  var foodCount = _.filter(this.objects, function(obj) { return obj instanceof Food }).length;
  for(var i = foodCount; i < 200; i++) {
    this.objects.push(this.newFood());
  }

  return creatures;
};

Game.prototype.replacePopulation = function(creatures) {
  this.removeCreatures();
  this.objects.push.apply(this.objects, creatures);
};

Game.prototype.newPopulation = function() {
  var totalFitness = _.sum(this.getCreatures(), function(creature) { return creature.fitness(); });
  var creatures = _.sortBy(this.getCreatures(), function(creature) {
    return creature.fitness();
  }).reverse();

 $('.information').prepend('<p>Generation: ' + this.generation + '<br/> Total fitness: ' + totalFitness + '<br/> Best fitness: ' + creatures[0].fitness() + '</p>');

  var breed = this.crossover(creatures[0], creatures[1], 0);
  creatures.splice(creatures.length -2, 2, breed[0], breed[1]);

  var _this = this;
  _.each(creatures, function(creature) {
    _this.mutate(creature, 0.1, 0.3);
    creature.reset();
  });

  creatures[0].color = {r: 0, g: 0, b:0};
  creatures[1].color = {r: 0, g: 100, b:0};

  this.replacePopulation(creatures);
  this.generation++;
};

Game.prototype.getCreatures = function() {
  var length = this.objects.length;
  var objects = [];
  for(var i = 0; i < length; i++) {
    var object = this.objects[i];
    if (!(object instanceof Creature)) continue;

    objects.push(object);
  }
  return objects;
};

Game.prototype.bestCandidate = function() {
  var candidates = _.sortBy(this.getCreatures(), function(object) {
    return object.fitness();
  });
  return candidates.slice(-2);
};

Game.prototype.mutate = function(creature, mutationRate, maxPerturbation) {
  var mutated = false;
  var random = Math.random();
  var newWeights = [];
  if (mutationRate > random) {
    mutated = true;
    newWeights = _.map(creature.getWeights(), function(gnome) {
      return gnome + (Math.random() * 2.0 - 1.0) * maxPerturbation;
    });
  };

  if (mutated) {
    creature.setWeights(newWeights);
  }
};

Game.prototype.crossover = function(mother, father, crossoverRate) {
  var length = mother.getWeights().length;
  var crossoverPoint = Math.round(Math.random() * (length - 1));

  var momWeights = mother.getWeights();
  var fatherWeights = father.getWeights();

  var daughterWeights = momWeights.slice(0, crossoverPoint).concat(fatherWeights.slice(0, crossoverPoint));
  var sonWeights = momWeights.slice(crossoverPoint, length).concat(fatherWeights.slice(crossoverPoint, length));
  return [this.newCreature(sonWeights), this.newCreature(daughterWeights)];
};
