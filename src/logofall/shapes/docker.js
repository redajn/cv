export const dockerMap = [
  { method: 'move_to', data: [0, 25] },
  { method: 'line_to', data: [40, 25] },
  { method: 'quadratic_curve_to', data: [35, 19, 40, 13] },
  { method: 'quadratic_curve_to', data: [45, 16, 46, 20] },
  { method: 'quadratic_curve_to', data: [52, 19, 56, 23] },
  { method: 'quadratic_curve_to', data: [52, 29, 44, 27] },
  { method: 'bezier_curve_to', data: [33, 49, 2, 52, 0, 25] },
  { method: 'move_to', data: [4,24] },
  { method: 'line_to', data: [9,24] },
  { method: 'line_to', data: [9,19] },
  { method: 'line_to', data: [4,19] },
  { method: 'line_to', data: [4,24] },
  { method: 'move_to', data: [10,19] },
  { method: 'line_to', data: [10,24] },
  { method: 'line_to', data: [15,24] },
  { method: 'line_to', data: [15,19] },
  { method: 'line_to', data: [10,19] },
  { method: 'move_to', data: [16,24] },
  { method: 'line_to', data: [21,24] },
  { method: 'line_to', data: [21,19] },
  { method: 'line_to', data: [16,19] },
  { method: 'line_to', data: [16,24] },
  { method: 'move_to', data: [22,24] },
  { method: 'line_to', data: [27,24] },
  { method: 'line_to', data: [27,19] },
  { method: 'line_to', data: [22,19] },
  { method: 'line_to', data: [22,24] },
  { method: 'move_to', data: [28,24] },
  { method: 'line_to', data: [33,24] },
  { method: 'line_to', data: [33,19] },
  { method: 'line_to', data: [28,19] },
  { method: 'line_to', data: [28,24] },
  { method: 'move_to', data: [10,18] },
  { method: 'line_to', data: [15,18] },
  { method: 'line_to', data: [15,13] },
  { method: 'line_to', data: [10,13] },
  { method: 'line_to', data: [10,18] },
  { method: 'move_to', data: [16,18] },
  { method: 'line_to', data: [21,18] },
  { method: 'line_to', data: [21,13] },
  { method: 'line_to', data: [16,13] },
  { method: 'line_to', data: [16,18] },
  { method: 'move_to', data: [22,18] },
  { method: 'line_to', data: [27,18] },
  { method: 'line_to', data: [27,13] },
  { method: 'line_to', data: [22,13] },
  { method: 'line_to', data: [22,18] },
  { method: 'move_to', data: [22,12] },
  { method: 'line_to', data: [27,12] },
  { method: 'line_to', data: [27,7] },
  { method: 'line_to', data: [22,7] },
  { method: 'line_to', data: [22,12] },
];

// draft for new format ver
// { type: 'line', to: { x: 10, y: 20 } },
// { type: 'line', to: { x: 40, y: 20 } },
// { type: 'quadratic', cp: { x: 60, y: 10 }, to: { x: 80, y: 30 } },
// { type: 'bezier', cp1: { x: 100, y: 10 }, cp2: { x: 120, y: 50 }, to: { x: 140, y: 30 } },

// { type: 'move', to: { x, y } }
// { type: 'line', to: { x, y } }
// { type: 'quadratic', cp: { x, y }, to: { x, y } }
// { type: 'bezier', cp1: {...}, cp2: {...}, to: {...} }
// { type: 'arc', center: {...}, radius, start, end, anticlockwise }
// { type: 'arcTo', cp1: {...}, cp2: {...}, radius }

// const canvas = document.getElementById("my-house");
// const ctx = canvas.getContext("2d");

// // Set line width
// ctx.lineWidth = 2;

// ctx.beginPath();
// ctx.moveTo(0, 25);
// ctx.lineTo(40, 25);
// ctx.quadraticCurveTo(35, 19, 40, 13)
// ctx.quadraticCurveTo(45, 16, 46, 20)
// ctx.quadraticCurveTo(52, 19, 56, 23)
// ctx.quadraticCurveTo(52, 29, 44, 27)
// ctx.bezierCurveTo(33, 49, 2, 52, 0, 25)
// ctx.moveTo(4,24)
// ctx.lineTo(9,24)
// ctx.lineTo(9,19)
// ctx.lineTo(4,19)
// ctx.lineTo(4,24)
// ctx.moveTo(10,19)
// ctx.lineTo(10,24)
// ctx.lineTo(15,24)
// ctx.lineTo(15,19)
// ctx.lineTo(10,19)
// ctx.moveTo(16,24)
// ctx.lineTo(21,24)
// ctx.lineTo(21,19)
// ctx.lineTo(16,19)
// ctx.lineTo(16,24)
// ctx.moveTo(22,24)
// ctx.lineTo(27,24)
// ctx.lineTo(27,19)
// ctx.lineTo(22,19)
// ctx.lineTo(22,24)
// ctx.moveTo(28,24)
// ctx.lineTo(33,24)
// ctx.lineTo(33,19)
// ctx.lineTo(28,19)
// ctx.lineTo(28,24)
// ctx.moveTo(10,18)
// ctx.lineTo(15,18)
// ctx.lineTo(15,13)
// ctx.lineTo(10,13)
// ctx.lineTo(10,18)
// ctx.moveTo(16,18)
// ctx.lineTo(21,18)
// ctx.lineTo(21,13)
// ctx.lineTo(16,13)
// ctx.lineTo(16,18)
// ctx.moveTo(22,18)
// ctx.lineTo(27,18)
// ctx.lineTo(27,13)
// ctx.lineTo(22,13)
// ctx.lineTo(22,18)
// ctx.moveTo(22,12)
// ctx.lineTo(27,12)
// ctx.lineTo(27,7)
// ctx.lineTo(22,7)
// ctx.lineTo(22,12)
