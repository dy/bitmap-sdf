'use strict'

module.exports = calcSDF;

var INF = 1e20;

function calcSDF(canvas, options) {
    if (!options) options = {}

    var cutoff = options.cutoff == null ? 0.25 : options.cutoff;
    var radius = options.radius == null ? 8 : options.radius;

    var w = canvas.width, h = canvas.height
    var ctx = canvas.getContext('2d')
    var size = Math.max(w, h)

    // temporary arrays for the distance transform
    var gridOuter = Array(w * h);
    var gridInner = Array(w * h);
    var f = Array(size);
    var d = Array(size);
    var z = Array(size + 1);
    var v = Array(size);

    var imgData = ctx.getImageData(0, 0, w, h);
    var alphaChannel = new Uint8ClampedArray(w * h);

    for (var i = 0, l = w*h; i < l; i++) {
        var a = imgData.data[i * 4 + 0] / 255; // alpha value
        gridOuter[i] = a === 1 ? 0 : a === 0 ? INF : Math.pow(Math.max(0, 0.5 - a), 2);
        gridInner[i] = a === 1 ? INF : a === 0 ? 0 : Math.pow(Math.max(0, a - 0.5), 2);
    }

    edt(gridOuter, w, h, f, d, v, z);
    edt(gridInner, w, h, f, d, v, z);

    for (i = 0, l = w*h; i < l; i++) {
        var d = gridOuter[i] - gridInner[i];
        alphaChannel[i] = Math.max(0, Math.min(255, 255 - 255 * (d / radius + cutoff)));
    }

    return alphaChannel;
}

// 2D Euclidean distance transform by Felzenszwalb & Huttenlocher https://cs.brown.edu/~pff/dt/
function edt(data, width, height, f, d, v, z) {
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            f[y] = data[y * width + x];
        }
        edt1d(f, d, v, z, height);
        for (y = 0; y < height; y++) {
            data[y * width + x] = d[y];
        }
    }
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            f[x] = data[y * width + x];
        }
        edt1d(f, d, v, z, width);
        for (x = 0; x < width; x++) {
            data[y * width + x] = Math.sqrt(d[x]);
        }
    }
}

// 1D squared distance transform
function edt1d(f, d, v, z, n) {
    v[0] = 0;
    z[0] = -INF;
    z[1] = +INF;

    for (var q = 1, k = 0; q < n; q++) {
        var s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
        while (s <= z[k]) {
            k--;
            s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
        }
        k++;
        v[k] = q;
        z[k] = s;
        z[k + 1] = +INF;
    }

    for (q = 0, k = 0; q < n; q++) {
        while (z[k + 1] < q) k++;
        d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
    }
}
