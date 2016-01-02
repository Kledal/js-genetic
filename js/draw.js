function Draw(game, canvasId, camera) {
  this.game = game;
  this.canvasId = canvasId;
  this.camera = camera;
  this.canvasElement = document.getElementById(this.canvasId);
  this.ctx = this.canvasElement.getContext("2d");
}

Draw.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.game.width, this.game.height);
};

Draw.prototype.text = function(x, y, text) {
  this.ctx.fillStyle = this.rgb({ color: { r:255, g:255, b:255}});
  this.ctx.font = "10px Arial";
  var pos = this.camera.relativePosition(x - 2, y - 2);
  this.ctx.fillText(text, pos.x, pos.y);
};

Draw.prototype.rgb = function(object) {
  return "rgb(" + object.color.r + "," + object.color.g + "," + object.color.b + ")";
};

Draw.prototype.circle = function(object) {
  this.ctx.fillStyle = this.rgb(object);
  this.arc(object.x, object.y, object.radius, 0, 2 * Math.PI);
  this.ctx.fill();
};

Draw.prototype.arc = function(x, y, r, startA, endA) {
  var pos = this.camera.relativePosition(x, y);
  this.ctx.beginPath();
  this.ctx.arc(pos.x, pos.y, r, startA, endA);
  this.ctx.closePath();
  this.ctx.stroke();
};

Draw.prototype.simpleLine = function(x1, y1, x2, y2) {
  var pos1 = this.camera.relativePosition(x1, y1);
  var pos2 = this.camera.relativePosition(x2, y2);

  if (Math.abs(pos1.x - pos2.x) > 30 || Math.abs(pos1.y - pos2.y) > 30) {
    return;
  }

  this.ctx.beginPath();
  this.ctx.moveTo(pos1.x, pos1.y);
  this.ctx.lineTo(pos2.x, pos2.y);
  this.ctx.stroke();
  this.ctx.closePath();
};
