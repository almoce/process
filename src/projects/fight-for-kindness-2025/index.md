# Fight for Kindness 2025

Fight for kindeness is a non-profit project[^fight-for-kindness-project] open to the entrie creative community. This project celebrates [World Kindness Day](https://en.wikipedia.org/wiki/World_Kindness_Day), by unifying the global creative community. 

[^fight-for-kindness-project]: TypeCampus's project https://www.typecampus.com/fight-for-kindness

```js
const events = FileAttachment("./submission-data.json").json();
```


```js
const list = []
for (let c in events) {
	list.push({
		country: c,
		2022: events[c][0],
		2023: events[c][1],
		2024: events[c][2]
	})
}
```

### Submission data form latest 3 years
```js
Inputs.table(list, {
	columns: [
		'country',
		'2022',
		'2023',
		'2024'
	],
	header: {
		country: 'Country'
	},
	select: false,
	sort: '2024',
	reverse: true
})
````

There are ${list.length} nations have been participating the project in the last 3 years.



