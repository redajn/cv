export class RenderShape {
  constructor(shape, strokeStyle = '#bbf7d0') {
    this.shape = shape;
    this.strokeStyle = strokeStyle;
  }

  draw(ctx, x, y, angle, radius) {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);

    ctx.beginPath();
    for (let i = 0; i < this.shape.length; i++) {
      const line = this.shape[i]
      const data = line.data.map(n => n - radius)
      switch (line.method) {
        case 'move_to':
          ctx.moveTo(...data);
          break;
        case 'line_to':
          ctx.lineTo(...data);
          break;
        case 'quadratic_curve_to':
          ctx.quadraticCurveTo(...data);
          break;
        case 'bezier_curve_to':
          ctx.bezierCurveTo(...data);
          break;
        default:
          console.log('Unknown draw method');
      }
    }

    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}
