const fs = require('fs');
let content = fs.readFileSync('src/components/ui/InteractiveCanvas.tsx', 'utf8');

content = content.replace(/e\.clientX \| rect\.left/g, 'e.clientX - rect.left');
content = content.replace(/e\.clientY \| rect\.top/g, 'e.clientY - rect.top');
content = content.replace(/0\.45 \| 0\.80/g, '0.45 - 0.80');
content = content.replace(/\(Math\.random\(\) \| 0\.5\)/g, '(Math.random() - 0.5)');
content = content.replace(/particles\[i\]\.x \| particles\[j\]\.x/g, 'particles[i].x - particles[j].x');
content = content.replace(/particles\[i\]\.y \| particles\[j\]\.y/g, 'particles[i].y - particles[j].y');
content = content.replace(/\(1 \| dist \/ 140\)/g, '(1 - dist / 140)');
content = content.replace(/mouse\.x \| p\.x/g, 'mouse.x - p.x');
content = content.replace(/mouse\.y \| p\.y/g, 'mouse.y - p.y');
content = content.replace(/\(1 \| dist \/ mouse\.radius\)/g, '(1 - dist / mouse.radius)');

fs.writeFileSync('src/components/ui/InteractiveCanvas.tsx', content);

let timeline = fs.readFileSync('src/components/ui/radial-orbital-timeline.tsx', 'utf8');
timeline = timeline.replace(/-90 \| nodeIndex/g, '-90 - nodeIndex');
timeline = timeline.replace(/targetDeg \| rotationAngle/g, 'targetDeg - rotationAngle');
fs.writeFileSync('src/components/ui/radial-orbital-timeline.tsx', timeline);
