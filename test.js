'use strict'

var calcSDF = require('./')

var canvas = document.body.appendChild(document.createElement('canvas'))

canvas.width = 200
canvas.height = 300

var ctx = canvas.getContext('2d')
ctx.fillStyle = 'black'
ctx.fillRect(0,0,canvas.width, canvas.height)
ctx.fillStyle = 'white'
ctx.font = 'bold 200px sans-serif'
ctx.fillText('X', 100, 100)


var out = document.body.appendChild(document.createElement('canvas'))

out.width = 200
out.height = 300
var outCtx = out.getContext('2d')

outCtx.drawImage(canvas, 0, 0);


var cutoff = 0, radius = 10

update()

function update () {
	console.time('sdf')
	var arr = calcSDF(canvas, cutoff, radius)
	console.timeEnd('sdf')

	let imgArr = new Uint8ClampedArray(200*300*4)
	for (let i = 0; i < 200; i++) {
		for (let j = 0; j < 300; j++) {
			imgArr[j*200*4 + i*4 + 0] = arr[j*200+i]
			imgArr[j*200*4 + i*4 + 1] = arr[j*200+i]
			imgArr[j*200*4 + i*4 + 2] = arr[j*200+i]
			imgArr[j*200*4 + i*4 + 3] = 255
		}
	}

	var data = new ImageData(imgArr, 200, 300)
	outCtx.putImageData(data, 0, 0)
}


var cutoffEl = document.body.appendChild(document.createElement('input'))
cutoffEl.type = 'range'
cutoffEl.min = 0
cutoffEl.max = 1
cutoffEl.step = 0.001
cutoffEl.value = cutoff
cutoffEl.oninput = e => {
	cutoff = parseFloat(cutoffEl.value)
	update()
}


var radEl = document.body.appendChild(document.createElement('input'))
radEl.type = 'range'
radEl.min = 0
radEl.max = 100
radEl.step = 0.2
radEl.value = radius
radEl.oninput = e => {
	radius = parseFloat(radEl.value)
	update()
}
