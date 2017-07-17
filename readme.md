# calc-sdf [![experimental](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Calculate signed distance field. Fork of [tiny-sdf](https://github.com/mourner/tiny-sdf) with reduced API.

## Usage

[![npm install calc-sdf](https://nodei.co/npm/calc-sdf.png?mini=true)](https://npmjs.org/package/calc-sdf/)

```js
let calcSdf = requrie('calc-sdf')

let result = calcSdf(data)
```

### data = calcSdf(data, options?)

Get signed distance field array for the input data, based on options. `data` can be a canvas, 2d context, ImageData, Uint8ClampedArray, Uint8Array, Float32Array or ndarray. Returned data has the same format as input data.

Options:

Property | Default | Meaning
---|---|---
`cutoff` | `0.25` | Cutoff parameter, balance between SDF inside `1` and outside `0` of glyph
`radius` | `10` | Max length of SDF, ie. the size of SDF around the `cutoff`
`width` | `canvas.width` | Width of input data, if array
`height` | `canvas.height` | Height of input data, if array
`channel` | `0` | Channel number, if pixel data/canvas

## License

(c) 2017 Dima Yv. MIT License

Development supported by plot.ly.
