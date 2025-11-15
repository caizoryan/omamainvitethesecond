let count = 0
let input = document.querySelector('input')
let going = document.querySelector('#going')
let not = document.querySelector('#not')
let glyph = ""
// add something for glyphs

let url = "https://caizoryan--ed10220ac27611f0b74142dde27851f2.web.val.run"

let images
fetch("https://api.are.na/v2/channels/amazing-vectors?per=100")
	.then(res => res.json())
	.then(res => {
		images = res.contents
			.map(e => { if (e.class = "Image") return e.image.display.url })
			.filter(e => e != undefined)
		initimages(images)
	})

let initimages = (images) => images.forEach((img) => {
	let container = document.createElement("div")
	container.classList.add("image-box")
	let image = document.createElement("img")
	image.src = img

	container.onclick = () => {
		document.querySelectorAll('.image-box').forEach(el => {
			el.setAttribute("activated", "false")
		})
		container.setAttribute("activated", "true")
		glyph = img
	}
	container.appendChild(image)
	document.querySelector(".images").appendChild(container)
})
going.onclick = () => {
	count++
	if (count > 5) return
	if (input.value == "") return

	going.setAttribute("activated", "true")
	not.setAttribute("activated", "false")
	fetch(url + "person/" + input.value.trim(), {
		method: "POST",
		body: JSON.stringify({ going: "yes", glyph }),
		headers: {"Content-type": "application/json"}
	}).then((res) => {getlist()})

}
not.onclick = () => {
	count++
	if (count > 5) return
	if (input.value == "") return
	not.setAttribute("activated", "true")
	going.setAttribute("activated", "false")

	fetch(url + "person/" + input.value.trim(), {
		method: "POST",
		body: JSON.stringify({ going: "no", glyph }),
		headers: {"Content-type": "application/json"}
	}).then((res) => {getlist()})
}

let updatefns = []

let getlist = () => {
	fetch(url + "list")
		.then(res => res.json())
		.then(res => {
			console.log(res)
			let elems = res
					.people
				.filter(e => e.going.trim() == "yes")
				.map(e => {
					let size = 250
					let img = e.glyph
					let container = document.createElement("div")
					container.classList.add("floating")
					container.id = e.id
					let x = Math.random() * (window.innerWidth-size)
					let y = Math.random() * (window.innerHeight-size)

					let dirx = (Math.random() * 2) - 1
					let diry = (Math.random() * 2) - 1

					let speed = 2 

					updatefns.push(() => {
						x += dirx * speed
						y += diry * speed

						if (x + size > window.innerWidth) dirx *= -1
						if (y + size > window.innerHeight) diry *= -1
						if (x < 0) dirx *= -1
						if (y < 0) diry *= -1

						container.style = `
							top: ${y}px;
							left: ${x}px;
						`
					})

					let name = document.createElement("p")
					name.innerText = e.id
					container.appendChild(name)

					let image = document.createElement("img")
					image.src = img
					container.appendChild(image)

					let going = document.createElement("p")
					going.innerText = "IS GOING!"
					container.appendChild(going)

					document.body.appendChild(container)
				})
		})
}
let start
function step(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;
	updatefns.forEach(fn => fn())
	requestAnimationFrame(step);
}
requestAnimationFrame(step);
document.querySelector('#close').onclick = () => {
	document.querySelector(".invite").remove()
}

console.log("ITS NOT CLOCKING TO YOU IS IT?")
console.log("THAT IM STANDING ON BIZZNESS")
