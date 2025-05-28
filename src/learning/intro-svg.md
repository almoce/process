
# Intro SVG with d3
## A introduction to svg shape and command with d3.js

*[SVG]: Scalable Vector Graphics  
*[HTML]: HyperText Markup Language
*[DOM]: Document Object Model
*[API]: Application Programming Interface



## Create Element
To create a SVG elemet with d3, we can use `d3.create`[^d3-create-api] API to create the DOM element, we can use direcly with d3 API or we can define a class that receives the element’s tag name and attributes. 

Here we create an element class that works with `d3.create` to create DOM elements and assign attributes to them. Additionally, a extended from this class to create auxiliary grey elements that help with visual presentation and interaction. This approach can help us to manage element creation and styling efficiently while enhancing user experience with visual helpers.


[^d3-create-api]: This method assumes the HTML namespace, so you must specify a namespace explicitly when creating SVG or other non-HTML elements; see namespace for details on supported namespace prefixes [d3js.org](https://d3js.org/d3-selection/modifying#create) . 


```ts echo
interface I_Elem_ARG {
	TAG_NAME: string 
	ATTRIBUTES: Record<string, string|number>	
}
class Elem {
	select: d3.Selection<any, undefined, null, undefined>
	constructor(tag: I_Elem_ARG["TAG_NAME"], attributes: I_Elem_ARG['ATTRIBUTES']) {
		this.create(tag, attributes)
	}
	create(tag: I_Elem_ARG["TAG_NAME"], attributes: I_Elem_ARG['ATTRIBUTES']) {
		const elm = d3.create(tag)
		for (let i in attributes) {
			elm.attr(camelToKebab(i), attributes[i])
		}
		this.select = elm
		return this.select
	}

	text(v: string) {
		this.select.text(v)
	}
	node() {
		return this.select.node()
	}
}



class AuxiliarSVG extends Elem {
	elements: Record<string, Elem>
	private args: [I_Elem_ARG['TAG_NAME'], I_Elem_ARG['ATTRIBUTES']]
	constructor(tag: I_Elem_ARG['TAG_NAME'], attributes: I_Elem_ARG['ATTRIBUTES']) {
		super(tag, attributes)
		this.args = [tag, attributes]
		this.initHelper()
	}
	initHelper() {
		this.select.attr('class', 'nopointer')
		this.elements = {}
		const auxilyarElements = {
			path: {
				d: 'M 0 100 H 200 M 100 0 V 200',
				stroke: '#ccc',
				strokeDasharray: 2
			},
			circle: {
				r: 2,
				fill: '#ccc',
				class: 'hidden'
			},
			text: {
				class: 'hidden',
				style: 'font-size: 10px;',
				fill: '#aaa',
				x: 5,
				y: 195
			}
		}
		const group = this.select.append('g')
		for (let elm in auxilyarElements) {
			this.elements[elm] = new Elem(`svg:${elm}`, auxilyarElements[elm])
			group.append(() => this.elements[elm].node())
		}
	
		this.select.on('mouseenter', this.onEnterAndLeave.bind(this, false))
		this.select.on('mouseleave', this.onEnterAndLeave.bind(this, true))
		this.select.on('pointermove', this.onMove.bind(this))
	}
	elem(key: string) {
		return this.elements[key].select
	}
	onEnterAndLeave(flag: boolean) {
		this.elem('circle').classed('hidden', flag)
		this.elem('text').classed('hidden', flag)
	}
	onMove(event: MouseEvent) {
		const [x, y] = d3.pointer(event);
		this.elem('circle').attr('cx', x).attr('cy', y)
		this.elem('text').text(`x:${Math.floor(x)} y:${Math.floor(y)}`)
	}
	clone() {
		return new AuxiliarSVG(...this.args)
	}
}



```

```js
function camelToKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // insert - between lowercase/number and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // handle consecutive capitals
    .toLowerCase();
}

function parseSVGPath(path) {
  // Regex to match commands and their parameters
  const regex = /([a-zA-Z])([^a-zA-Z]*)/g;
  const matches = [...path.matchAll(regex)];
  const result = [];

  for (const match of matches) {
    const command = match[1];
    // Split parameters by comma or whitespace, filter out empty strings
    const params = match[2]
      .trim()
      .replace(/(\d)-/g, '$1 -') // Separate numbers like 10-10 to 10 -10
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);

    result.push({ command, params });
  }

  return result;
}
```

------

First to create a simple SVG element, we can call the class had defined above to make the new element, and define the attribute that we want to assgin to the element.

```js echo
const size = 200
const emptySVG = new AuxiliarSVG('svg', {
	style: 'border: 1px dashed #ccc;',
	width: size,
	height: size,
})
emptySVG.select.attr('viewBox', `0 0 ${size} ${size}`)
```

```js
display(emptySVG.node())
````
------
## Basic Shape
To create a child element in the svg container or appending child element we also need have take a consideration with the namespace[^d3-namespace][^svg-namespace], such as DOM API `createElementNS`.

[^d3-namespace]: A case where you need to specify them is when appending an element to a parent that belongs to a different namespace [d3js.org](https://d3js.org/d3-selection/namespaces#namespaces) . 
[^svg-namespace]: Namespaces crash course [mozilla.org](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Namespaces_crash_course) .



There are several common used basic shapres[^svg-basic-shapes]: rectangle, circle, ellipse, line, polyline, polygon, path.

[^svg-basic-shapes]: Basic shapes for SVG [mozilla.org](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Basic_shapes) .


  
## Reactangle, Line, Cirlce

In this example, we take two basic shapes, a rectangle, a line and a circle, and align them in the center of the SVG container, distributing them evenly in space.


```js echo
// - Rectangle   
// <rect x="25" y="75" width="50" height="50" fill="black"></rect>
const react = new Elem('svg:rect', {
	x: size/4 - size/4/2,
	y: size/4 * 2 - size/4/2,
	width: size/4,
	height: size/4,
	fill: 'black'
})

// - Circle   
// <circle cx="150" cy="100" r="25" fill="red"></circle>
const circle = new Elem('svg:circle', {
	cx: size/4 * 3,
	cy: size/4 * 2,
	r: 25,
	fill: 'red'
})


// - Line    
// `<line x1="10" x2="50" y1="110" y2="150" stroke="black" stroke-width="5"/>`  
const line = new Elem('svg:line', {
	x1: size/4 * 2,
	y1: size/4,
	x2: size/4 * 2,
	y2: size/4 * 3 ,
	strokeWidth: 12,
	stroke: 'blue',
})

```


```js
const svgWithShape = emptySVG.clone().select
const shapes = []
shapes.push(react.node(), circle.node(), line.node())
shapes.forEach(i => svgWithShape.append(() => i))
display(svgWithShape.node())
```


If we using with d3, we can group the data to a list, and define a line function to parse the line of points datas.

```js echo
const data = [{x: 0, y: 0}, {x: 100, y: 100}, {x: 120, y: 170}]
const d3line = d3.line().x((d) => d.x).y((d) => d.y)
const d3LineElm = new Elem('svg:path', {
	d: d3line(data),
	fill: 'none',
	stroke: 'currentColor'
})
```

```js
{
	const svg = emptySVG.clone().select
	svg.append(() => d3LineElm.node())
	display(svg.node())	
}

```

## Polyline and Polygon  

A polyline is similar to a polygon, composed by a list of points, only the polygon that alwasy closed the shape with last to first point.   
A list of points formated as following string format: `${x}COMMA${y}SPACE${x2}COMMA${y2}`

```js echo
// const px = [x1, x2, x3]
// const py = [y1, y2, y3]
const poinst = d3.transpose([px, py]) 
// Transpose array to => [[x1, y1], [x2, y2], [x3, y3]]
const listPointsString = poinst.map(i => i.join(',')).join(' ')
// Polyline
// <polyline points="64,32 92,53 48,85" 
// stroke="black" stroke-width="2" fill="none"></polyline>
const polyline = new Elem('svg:polyline', {
	points:	listPointsString,
	stroke: 'currentColor',
	strokeWidth: 2,
	fill: fillColor ? 'red': 'none'
})


// Polygon
// <polygon points="64,32 92,53 48,85" 
// stroke="black" stroke-width="2" fill="none"></polygon>
const polygon = new Elem('svg:polygon', {
	points:	listPointsString,
	stroke: 'currentColor',
	strokeWidth: 2,
	fill: fillColor ? 'red': 'none'
})

```

```js
const fillColor = view(Inputs.toggle({label: "fillColor", values: [1, 0]}));

const xInput = Inputs.form([
  Inputs.range([10, 190], {step: 1, value: Math.random() * 150, label: "x1"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 150, label: "x2"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 150, label: "x3"})
]);
const yInput = Inputs.form([
  Inputs.range([10, 190], {step: 1, value: Math.random() * 150, label: "y1"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 150, label: "y2"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 150, label: "y3"})
]);

const px = Generators.input(xInput)
const py = Generators.input(yInput)

view(html`<div style="display:flex; gap:30px; flex-wrap: wrap;">${xInput}${yInput}</div>`)

```

```js
const svgPolyShape = emptySVG.clone().select
const svgPolyShape2 = emptySVG.clone().select

{
	svgPolyShape.style('margin-right', '10px').append(() => polyline.node())
	svgPolyShape2.append(() => polygon.node())

	const shapes = [svgPolyShape, svgPolyShape2]
	shapes.forEach(shape => {
		const tagName = shape.selectChildren('polyline,polygon').node().tagName
		const textLabelNode = new Elem('svg:text', {x:5, y: 10})
		textLabelNode.select.text(tagName.toUpperCase()).attr('class','labeltext')
		shape.append(() => textLabelNode.node())
		poinst.forEach((v, i) => {
			shape.append(() => {
				const [x, y] = v
				const pointTextNode = new Elem('svg:text', {x, y})
				pointTextNode.select.text(`p_${i+1}`).attr('class', 'labeltext')
				return pointTextNode.node()
			})
		})
	})
}
display(svgPolyShape.node())
display(svgPolyShape2.node())
```

## Path

A path[^mdn-path-dev] is the general shape that can be draw with any kind of shape. Along with the attribute `d` define a list of information with parameters and commands. A command letter consiste in two variants *uppercase* and *lowercase*, each corresponde to *absolute* and *relative* coordinates.  
- `M x y` / `m dx dy`: move to x and y
- `L x y` / `l dx dy`: line to x and y 
- `H x` / `h x`, `V y` / `v y`: horizontal and vertical line
- `Z` / `z`: close path to the first point

[^mdn-path-dev]: The <path> element is the most powerful element in the SVG library of basic shapes. It can be used to create lines, curves, arcs, and more. [mozilla.org](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths)


```js echo
const [M_x, M_y, H, V, h, v, L_x, L_y] = simplePathFormValue
const simplePath = new Elem('svg:path', {
	d: `M ${M_x} ${M_y} H ${H} V ${V} h ${h} v ${v} L ${L_x} ${L_y}`,
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2

})

```


```js
const mcount = Mutable(0)
const increment = () => mcount.value++

view(Inputs.button([["Randomize", increment]]))
```

```js
const ranodmSeed = mcount
const simplePathForm = Inputs.form([
  Inputs.range([10, 190], {step: 1, value: Math.random() * 160, label: "M_x"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 160, label: "M_y"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 160, label: "H"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 160, label: "V"}),
  Inputs.range([-100, 100], {step: 1, value: Math.random() * 100, label: "h"}),
  Inputs.range([-100, 100], {step: 1, value: Math.random() * 100, label: "v"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 160, label: "L_x"}),
  Inputs.range([10, 190], {step: 1, value: Math.random() * 160, label: "L_y"}),
]);
const simplePathFormValue = Generators.input(simplePathForm)

view(simplePathForm)
```

```js
const pathShape = emptySVG.clone().select
pathShape.append(() => simplePath.node())

{
	const textNode = new Elem('svg:text', {
		x: M_x,
		y: M_y - 2,
		class: 'labeltext'
	})
	textNode.text('M')
	pathShape.append(() => textNode.node())
}
{
	const textNode = new Elem('svg:text', {
		x: H + 2,
		y: M_y - 2,
		class: 'labeltext'
	})
	textNode.text('H')
	pathShape.append(() => textNode.node())
}
{
	const textNode = new Elem('svg:text', {
		x: H + 2,
		y: V - 2,
		class: 'labeltext'
	})
	textNode.text('V')
	pathShape.append(() => textNode.node())
}
{
	const textNode = new Elem('svg:text', {
		x: H+h + 2,
		y: V - 2,
		class: 'labeltext'
	})
	textNode.text('h')
	pathShape.append(() => textNode.node())
}

{
	const textNode = new Elem('svg:text', {
		x: H+h + 2,
		y: V+v,
		class: 'labeltext'
	})
	textNode.text('v')
	pathShape.append(() => textNode.node())
}

{
	const textNode = new Elem('svg:text', {
		x: L_x,
		y: L_y - 2,
		class: 'labeltext'
	})
	textNode.text('L')
	pathShape.append(() => textNode.node())
}

display(pathShape.node())
```


```js echo	
const crossShape = new Elem('svg:path', {
	d: 'M75 25 h50 v50 h50 v50 h-50 v50 h-50 v-50 h-50 v-50 h50 z',
	fill: 'black',
	stroke: 'grey',
	strokeWidth: 10
})
const heartShape = new Elem('svg:path', {
	d: 'M50 75 L100 125 L150 75',
	fill:'none',
	stroke: 'red',
	strokeWidth: 80,
	strokeLinecap: 'round'
})
````
```js
{
	const svg = emptySVG.clone().select
	svg.style('margin-right', '10px')
	svg.append(() => crossShape.node())
	display(svg.node())	
}

{
	const svg = emptySVG.clone().select
	svg.append(() => heartShape.node())
	display(svg.node())
}


```

## Bézier Curves

The command for Bezier Curve have two type, cubic for `C` with three points parameters, quatric for `Q` with only one control point. And the last `x y` is the last point which connect to the first point, the reset are control points. There is other command called `S` for smooth or reflection, the first control point is assumed to be a reflection of the one used previously.


- `Q x1 y1, x y` / `q dx1 dy1, dx dy`: quatric curve
- `C x1 y1, x2 y2, x y` / `c dx1 dy1, dx2 dy2, dx dy`: cubic curve
- `S x2, y2, x, y` / `s dx2 dy2, dx dy`: smooth reflect curve

```js echo
const bezierCurveQ = new Elem('svg:path', {
	d: 'M 50 100 Q 100 50, 150 100',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2
})

const bezierCurveC = new Elem('svg:path', {
	d: 'M 50 100 C 50 50, 150 50, 150 100',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2
})

const bezierCurveS = new Elem('svg:path', {
	d: 'M 50 100 C 50 50, 100 50, 100 100 S 150 150, 150 100',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2
})
```

```js
class ControlLayer {
	cmd = []
	points = []
	path = undefined
	group = undefined
	constructor(svg, path) {
		this.path = path
		this.group = svg.append('g')
		this.group.attr('style', 'fill: #ccc;stroke: #ccc')
		this.group.append('g').attr('aid', '1')
		this.group.append('g').attr('aid', '2')
		const d = path.attr('d')
		const cmds = parseSVGPath(d)
		this.cmds = cmds
		this.points = []
		this.init(this.group)
		this.update(this.group)
		// this.bind(g)
	}
	init(g) {
		for (let i in this.cmds) {
			const {command, params} = this.cmds[i]
			if (command === 'M') {
				const [x, y] = params
				const p = g.append('circle').attr('class', 'hightlight').attr('r', 5)
				this.points.push({
					p,
					v: 'M',
					param: [x, y]
				})
				
			} else {
				const list = Array.from(d3.group(params, (d, i) => Math.floor(i / 2)).values());
				for (let i in list) {
					const [x, y] = list[i]
					const p = g.append('circle').attr('class', 'hightlight').attr('r', 5)
					this.points.push({
						p,
						v: Number(i) === 0 ? command : '',
						param: [x, y]
					})
				}
				if (!list.length) {
					const p = g.append('circle').attr('class', 'hightlight').attr('r', 5)
					this.points.push({
						p,
						v: command,
						param:[]
					})
				}
			}
		}
		this.points.forEach(i => {
			const {p, param} = i
			p.call(this.drag(p, param))
		})
	}
	drag(p, param) {
		return d3.drag().on('drag', (evt) => {
			const {x,y} = evt
			param[0] = x
			param[1] = y
			p.attr('fill', 'black')
			this.update()
		}).on('start', () => {
			this.dragging = true
			this.update()
		})
		.on('end', evt => {
			p.attr('fill', '#ccc')
			this.dragging = false
			this.update()
		})
	}

	update() {
		this.points.forEach(i => {
			const {p, param} = i
			const [x, y] = param
			if (x ?? false) {
				p.attr('cx', x).attr('cy', y)
			} else {
				p.remove()
			}
		})
		
		const g = this.group.selectChild('g[aid="1"]')
		g.selectChildren().remove()
		this.points.reduce((a,b) => {
			const notDefined = b.param[0] ?? false
			if (!notDefined) {
				return
			}

			const l = g.append('line')
			{
				const [x, y] = a.param
				l.attr('x1', x).attr('y1', y)
			}
			{
				const [x, y] = b.param
				l.attr('x2', x).attr('y2', y)
			}
			l.attr('stroke-width', '1').attr('stroke-dasharray', '2')
			return b
		})

		const p = []
		this.points.forEach(i => {
			p.push(i.v || ',', i.param.join(' '))
		})
		this.path.attr('d', p.join(' '))
	}
}
```

```js
{
	const svg = emptySVG.clone().select
	new ControlLayer(svg, bezierCurveQ.select)
	svg.append(() => bezierCurveQ.node())
	svg.style('margin-right', '10px')
	const textLabelNode = new Elem('svg:text', {x:5, y: 10})
	textLabelNode.select.text('TYPE Q').attr('class','labeltext')
	svg.append(() => textLabelNode.node())
	display(svg.node())
}
{
	const svg = emptySVG.clone().select
	new ControlLayer(svg, bezierCurveC.select)
	svg.style('margin-right', '10px')
	svg.append(() => bezierCurveC.node())
	const textLabelNode = new Elem('svg:text', {x:5, y: 10})
	textLabelNode.select.text('TYPE C').attr('class','labeltext')
	svg.append(() => textLabelNode.node())
	display(svg.node())
}

{
	const svg = emptySVG.clone().select
	new ControlLayer(svg, bezierCurveS.select)
	svg.append(() => bezierCurveS.node())
	const textLabelNode = new Elem('svg:text', {x:5, y: 10})
	textLabelNode.select.text('TYPE S').attr('class','labeltext')
	svg.append(() => textLabelNode.node())
	display(svg.node())
}
```

<!-- 
```js
{
	const svg = emptySVG.clone().select

	const line = new Elem('svg:path', {
		d: 'M 100 50 C 150 50, 150 150, 100 150 C 50 150, 50 50, 100 50 Z',
		// d: `M 150,100
		// 	C 150,127.614 127.614,150 100,150
		// 	C 72.386,150 50,127.614 50,100
		// 	C 50,72.386 72.386,50 100,50
		// 	C 127.614,50 150,72.386 150,100
		// 	Z`,
		fill: 'none',
		stroke: 'black',
		strokeWidth: 2
	})
	new ControlLayer(svg, line.select)
	svg.append(() => line.node())
	display(svg.node())
}
``` -->


## Arc

An arc is other type of curved line, which draw a sections of circle or ellipses, with the `A` command. 

- `A rx ry x-axis-rotation large-arc-flag sweep-flag x y`: absolute position arc
- `a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy`: relative position arc



```js echo
const pa = {x: 50, y:100}
const pb = {x: 150, y: 100}
const arcCurve = new Elem('svg:path', {
	d: `M ${pa.x},${pa.y} A ${rx} ${ry} ${rdegree} 0 0 ${pb.x} ${pb.y}`,
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2
})

