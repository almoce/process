# The state of World



This visualization of countries, presented as a world choropleth map, illustrates the classification of income levels using color interpretation, based on data from the World Bank[^world-bank-api]. Below the map, a table provides detailed information for each country. The population column features a linear graphic representing normalized population trends. Additionally, searching for related information will result in interactions between the table and the map to enhancing data exploration.


[^world-bank-api]: https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries



```js
const data = FileAttachment('./data.json').json()
```

```js
function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
function countryInfo(i) {
	return {
		name: i.name,
		flag: getFlagEmoji(i.iso2Code),
		code: i.iso2Code,
		populations: i.iso2Code,
		region: i.region.value,
		incomeLevel: i.incomeLevel.value,
		capitalCity: i.capitalCity,
		longitude: i.longitude,
		latitude: i.latitude
	}
}


```

```js
// view(data.countries[1])
const populations = d3.group(data.populations[1], d => d.country.id)
const countries = data.countries[1].filter(i => i.region.value !== 'Aggregates').map(i => countryInfo(i))
const regions = data.countries[1].filter(i => i.region.value === 'Aggregates').map(i => countryInfo(i))
// view(populations)
// 
const colornamemap = d3.scaleOrdinal([countries.map(i => i.name)], d3.schemeAccent)

```



```js
let svgCountryElementGroup
let svgCountryAreaGroup
{
// Specify the chart’s dimensions.
const width = 1024;
const marginTop = 46;
const height = width / 2 + marginTop;

// Fit the projection.
const projection = d3.geoEqualEarth().fitExtent([[2, marginTop + 2], [width - 0, height]], { type: "Sphere" });
const path = d3.geoPath(projection);

// Index the values and create the color scale.
const valuemap = new Map(countries.map(d => ([d.name, d.incomeLevel])));
const scaleValue = ["Not classified", "Low income", "Lower middle income", "Upper middle income", "High income"]
const bandScale = d3.scaleBand(scaleValue, [1, 0]);
const color = (v) => d3.interpolateHcl("blue", "red")(bandScale(v));


// Create the SVG container.
const svg = d3.create("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [0, 0, width, height])
	.attr("style", "max-width: 100%; height: auto;");




// Add a white sphere with a black border.
svg.append("path")
  .datum({type: "Sphere"})
  .attr("fill", "white")
  .attr("stroke", "#CCC")
  .attr("d", path);

const rename = {
	'United States of America': 'United States',
	'Dem. Rep. Congo': 'Congo, Dem. Rep.',
	'Dominican Rep.': 'Dominican Republic',
	'Russia': 'Russian Federation',
	'Bahamas': 'Bahamas, The',
	'Venezuela': 'Venezuela, RB',
	"Côte d'Ivoire": "Cote d'Ivoire",
	"Central African Rep.": "Central African Republic",
	'Congo': "Congo, Rep.",
	'Eq. Guinea': 'Equatorial Guinea',
	'eSwatini': 'Eswatini',
	'Gambia': 'Gambia, The',
	'Laos': 'Lao PDR',
	'Vietnam': 'Viet Nam',
	'North Korea': "Korea, Dem. People's Rep.",
	'South Korea': 'Korea, Rep.',
	'Kyrgyzstan': 'Kyrgyz Republic',
	'Iran': 'Iran, Islamic Rep.',
	'Syria': 'Syrian Arab Republic',
	'Turkey': 'Turkiye',
	'Solomon Is.': 'Solomon Islands',
	'Brunei': 'Brunei Darussalam',
	'Slovakia': 'Slovak Republic',
	'Yemen': 'Yemen, Rep.',
	'N. Cyprus': 'Cyprus',
	'Egypt': 'Egypt, Arab Rep.',
	'Somaliland': 'Somalia',
	'Bosnia and Herz.': 'Bosnia and Herzegovina',
	'Macedonia': 'North Macedonia',
	'S. Sudan': 'South Sudan'
}
const renameKeys = Object.keys(rename)

data.countrymesh.objects.countries.geometries.forEach(i => {
	const targetRenameKey = renameKeys.find(x => i.properties.name === x)
	if (targetRenameKey) {
		i.properties.name = rename[targetRenameKey]
	}
})

const countriesFeatures = topojson.feature(data.countrymesh, data.countrymesh.objects.countries)


// Add a path for each country and color it according te this data.
svgCountryAreaGroup = svg.append("g")
	.selectAll("path")
	.data(countriesFeatures.features)
	.join('g')
	.classed('country-id-name', true)


svgCountryAreaGroup.append("path")
		.attr("fill", d => color(valuemap.get(d.properties.name) || 0))
		.attr("d", path)

svgCountryAreaGroup.append("title")
		.text(d => `${d.properties.name}`);




const countryMesh = topojson.mesh(data.countrymesh, data.countrymesh.objects.countries, (a, b) => a !== b)
// Add a white mesh.
const borderpath = svg.append("path")
	.datum(countryMesh)
	.attr("fill", "none")
	.attr("stroke", "white")
	.attr("stroke-width", 2)
	.attr("d", path)




const getCenter = (d) => path.centroid(d)
const getCountry = (d) => countries.find(i => i.name === d.properties.name)

svgCountryElementGroup = svg.append("g")
  .selectAll("g")
  .data(countriesFeatures.features)
  .join("g")
  .classed('country-id-name', true)


const grouptext = svgCountryElementGroup.append('text')
	.text((d) => getCountry(d)?.flag)
	.attr("x", d => getCenter(d)[0] - 10)
  .attr("y", d => getCenter(d)[1] + 5)


view(svg.node())


const dataElement = svg.append('g')
const tipElem = svg.append('foreignObject')
.attr('width', width).attr('height', height).classed('hide', true).attr('x', 0).attr('y', 0).style('position', 'relative')
tipElem.append('xhtml:div').attr('class', 'tooltip').html(`
	<div>Total: 0</div>
	<div>Year: 0</div>
