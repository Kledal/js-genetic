function Draw(game, canvasId) {
  this.game = game;
  this.canvasId = canvasId;
  this.canvasElement = document.getElementById(this.canvasId);
  this.ctx = this.canvasElement.getContext("2d");
}

Draw.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.game.width, this.game.height);
};

Draw.prototype.text = function(x, y, text) {
  this.ctx.fillStyle = this.rgb({ color: { r:255, g:255, b:0}});
  this.ctx.font = "12px Arial";
  this.ctx.fillText(text, x, y);
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
  this.ctx.beginPath();
  this.ctx.arc(x, y, r, startA, endA);
  this.ctx.closePath();
  this.ctx.stroke();
};

Draw.prototype.simpleLine = function(x1, y1, x2, y2) {
  this.ctx.beginPath();
  this.ctx.moveTo(x1, y1);
  this.ctx.lineTo(x2, y2);
  this.ctx.stroke();
  this.ctx.closePath();
};