```

```js
const rx = view(Inputs.range([0, 200], {step: 1, value: 57, label: "rx"}))
const ry = view(Inputs.range([0, 200], {step: 1, value: 47, label: "ry"}))
const rdegree = view(Inputs.range([0, 180], {step: 1, value: 30, label: "rdegree"}))
```
With combination of `large-arc-flag` and `sweep-flag`, we can have 4 variations to flip with.  
${Plot.dotX("a", {r: 5, fill: 'currentColor'}).plot({axis: null, width: 10, height: 10})} : large-arc-flag = 0, sweep-flag = 0  
${Plot.dotX("a", {r: 5, fill: 'red'}).plot({axis: null, width: 10, height: 10})} : large-arc-flag = 1, sweep-flag = 0  
${Plot.dotX("a", {r: 5, fill: 'blue'}).plot({axis: null, width: 10, height: 10})} : large-arc-flag = 0, sweep-flag = 1  
${Plot.dotX("a", {r: 5, fill: '#3E7C00'}).plot({axis: null, width: 10, height: 10})} : large-arc-flag = 1, sweep-flag = 1  



```js
{
	const svg = emptySVG.clone().select

	const lg10 = new Elem('svg:path', {
		d: `M ${pa.x},${pa.y} A ${rx} ${ry} ${rdegree} 1 0 ${pb.x} ${pb.y}`,
		fill: 'none',
		stroke: 'red',
		strokeDasharray: 2,
		strokeWidth: 1
	})
	const lg01 = new Elem('svg:path', {
		d: `M ${pa.x},${pa.y} A ${rx} ${ry} ${rdegree} 0 1 ${pb.x} ${pb.y}`,
		fill: 'none',
		stroke: 'blue',
		strokeDasharray: 2,
		strokeWidth: 1
	})
	const lg11 = new Elem('svg:path', {
		d: `M ${pa.x},${pa.y} A ${rx} ${ry} ${rdegree} 1 1 ${pb.x} ${pb.y}`,
		fill: 'none',
		stroke: '#3E7C00',
		strokeDasharray: 2,
		strokeWidth: 1
	})

	svg.append(() => lg11.node())
	svg.append(() => lg10.node())
	svg.append(() => lg01.node())




	svg.append(() => arcCurve.node())

	// const centers = findCircleCenters(pa.x, pa.y, pb.x, pb.y, rx, ry)
	// for (let i in centers) {
	// 	svg.append('ellipse')
	// 	.attr('fill', 'none')
	// 	.attr('stroke', '#ccc')
	// 	.attr('cx', centers[i].x)
	// 	.attr('cy', centers[i].y)
	// 	.attr('rx', rx)
	// 	.attr('ry', ry)	
	// }
	
	// new ControlLayer(svg, arcCurve.select)
	display(svg.node())
}