`)

const formatThousands = d3.format(",");


grouptext.on('pointerover', (e, data) => {
	const [x, y] = d3.pointer(e)
	const c = getCountry(data)

	// console.log(x,y)
	tipElem.classed('hide', false)
	tipElem.select('div')
	.style('left', `${x}px`)
	.style('top', `${y}px`)
	.html(`
		<div>Name: ${c.name}</div>
		<div>Region: ${c.region}</div>
		<div>IncomeLevel: ${c.incomeLevel}</div>
		<div>Populations.: ${formatThousands(populations.get(c.populations)[1].value)}</div>
	`)
})
grouptext.on('pointerleave', () => {
	tipElem.classed('hide', true)
})


const legend = svg.append('g').selectAll('g').data(scaleValue).join('g')

legend.append('circle')
.attr('cx', 10)
.attr('cy', 10)
.attr('r', 5)
.attr('fill', d => color(d))
legend.append('text').text(d => d).attr('x', 20).attr('y', 15)

let legegndspace = 0
legend.attr("transform", (d, i, n) => {
	const box = n[i].getBBox()
	const translate = `translate(${i ? legegndspace : 0}, 0)`
	legegndspace = legegndspace + box.width + 10
	return translate
});

}
```


```js
const countriesFilter = countries.map(i => ({
	...i,
	populations: populations.get(i.code),
	color: ''
}))
const search = view(Inputs.search(countriesFilter, {placeholder: "Search country..."}));

const preselet = []
```

```js

const selection = view(Inputs.table(search, {
	columns: ['name', 'populations', 'capitalCity', 'region', 'incomeLevel', 'color'],
	format: {
		"name": (v, idx, arr) => {
			return html`${arr[idx].flag} ${v}`
		},
		"populations": (v) => {
			const data = v.filter(i => i.value)
			const arrv = data.filter(i => i.value).map(i => i.value)
			const valueDomain = d3.scaleLinear().domain([d3.min(arrv), d3.max(arrv)])
			return Plot.lineY(data.map(i => valueDomain(i.value)).reverse()).plot({axis: null, width: 100, height: 10})
		},
		'color': (v, idx, arr) => {
			const name =  arr[idx].name
			return Plot.dotX('a', {r: 5, fill: colornamemap(name)}).plot({axis: null, width: 80, height: 12})
		}
	},
	select: true,
	height: 160,
	value: preselet
}))
```

