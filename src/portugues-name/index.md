# Portugues Name Overview
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