```

<!-- 
{
	const svg = emptySVG.clone().select
	const solutions = solveEllipses(pa, pb, rx, ry);
	const angle = rdegree * Math.PI / 180
	for(let i in solutions) {
		let {x, y} = solutions[i]
		// const xN = x * Math.cos(angle) - y * Math.sin(angle)
		// const yN = x * Math.sin(angle) + y * Math.cos(angle)
		svg.append('ellipse')
		.attr('cx', x)
		.attr('cy', y)
		.attr('rx', rx).attr('ry', ry)
		.attr('fill', 'none').attr('stroke', 'black')

	}
	display(svg.node())
	display(solutions)
}


Arc is more complicate, to understand this, we need find a solution to get the two ellipse that intesect with two given points. as defined the ellipse equiation with point A and B, and the R for angle.

```tex
\left(\frac{A_x - x}{R_x}\right)^2 + \left(\frac{A_y - y}{R_y}\right)^2 = 1 \tag{1}
```
```tex
\left(\frac{B_x - x}{R_x}\right)^2 + \left(\frac{B_y - y}{R_y}\right)^2 = 1 \tag{2}
```

by subtract and combine the equiation, we can get:

```tex
\frac{2(B_x - A_x)}{R_x^2} x + \frac{2(B_y - A_y)}{R_y^2} y + \frac{A_x^2 - B_x^2}{R_x^2} + \frac{A_y^2 - B_y^2}{R_y^2} = 0
```

and simplify the equition:

* Let a = ${tex`\frac{2(B_x - A_x)}{R_x^2}`}
* Let b = ${tex`\frac{2(B_y - A_y)}{R_y^2}`}
* Let c = ${tex`\frac{A_x^2 - B_x^2}{R_x^2} + \frac{A_y^2 - B_y^2}{R_y^2}`}

```tex
a x + b y + c = 0 \Rightarrow x = -\frac{b}{a}y - \frac{c}{a} \tag{4}
```

```js
function solveEllipses(A, B, Rx, Ry) {
  const a = (2 * (B.x - A.x)) / (Rx * Rx);
  const b = (2 * (B.y - A.y)) / (Ry * Ry);
  const c = (A.x ** 2 - B.x ** 2) / (Rx * Rx) + (A.y ** 2 - B.y ** 2) / (Ry * Ry);

  function xFromY(y) {
    return -(b * y + c) / a;
  }

  function equation1(y) {
    const x = xFromY(y);
    const termX = ((x - A.x) ** 2) / (Rx * Rx);
    const termY = ((y - A.y) ** 2) / (Ry * Ry);
    return termX + termY - 1;
  }

  // Search for roots in a range
  function findAllSolutions(minY, maxY, step = 0.05, tolerance = 1e-6) {
    const solutions = [];
    let prevY = minY;
    let prevF = equation1(prevY);

    for (let y = minY + step; y <= maxY; y += step) {
      const f = equation1(y);
      if (prevF * f < 0) {
        // Root detected in this interval, apply bisection
        const root = bisection(prevY, y, equation1, tolerance);
        const x = xFromY(root);
        solutions.push({ x, y: root });
      }
      prevY = y;
      prevF = f;
    }

    return solutions;
  }

  function bisection(a, b, func, tol) {
    let mid;
    let fa = func(a);
    let fb = func(b);
    if (fa * fb > 0) throw new Error("No sign change in interval.");

    while ((b - a) / 2 > tol) {
      mid = (a + b) / 2;
      const fmid = func(mid);
      if (Math.abs(fmid) < tol) return mid;
      if (fa * fmid < 0) {
        b = mid;
        fb = fmid;
      } else {
        a = mid;
        fa = fmid;
      }
    }

    return (a + b) / 2;
  }

  // Define a y-range to search over
  const minY = Math.min(A.y, B.y) - 2 * Ry;
  const maxY = Math.max(A.y, B.y) + 2 * Ry;

  return findAllSolutions(minY, maxY);
}
``` -->
The command Arc with parameters and variations sometime can be more complicated to understand due to two intersections of ellipses. While the parameters are simple, but they can be difficult to visualize. However, we can implement a function[^ArcConversionEndpointToCenter] that uses the center and angle to determine where to draw the arc line, making the process more intuitive.

[^ArcConversionEndpointToCenter]: Elliptical arc parameter conversion [w3.org](https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter) 

<!-- 
/**
 * Converts center parameterization of an SVG arc to endpoint parameterization.
 * 
 * @param {number} cx - Center x of the ellipse
 * @param {number} cy - Center y of the ellipse
 * @param {number} rx - Ellipse radius x
 * @param {number} ry - Ellipse radius y
 * @param {number} phi - Ellipse rotation (in degrees)
 * @param {number} theta1 - Start angle (in degrees)
 * @param {number} deltaTheta - Sweep angle (in degrees)
 * @returns {object} { x1, y1, x2, y2, rx, ry, phi, fA, fS }
 */
 -->
```js echo	
function centerToEndpointArc(cx, cy, rx, ry, phi, theta1, deltaTheta) {
  // Convert degrees to radians
  const degToRad = angle => angle * Math.PI / 180;
  const radPhi = degToRad(phi);
  const radTheta1 = degToRad(theta1);
  const radDeltaTheta = degToRad(deltaTheta);

  // Rotation matrix
  function rotate(x, y, angle) {
    return {
      x: Math.cos(angle) * x - Math.sin(angle) * y,
      y: Math.sin(angle) * x + Math.cos(angle) * y
    };
  }

  // Calculate start point
  const startEllipse = {
    x: rx * Math.cos(radTheta1),
    y: ry * Math.sin(radTheta1)
  };
  const startRotated = rotate(startEllipse.x, startEllipse.y, radPhi);
  const x1 = startRotated.x + cx;
  const y1 = startRotated.y + cy;

  // Calculate end point
  const endEllipse = {
    x: rx * Math.cos(radTheta1 + radDeltaTheta),
    y: ry * Math.sin(radTheta1 + radDeltaTheta)
  };
  const endRotated = rotate(endEllipse.x, endEllipse.y, radPhi);
  const x2 = endRotated.x + cx;
  const y2 = endRotated.y + cy;

  // Large arc flag
  const fA = Math.abs(deltaTheta) > 180 ? 1 : 0;
  // Sweep flag
  const fS = deltaTheta > 0 ? 1 : 0;

  return {
    x1, y1, x2, y2, rx, ry, phi, fA, fS
  };
}

