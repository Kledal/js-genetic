function Brain(layout, weights) {
  this.layout = layout;
  this.input = layout[0];
  this.hidden = layout[1];
  this.output = layout[2];

  this.network = new Architect.Perceptron(this.input, this.hidden, this.output);
  if (weights) this.setWeights(weights);
}

Brain.prototype.setNetwork = function(network) {
  this.network = network;
}

Brain.prototype.activate = function(values) {
  return this.network.activate(values);
}

Brain.prototype.loopConnections = function(callback, reset) {
  var neurons = this.network.neurons();
  _.each(neurons, function(obj) {
    var neuron = obj.neuron;
    if (reset === true) {
      neuron.clear();
      neuron.old = neuron.state = neuron.activation = 0;
    }
    var connections = neuron.connections.projected;
    var keys = _.keys(connections);
    _.each(keys, function(key) {
      callback(connections[key]);
    });
  });
};

Brain.prototype.getWeights = function() {
  var weights = [];
  this.loopConnections(function(connection) {
    weights[weights.length] = connection.weight;
  });

  return weights;
};

Brain.prototype.setWeights = function(weights) {
  var w = 0;
  this.loopConnections(function(connection) {
    connection.weight = weights[w];
    w++;
  }, true);
};
