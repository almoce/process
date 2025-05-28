# Folder

> a test folder test  
> muliplyer line


### Test a div  

<div class="bg-black text-[#ff0000] p-1">
	<span>
	this is a div
	</span>
	<p>
		this is inline test with html
		${Plot.lineY([Math.random() * 10, 2, 0, 4, 0, 3, 1, 5, 7, 2, 3]).plot({axis: null, width: 80, height: 10})}
	</p>
</div>
  
  
<br />
<br />
  


… include a ${Plot.lineY([Math.random() * 10, 2, 0, 4, 0, 3, 1, 5, 7, 2, 3]).plot({axis: null, width: 100, height: 10})} sparkline…
… dots ${Plot.dotX("abcdef", {r: 5, fill: Plot.identity}).plot({axis: null, width: 80, height: 12})} — say…



```jsx
const meta = document.querySelector('meta[name="color-scheme"]');
let colorScheme = 'light';
meta.content = colorScheme
function switchTheme() {
	colorScheme = colorScheme === 'light' ? 'dark' : 'light';
    document.documentElement.style.colorScheme = colorScheme; 
    meta.content = colorScheme;
    const root = window.document.documentElement;
    root.style.colorScheme = colorScheme;
    document.documentElement.style.setProperty("--theme-foreground-focus", colorScheme === 'light' ? 'red !important' : 'blue !important');

    root.querySelector('meta[name="color-scheme"]').content = colorScheme;
	console.log(window.document.documentElement)
}
function SwitchBottom() {
	return <button onClick={switchTheme}>swith</button>
}
```


```jsx
display(<SwitchBottom />)

```


```js
import {Card} from "../components/card.js";
```

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button className="bg-black text-white" onClick={() => setCount(count + 1)}>
      You clicked {count} times
    </button>
  );
}
```

### normal jsx =>
```jsx
display(<Counter />)
````

<br />

### echo mode =>
```jsx echo
display(
<Card title="A test of cards">
	<p>If you can read this, success!</p>
	<Counter />
</Card>
);
````


<br />

### run=false
```jsx run=false
display(<Counter />)
````