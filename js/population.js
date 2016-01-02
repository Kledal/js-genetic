function Population(game, options) {
  options = options || {};
  this.game = game;
  this.chromosomes = [];
  this.generation = 0;
  this.baseBrain = options.baseBrain || null;

  this.newCallback = options.new;
  this.mutationRate = options.mutationRate || 0.1;
}

Population.prototype = {
  newChromosome: function(brain) {
    return this.newCallback.call(this.game, brain);
  },

  update: function(dt, game) {
    var len = this.chromosomes.length;
    for(var i = 0; i < len; i++) {
      this.chromosomes[i].update(dt, game);
    }
  },

  draw: function(drawEngine) {
    var len = this.chromosomes.length;
    for(var i = 0; i < len; i++) {
      this.chromosomes[i].draw(drawEngine);
    }
  },

  initialGeneration: function(amount) {
    var chromosomes = [];
    for(var i = 0; i < amount; i++) {
      var chromosome = this.newChromosome();
      if (this.baseBrain !== null) {
        chromosome.brain.setNetwork(this.baseBrain);
      }
      chromosomes[i] = chromosome;
    };

    return chromosomes;
  },

  resetPopulation: function() {
    this.chromosomes = [];
  },

  replacePopulation: function(chromosomes) {
    this.resetPopulation();
    this.chromosomes = chromosomes;
  },

  totalFitness: function() {
    return _.sum(this.chromosomes, function(chromosome) {
      return chromosome.fitness();
    });
  },

  sortByFitness: function() {
    return _.sortBy(this.chromosomes, function(chromosome) {
      return chromosome.fitness();
    }).reverse();
  },

  newPopulation: function() {
    var chromosomes = this.sortByFitness();

    $('.information').prepend('<p>Generation: ' + this.generation + '<br/> Total fitness: ' + this.totalFitness() + '<br/> Best fitness: ' + chromosomes[0].fitness() + '</p>');

    var len = chromosomes.length/8;
    for(var i = 0; i < len; i++) {
      var offset = -2 * (i+1);
      var breed = this.crossover(chromosomes[0], chromosomes[1], 0);
      this.mutate(breed[0].brain, 0.1, 0.3);
      this.mutate(breed[1].brain, 0.1, 0.3);
      chromosomes.splice(chromosomes.length + offset, 2, breed[0], breed[1]);
    }

    _.each(chromosomes, function(chromosome) {
      chromosome.reset();
      //this.mutate(chromosome.brain, 0.1, 0.3);
    }, this);

    this.replacePopulation(chromosomes);
    this.generation++;
  },

  crossover: function(mother, father) {
    var newBrains = new GA().crossover(mother.brain, father.brain);
    return [this.newChromosome(newBrains[0]), this.newChromosome(newBrains[1])];
  },

  mutate: function(brain) {
    return new GA().mutate(brain, this.mutationRate);
  }
};
