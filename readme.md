# bitmap-sdf [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Calculate signed distance field for an image / bw-data. Fork of [tiny-sdf](https://github.com/mapbox/tiny-sdf) with reduced API.

![bitmap-sdf](preview.png)

[Demo](https://dy.github.io/bitmap-sdf/)

## Usage

[![npm install bitmap-sdf](https://nodei.co/npm/bitmap-sdf.png?mini=true)](https://npmjs.org/package/bitmap-sdf/)

```js
const calcSdf = require('bitmap-sdf')

//draw image
const canvas = document.body.appendChild(document.createElement('canvas'))
const w = canvas.width = 200, h = canvas.height = 200
const ctx = canvas.getContext('2d')
ctx.fillStyle = 'white'
ctx.font = 'bold 30px sans-serif'
ctx.fillText('X', 20, 20)

//calculate distances
const distArr = calcSdf(canvas)

//show distances
const imgArr = new Uint8ClampedArray(w*h*4)
for (let i = 0; i < w; i++) {
	for (let j = 0; j < h; j++) {
		imgArr[j*w*4 + i*4 + 0] = distArr[j*w+i]*255
		imgArr[j*w*4 + i*4 + 1] = distArr[j*w+i]*255
		imgArr[j*w*4 + i*4 + 2] = distArr[j*w+i]*255
		imgArr[j*w*4 + i*4 + 3] = 255
	}
}
const data = new ImageData(imgArr, w, h)
ctx.putImageData(data, 0, 0)
```

### dist = calcSdf(source, options?)

Calculate distance field for the input `source` data, based on `options`. Returns 1-channel array with distance values from `0..1` range.

#### Source:

Type | Meaning
---|---
_Canvas_, _Context2D_ | Calculates sdf for the full canvas image data based on `options.channel`, by default `0`, ie. red channel.
_ImageData_ | Calculates sdf for the image data based on `options.channel`
_Uint8ClampedArray_, _Uint8Array_ | Handles raw pixel data, requires `options.width` and `options.height`. Stride is detected from `width` and `height`.
_Float32Array_, _Array_ | Handles raw numbers from `0..1` range, requires `options.width` and `options.height`. Stride is detected from `width` and `height`.

#### Options:

Property | Default | Meaning
---|---|---
`cutoff` | `0.25` | Cutoff parameter, balance between SDF inside `1` and outside `0` of glyph
`radius` | `10` | Max length of SDF, ie. the size of SDF around the `cutoff`
`width` | `canvas.width` | Width of input data, if array
`height` | `canvas.height` | Height of input data, if array
`channel` | `0` | Channel number, `0` is red, `1` is green, `2` is blue, `3` is alpha.
`stride` | `null` | Explicitly indicate number of channels per pixel. Not needed if `height` and `width` are provided.

## See also

* [font-atlas-sdf](https://github.com/hughsk/font-atlas-sdf) − generate sdf atlas for a font.
* [tiny-sdf](https://github.com/mapbox/tiny-sdf) − fast glyph signed distance field generation.
* [optical-properties](https://github.com/dfcreative/optical-properties) − glyph optical center and bounding box calculation

## Alternatives

* [disttransform.wat](https://github.com/LingDong-/wasm-fun/blob/master/wat/disttransform.wat)

## License

(c) 2017 Dima Yv. MIT License

Development supported by plot.ly.
