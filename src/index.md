---
toc: false
---



<div class="logo">
    <div class="row">
        <div id="logo" class="isolate">
            <svg width="300px" height="300px" viewBox="0 0 31.8017578 20.3251953" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                  <pattern id="canvasPattern" patternUnits="userSpaceOnUse" width="50" height="50">
                    <image id="canvasImage" width="50" height="50" />
                    </pattern>
                </defs>
                <g id="Page-1" stroke="none" stroke-width="1" >
                    <g id="v_v-copy" fill="url(#canvasPattern)" fill-rule="nonzero">
                        <polygon id="Path" points="3.69140625 0 7.3828125 8.01269531 11.0595703 0 14.765625 0 7.35351562 15.2490234 0 0"></polygon>
                        <polygon id="Path" points="7.41210938 17.2490234 24.375 17.2490234 24.375 20.3251953 7.41210938 20.3251953"></polygon>
                        <polygon id="Path" points="20.7275391 0 24.4189453 8.01269531 28.0957031 0 31.8017578 0 24.3896484 15.2490234 17.0361328 0"></polygon>
                    </g>
                </g>
            </svg>
        </div>
    </div>
    <div class="row">
        <h1>Process</h1>    
    </div>
        <div class="row">
            A digital garden of ideas, insights, and the messy joy from process.
        </div>
        <br />
        <div class="row">
            <p class="note">
            This is where I explore, question, and connect the dots—across technology, creativity, and the human mind. Every post is a snapshot of a learning process in motion. Not polished. Not perfect. Just real thinking, shared openly.
            </p>
        </div>
</div>

```jsx
const list = [
    {
        title: 'Intro SVG syntax with d3',
        link: '/learning/intro-svg',
        date: '2025'
    },
    {
        title: 'Portugues names visual data analysis',
        link: '/portugues-name/index',
        date: '2024'
    }
]
```


```jsx
import {HomeList} from './components/homelist.js'
display(<HomeList list={list} />)
```




```js
import * as d3 from "npm:d3";
const height = 300
const width = 300
const point = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
const circles = [];
const random = d3.randomLcg(42);
const n = 30;
let a = 0.1;
let x = width / 2;
let y = height / 2;
let r = Math.hypot(width, height) / 2;
let dr = r / 20;
while (r > 0) {
  circles.push({x, y, r, a});
  const t = random() * 2 * Math.PI;
  const s = Math.sqrt((random() * dr * dr) / 4);
  x += Math.cos(t) * s;
  y += Math.sin(t) * s;
  r -= dr;
  a = -a;
}

const canvas = document.createElement('canvas');
canvas.width = width * devicePixelRatio;
canvas.height = height * devicePixelRatio;
// canvas.style.width = `${width}px`;
document.querySelector('#logo').appendChild(canvas)
const context = canvas.getContext("2d");
context.scale(devicePixelRatio, devicePixelRatio);

(function frame(elapsed) {
  context.save();
  context.clearRect(0, 0, width, height);
  context.translate(width / 2, height / 2);
  context.rotate(elapsed / 5000);
  context.translate(-width / 2, -height / 2);
  context.beginPath();
  for (let i = 0; i < n; ++i) {
    let move = true;
    d3.pairs(circles, ({x: x1, y: y1, r: r1, a: a1}, {x: x2, y: y2, r: r2, a: a2}) => {
      const ai = ((i * 2) / n) * Math.PI;
      context[move ? ((move = false), "moveTo") : "lineTo"](...point(x1, y1, r1, a1 + ai));
      context.lineTo(...point(x2, y2, r2, a2 + ai));
    });
    d3.pairs(circles.slice().reverse(), ({x: x1, y: y1, r: r1, a: a1}, {x: x2, y: y2, r: r2, a: a2}) => {
      const ai = ((i * 2 + 1) / n) * Math.PI;
      context.lineTo(...point(x1, y1, r1, a1 + ai));
      context.lineTo(...point(x2, y2, r2, a2 + ai));
    });
    context.closePath();
  }
  context.fillStyle = getComputedStyle(canvas).getPropertyValue("color");
  context.fill();
  context.restore();
  const dataURL = canvas.toDataURL();
  document.getElementById('canvasImage').setAttribute('href', dataURL)
  if (canvas.isConnected) requestAnimationFrame(frame);
})();
```



<style>
canvas {
    position: absolute;
    left:0px;
    top: 0px;
    width: 300px;
    height: 300px;
    display: none;
}
#logo {
    position: relative;
    width: 300px;
    height: 300px;
    overflow: hideen;
}


.logo {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-flow: column;
}

.row {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.note {
    color: var(--theme-foreground-muted);
}

</style>
