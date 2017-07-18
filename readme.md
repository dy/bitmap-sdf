# calc-sdf [![experimental](https://img.shields.io/badge/stability-experimental-red.svg)](http://github.com/badges/stability-badges)

Calculate signed distance field. Fork of [tiny-sdf](https://github.com/mourner/tiny-sdf) with reduced API.

## Usage

[![npm install calc-sdf](https://nodei.co/npm/calc-sdf.png?mini=true)](https://npmjs.org/package/calc-sdf/)

```js
let calcSdf = requrie('calc-sdf')

let arr = calcSdf(canvas)
```

### data = calcSdf(source, options?)

Get signed distance field array for the input `source` data, based on `options`. Returns _Float32Array_ with 1-channel distance values within `0..1` range.

Source:

Type | Meaning
---|---
_Canvas_, _Context2D_ | Reads full canvas image data, calculates distance for `options.channel`, by default `0`, ie. red channel.
_ImageData_ | Calculates distance for the image data based on `options.channel`
_Uint8ClampedArray_, _Uint8Array_ | Handles raw pixel data, requires `options.width` and `options.height`. Number of channels is detected from `width` and `height`.
_Float32Array_, _Array_ | Handles raw numbers from `0..1` range, requires `options.width` and `options.height`. Number of channels is detected from `width` and `height`.

Options:

Property | Default | Meaning
---|---|---
`cutoff` | `0.25` | Cutoff parameter, balance between SDF inside `1` and outside `0` of glyph
`radius` | `10` | Max length of SDF, ie. the size of SDF around the `cutoff`
`width` | `canvas.width` | Width of input data, if array
`height` | `canvas.height` | Height of input data, if array
`channel` | `0` | Channel number, `0` is red, `1` is green, `2` is blue, `3` is alpha.
`channels` | `null` | Explicitly indicate number of channels per pixel, ie. stride. Not needed if `height` and `width` are provided.

## License

(c) 2017 Dima Yv. MIT License

Development supported by plot.ly.