```

```js
const form = view(Inputs.form([
	  Inputs.range([-100, 100], {step: 1, value: 50, label: "rx"}),
	  Inputs.range([-100, 100], {step: 1, value: 50, label: "ry"}),
	  Inputs.range([0, 359], {step: 1, value: 0, label: "phi"}),
	  Inputs.range([0, 359], {step: 1, value: 0, label: "theta1"}),
	  Inputs.range([0, 359], {step: 1, value: 90, label: "deltaTheta"})
	]))
```

```js
{
	const svg = emptySVG.clone().select
	const param = centerToEndpointArc(
	  100, // cx
	  100, // cy
	  form[0],  // rx
	  form[1],  // ry
	  form[2],  // phi (degrees)
	  form[3],   // theta1 (degrees)
	  form[4]  // deltaTheta (degrees)
	);
	const svgPathParam = `d: M ${Math.floor(param.x1)} ${Math.floor(param.y1)} A ${param.rx} ${param.ry} ${param.phi} ${param.fA} ${param.fS} ${Math.floor(param.x2)} ${Math.floor(param.y2)}`
	display(svgPathParam)
	const elm = new Elem('svg:path', {
		d: `M ${param.x1} ${param.y1} A ${param.rx} ${param.ry} ${param.phi} ${param.fA} ${param.fS} ${param.x2} ${param.y2}`,
		stroke: 'currentColor',
		strokeWidth: 2,
		fill: 'none'
	})
	svg.append(() => elm.node())
	display(svg.node())
}
```


<style type="text/css">
svg *{
	user-select: none;
}
.labeltext {
	font-size: 10px;
	fill: currentColor;
}
.hidden {
	opacity: 0;
	transition: opacity 0.3s;
}
.nopointer {
	cursor: none;
}
.hightlight:hover {
	fill: black;
}

</style>