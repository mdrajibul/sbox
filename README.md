# sbox

A [jQuery](https://github.com/mdrajibul/sbox) base plugin for dropdown and autocomplete.

## Documentation

<a href="http://www.rajibul.me/p/sbox.html">http://www.rajibul.me/p/sbox.html</a>

## Installation


```bash
# using npm
npm install --save @mdrajibul/sbox
```

## Usage

In your Js/TS file as jQuery:

```js

import $ from "jquery";

$(() => {
	$("#country").Sbox({ 
		width: '120px',
		typeHeader: false,
		dataStore: {
			json: [
				{
					id: 'usa',
					name: 'United states'
				},
				{
					id: 'uk',
					name: 'United kingdom'
				},
				{
					id: 'india',
					name: 'India'
				},
			],
		},
		listners: {
			onSelect: (el, data) => {
				console.log(el, data);
			},
		}
	});
});
```

In your Js/TS file without jQuery:

```js
new Sbox({ 
	selector: $("#sboxElement"),// it should be jquery or HTML element
	width: "120px",
	typeHeader: false,
	dataStore: {
		arrayList: [ 'United states', 'United kingdom','India']
	},
	listners: {
		onSelect: (el, data) => {
			console.log(el, data);
		},
	}
});
```
More information please visit <a href="http://www.rajibul.me/p/sbox.html#examples">Sbox examples</a>