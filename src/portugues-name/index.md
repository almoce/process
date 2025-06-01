# Portugues names data analysis
## Top 100 names registed in Portugal

[^name-data-source]: Instituto dos Registos e do Notariado | IRN.Justica.gov.pt
, [Registo de Nomes (Masculino) ](https://dados.justica.gov.pt/dataset/nomesmasculino) , [Registo de Nomes (Feminino)](https://dados.justica.gov.pt/dataset/nomesfeminino)


An overview of name registrations in Portugal[^name-data-source]. The most commonly used names can be easily identified on the right side. The fading color indicates the popularity trend, showing whether a name’s usage is increasing or decreasing with each time of year.


  
```js
const data = FileAttachment('./data.json').json()
```

```js
const tableData = []
for (let gender in data) {
	data[gender].forEach(i => {
		const item = {
			gender: gender,
			year: `${i['Ano']}`,
			name: i['NOME'],
			total: i['TOTAL']			
		}
		tableData.push(item)
	})
}
```

```js
const groupData = d3.group(tableData, d => d.name)
```

```js
Plot.plot({
  grid: true,
  inset: 10,
  color: {
  	legend: true,
  	type: 'ordinal',
  	scheme: "Blues"
  },
  symbol: {legend: true},
  marginLeft: 100,
  width: 1200,
  marks: [
    // Plot.frame(),
    Plot.dot(tableData, {
    	x: "total", y: "name", 
    	stroke: "year",
    	// r: 'total',
    	symbol: 'gender',
    	channels: {
    		year: 'year',
    		name: 'name',
    		gender: 'gender'
    	},
    	tip: {
    		format: {
    			name: true,
    			gender: true,
    			// year: v => v.getFullYear()
    		}
		}
    })
  ]
})
```



---

Here is a list of ${groupData.size} names in the dataset. We can present the data in a different way using a circle visualization, where each ring corresponds to a year. By normalizing the count data for each name registration, we can better distinguish specific names. The dot size represent the normalized size within the time range, providing a clearer comparison across years.

```js


const svg = d3.create('svg')
svg.attr('viewBox', '-200 -200 400 400')
svg.attr('style', 'max-width: 800px; display: block; margin: auto;')
// svg.attr('style', 'border: 1px solid #ccc')
const dataElement = svg.append('g')
const tipElem = svg.append('foreignObject')
.attr('width', 400).attr('height', 400).classed('hide', true).attr('x', -200).attr('y', -200).style('position', 'relative')
tipElem.append('xhtml:div').attr('class', 'tooltip').html(`
	<div>Total: 0</div>
	<div>Year: 0</div>
`)

const list = Array.from(groupData.keys()).sort()
let lineCount = 0
const color = d3.scaleOrdinal(groupData.get(list[0]).map(i => i.year), d3.schemeCategory10);
const tableTotals = tableData.map(i => i.total)
const totalScale = d3.scaleLinear().domain([d3.min(tableTotals), d3.max(tableTotals)])
const years = groupData.get(list[0]).map(i => i.year).sort((a,b) => b-a)

const circleRange = (200 - 60)/4 * 0.8

const circlelist = []
for(let i = 0; i < 5; i++) {

	const innerCircle = dataElement.append('circle').attr('cx', 0).attr('cy', 0).attr('r', (i+1) * circleRange)
	.attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 0.1).attr('class', 'hiddenline')
	
	circlelist.push(innerCircle)

}

while(lineCount < groupData.size) {
	const name = list[lineCount]
	const item = groupData.get(name)
	const gender = item[0].gender
	const data = item.map(i => i.total)
	const scale = d3.scaleLinear().domain([d3.min(data), d3.max(data)])

	const angle = (Math.PI*2/groupData.size) * lineCount
	const x = Math.cos(angle)
	const y = Math.sin(angle)

	item.sort((a,b) => b.year - a.year)

	dataElement.append('line').attr('stroke', 'currentColor').attr('stroke-width', 0.1)
			.attr('x1', x * circleRange).attr('y1', y * circleRange).attr('x2', x * circleRange * 5.3).attr('y2', y * circleRange * 5.3)

	item.forEach((v, i) => {
			const {total, year, gender} = v
			const normalscale = scale(total)
			const thisTotalScale = 250 - 100 * totalScale(total)
			const dist = (i+1) * circleRange

			const cx = dist * x
			const cy = dist * y
				

			// svg.append('text').text(`${year} ${total}`).attr('font-size', '5px')
			// .attr('x', cx).attr('y', cy)

			const theDot = dataElement.append('circle')
			.attr('cx', cx).attr('cy', cy)
			.attr('r', normalscale * 3)
			.attr('stroke', 'currentColor')
			.attr('stroke-width', '0.1')
			.attr('fill', `rgb(${thisTotalScale},${thisTotalScale},${thisTotalScale})`)

			theDot.on('pointerover', (e) => {
				const [x, y] = d3.pointer(e)
				console.log(x,y)
				tipElem.classed('hide', false)
				tipElem.select('div')
				.style('left', `${x + 200 + 5}px`)
				.style('top', `${y + 200 + 5}px`)
				.html(`
					<div>Name: ${name}</div>
					<div>Gender: ${gender}</div>
					<div>Total: ${total}</div>
					<div>Year: ${total}</div>
				`)
			})
			theDot.on('pointerleave', () => {
				tipElem.classed('hide', true)
			})
	})
	

	// svg.append('circle').attr('cx', x * 90).attr('cy', y * 90).attr('r', 1)

	dataElement.append('text').text(`${name}`).attr('font-size', '5px')
	.attr('x', x * 155).attr('y', y * 155)
	.attr('text-anchor', 'middle')
	.attr('fill', 'currentColor')

	lineCount++
}

	const text = dataElement.append('text').text("").attr('font-size', '10px').attr('x', 0).attr('y', 5).attr('text-anchor', 'middle').attr('fill', '#ccc')
	// const line2 = svg.append('line').attr('stroke', 'currentColor').attr('stroke-width', 0.1)
			// .attr('x1', 0).attr('y1', 0).attr('x2', 200).attr('y2', 200)

// console.log(svg.node())

let active = 0

svg.on('pointermove', (e) => {
	const [x, y] = d3.pointer(e)
	const len = Math.sqrt(x*x + y*y)
	// line2.attr('x2', x).attr('y2', y)
	const idx = Math.min(Math.floor(len / (circleRange + 2)), circlelist.length - 1)
	if (active != idx) {
		active = idx
		circlelist.forEach( i => i.classed('showline', false))
		circlelist[idx].classed('showline', true)
		text.text(years[idx])
	} else {
	
	}
	// circlelist[idx].classed('showline', true)
	// console.log(circlelist[idx].node())
})

```



```js
view(svg.node())
```



```js
Inputs.table(tableData, {
	columns: ['name', 'gender', 'year', 'total'],
	format: {
		// 'year': (v) => v.getFullYear()
	},
	sorte: 'total',
	select: false
})
```


<style type="text/css">
svg g, svg g * {
  pointer-events: all;
  cursor: crosshair;
}
.hiddenline {
	opacity: 0;
	transition: all 0.3s;
}
.showline {
	opacity: 1;
}
svg foreignObject {
	pointer-events: none;
}
.hide .tooltip {
	opacity: 0;
}
.tooltip {
	opacity: 1;
	transition: opacity 0.3s;
	z-index: 1;
	position: absolute;
	font-size: 5px;
	box-shadow: 0.2px 0.3px 1.2px rgba(0,0,0, 0.3);
	border-radius: 3px;
	padding: 2px 5px;
	background: #fff;
	color: #000;
}

	
</style>
