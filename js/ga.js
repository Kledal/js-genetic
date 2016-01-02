function GA() {}

GA.prototype = {
  mutate: function(brain, mutationRate) {
    var mutated = false;
    var random = Math.random();
    var newWeights = [];
    if (mutationRate > random) {
      mutated = true;
      newWeights = _.map(brain.getWeights(), function(gnome) {
        var random = Math.random();
        if (random > mutationRate) {
          return gnome + (Math.random() * 2.0 - 1.0);
        }
        return gnome;
      });
    };

    if (mutated) {
      brain.setWeights(newWeights);
    }
    return mutated;
  },

  /**
   * Crossovers two brains at a random crossover point and returns two new brains.
   */
  crossover: function(mother, father) {
    var totalWeights = mother.getWeights().length;

    var layout = mother.layout;
    var crossoverPoint = Math.round(Math.random() * (totalWeights - 1));

    var momWeights = mother.getWeights();
    var fatherWeights = father.getWeights();

    var daughterWeights = momWeights.slice(0, crossoverPoint).concat(fatherWeights.slice(0, crossoverPoint));
    var sonWeights = momWeights.slice(crossoverPoint, totalWeights).concat(fatherWeights.slice(crossoverPoint, totalWeights));

    return [new Brain(layout, sonWeights), new Brain(layout, daughterWeights)];
  }
};