```js
const searchResult = search.map(i => i.name)

svgCountryElementGroup.each(function(d, i) {
	const name = d.properties.name
	const inSearch = searchResult.find(i => i === name)
	d3.select(this).style('opacity', inSearch ? 1 : 0)
})

svgCountryAreaGroup.each(function(d, i) {
	const name = d.properties.name
	const inSearch = searchResult.find(i => i === name)
	d3.select(this).select('path').style('opacity', inSearch ? 1 : 0.2)
})
```


### Population growth (annual %)

```js
const pop = data.popGrow[1]

{
 const data = pop.filter(i => {
 	const name = i.country.value
	const inSearch = selection.find(i => i.name === name)
 	return i.value && inSearch && Number(i.date) >= 1990
 }).map(i => {
 	return {
 		...i,
 		date: new Date(i.date)
 	}
 }).reverse()
 const time = data.map(i => i.date)
 const value = data.map(i => i.value)

  // Declare the chart dimensions and margins.
  const width = 1024;
  const height = 300;
  const marginTop = 10;
  const marginRight = 60;
  const marginBottom = 30;
  const marginLeft = 30;

  // Declare the x (horizontal position) scale.
  const x = d3.scaleUtc()
      .domain(d3.extent(time))
      .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
      .domain(d3.extent(value).map((v, i) => v + (i ? 1 : -1))) // [d3.min(value), d3.max(value)]
      .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3.create("svg")
      // .attr("width", width)
      // .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
    	.attr("style", "max-width: 100%;");

  // Add the x-axis.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

  // Add the y-axis.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));

 const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom.alpha(0.1));




const dataToDraw = d3.group(data, i => i.country.value)

dataToDraw.entries().forEach(i => {
	const [name, arr] = i

		const last = arr[arr.length -1]
	  const labeltext = svg.append('text').text(name)
	  .attr('style', 'font-size: 12px')
	  .attr('x', width - marginRight+10)
	  .attr('y', y(last.value))

	  labeltext.classed('hide', true)

			 // Append a path for the line.
	  const pathColor = svg.append("path")
	      .attr("fill", "none")
	      .attr("stroke", colornamemap(name))
	      .attr("stroke-width", 3)
	      .attr("d", line(arr))

  	pathColor.style("opacity", 0.8)

	  const path = svg.append("path")
	      .attr("fill", "none")
	      .attr("stroke", 'black')
	      .attr("stroke-width", 8)
	      .style("opacity", 0)
	      .attr("d", line(arr))

      path.append('title').text(name)

			path.on('pointerover', e => {
      	labeltext.classed('hide', false)
      	pathColor.style("opacity", 1)
      })
      path.on('pointerleave', e => {
      	labeltext.classed('hide', true)
      	pathColor.style("opacity", 0.8)
      })

	  
})

view(svg.node())

}
```

<style>
.my-div-icon {
	font-size: 20px;
}
.my-div-icon p {
	font-size: 12px;
}
.country-id-name {
	cursor: pointer;
	opacity: 1;
	transition: all 0.5s;
}

svg foreignObject {
	pointer-events: none;
}

.hide, .tooltip {
	opacity: 0;
	pointer-events: none;
}

.tooltip div {
	min-width: 30px;
	display: flex;
	flex-flow: row;
	justify-content: space-between;
}

.tooltip {
	opacity: 1;
	transition: opacity 0.3s;
	z-index: 1;
	position: absolute;
	font-size: 12px;
	box-shadow: 0.2px 0.4px 1.3px rgba(0,0,0, 0.2);
	border-radius: 2px;
	padding: 2px 5px;
	background: #fff;
	color: #000;
}

</style>