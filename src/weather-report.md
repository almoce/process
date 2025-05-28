---
# style: custom-style.css
toc: false
# sidebar: false
---


# Weather reprot 

this is a test project[^ref_project]

H~2~0 => <span>H<sub>2</sub>O</span>    
29^th^ => 29<sup>th</sup>  

<https://example.com>  
[relative link](./dashboard)  
[external link](https://example.com)  
[external link](<https://en.wikipedia.org/wiki/Tar_(computing)>)  


Here is a footnote reference,[^1] and another.[^longnote]

[^ref_project]: Footnote reference <small>[small link](https://example.com)</small>
[^1]: Here is the footnote <span>H<sub>2</sub>O</span>.
[^longnote]: Here's one with multiple blocks [normal external link](https://example.com).


## display
```js
display(1)
```

what is happening here

## js
```js
Math.random()
```

## forecast
```js
const forecast = FileAttachment("./data/forecast.json").json()
```

```js
display(forecast)
```


```js
display(
  Plot.plot({
    title: "Hourly temperature forecast",
    x: {type: "utc", ticks: "day", label: null},
    y: {grid: true, inset: 10, label: "Degrees (F)"},
    marks: [
      Plot.lineY(forecast.properties.periods, {
        x: "startTime",
        y: "temperature",
        z: null, // varying color, not series
        stroke: "temperature",
        curve: "step-after"
      })
    ]
  })
);
```