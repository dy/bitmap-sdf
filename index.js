'use strict'

module.exports = calcSDF

var INF = 1e20

function calcSDF(src, options) {
    if (!options) options = {}

    var cutoff = options.cutoff == null ? 0.25 : options.cutoff
    var radius = options.radius == null ? 8 : options.radius
    var channel = options.channel || 0
    var w, h, size, data, intData, stride, ctx, canvas, imgData, i, l

    // handle image container
    if (ArrayBuffer.isView(src) || Array.isArray(src)) {
        if (!options.width || !options.height) throw Error('For raw data width and height should be provided by options')
        w = options.width, h = options.height
        data = src

        if (!options.stride) stride = Math.floor(src.length / w / h)
        else stride = options.stride
    }
    else {
        if (window.HTMLCanvasElement && src instanceof window.HTMLCanvasElement) {
            canvas = src
            ctx = canvas.getContext('2d')
            w = canvas.width, h = canvas.height
            imgData = ctx.getImageData(0, 0, w, h)
            data = imgData.data
            stride = 4
        }
        else if (window.CanvasRenderingContext2D && src instanceof window.CanvasRenderingContext2D) {
            canvas = src.canvas
            ctx = src
            w = canvas.width, h = canvas.height
            imgData = ctx.getImageData(0, 0, w, h)
            data = imgData.data
            stride = 4
        }
        else if (window.ImageData && src instanceof window.ImageData) {
            imgData = src
            w = src.width, h = src.height
            data = imgData.data
            stride = 4
        }
    }

    size = Math.max(w, h)

    //convert int data to floats
    if ((window.Uint8ClampedArray && data instanceof window.Uint8ClampedArray) || (window.Uint8Array && data instanceof window.Uint8Array)) {
        intData = data
        data = Array(w*h)

        for (i = 0, l = Math.floor(intData.length / stride); i < l; i++) {
            data[i] = intData[i*stride + channel] / 255
        }
    }
    else {
        if (stride !== 1) throw Error('Raw data can have only 1 value per pixel')
    }

    // temporary arrays for the distance transform
    var gridOuter = Array(w * h)
    var gridInner = Array(w * h)
    var f = Array(size)
    var d = Array(size)
    var z = Array(size + 1)
    var v = Array(size)

    for (i = 0, l = w * h; i < l; i++) {
        var a = data[i]
        gridOuter[i] = a === 1 ? 0 : a === 0 ? INF : Math.pow(Math.max(0, 0.5 - a), 2)
        gridInner[i] = a === 1 ? INF : a === 0 ? 0 : Math.pow(Math.max(0, a - 0.5), 2)
    }

    edt(gridOuter, w, h, f, d, v, z)
    edt(gridInner, w, h, f, d, v, z)

    var dist = window.Float32Array ? new Float32Array(w * h) : new Array(w * h)

    for (i = 0, l = w*h; i < l; i++) {
        dist[i] = Math.min(Math.max(1 - ( (gridOuter[i] - gridInner[i]) / radius + cutoff), 0), 1)
    }

    return dist
}

// 2D Euclidean distance transform by Felzenszwalb & Huttenlocher https://cs.brown.edu/~pff/dt/
function edt(data, width, height, f, d, v, z) {
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            f[y] = data[y * width + x]
        }
        edt1d(f, d, v, z, height)
        for (y = 0; y < height; y++) {
            data[y * width + x] = d[y]
        }
    }
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            f[x] = data[y * width + x]
        }
        edt1d(f, d, v, z, width)
        for (x = 0; x < width; x++) {
            data[y * width + x] = Math.sqrt(d[x])
        }
    }
}

// 1D squared distance transform
function edt1d(f, d, v, z, n) {
    v[0] = 0;
    z[0] = -INF
    z[1] = +INF

    for (var q = 1, k = 0; q < n; q++) {
        var s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
        while (s <= z[k]) {
            k--
            s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
        }
        k++
        v[k] = q
        z[k] = s
        z[k + 1] = +INF
    }

    for (q = 0, k = 0; q < n; q++) {
        while (z[k + 1] < q) k++
        d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
    }
}
