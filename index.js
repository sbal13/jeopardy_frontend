document.addEventListener('DOMContentLoaded', function(){
	loadScreen()
})

const screen = $('#game-screen')
const board = $('#game-board')
const clueDisplay = $("#clue-display")

function loadScreen(){
	board.html('<h2 id="welcome-message"> Click here to start! </h2>')
	$('#welcome-message').on('click',function() {
		promptUsername()
	})
}


function promptUsername(){
	const userForm = `
			<form id="user-form">
			<input type="text" id="username" placeholder="enter your name">
			</form>
	`
	board.html(userForm)
	$('#user-form').on('submit', function(event){
		event.preventDefault()
		const userName = $('#username').val()
		board.html(`<h2> Welcome ${userName} </h2>`)
		setCategories()
	})
	// setCategories()
	
}



function setCategories(){
	// const mm = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
	// const yy = ["2010", "2011", "2012", "2013", "2014"]

	// const randMonth = mm[Math.floor(Math.random() * mm.length)];
	// const randYear = yy[Math.floor(Math.random() * yy.length)];
	// const url = `http://jservice.io/api/clues?min_date=${randYear}-${randMonth}-08T12:00:00.000Z&max_date=${randYear}-${randMonth}-08T12:00:00.000Z`

	// fetch(url).then(resp => resp.json()).then(json => console.log(json))

	fetch("http://localhost:3000/api/v1/categories")
	.then(res=> res.json())
	.then(res => renderCategories(res))

}

function renderCategories(json){
	const categoryHTML = json.map(object => {

		new Category(object["category"].id, object["category"].title, object["clues"])

		const cluesHTML = object["clues"].map(clue => {

			new Clue(clue.id, clue.question, clue.answer, clue.category_id, clue.value)

			return `
				<div id="clue-${clue.id}" class="clue">
					<h5>${clue.value}</h5>
				</div>
			`
		}).join("")
		return `<div data-category="${object["category"].title}" class="col-md-2">
			<h3>${object["category"].title}</h3>
			<div id="clues" data-cluescat="${object["category"].title}" class="col-md-12">
				
				${cluesHTML}

			</div>
		</div>`
	}).join("")

	console.log(json)

	board.html(categoryHTML)

	board.on("click", "div.clue", function(e) {
		e.stopImmediatePropagation()

		// if (e.target === "clues") {
			
			const targetId = parseInt(this.id.split("-")[1])

			const targetClue = Clue.all().find(clue => clue.id === targetId)
			
			board.hide()

			const responseHTML = `
				<p>${targetClue.question}</p>
				<form id="answer-form">
					<input type="text" id="answer">
				</form>
			`

			clueDisplay.html(responseHTML)

			$('#answer-form').on("submit", function(e){
				e.preventDefault()
				if (targetClue.answer.toLowerCase().includes($('#answer').val().toLowerCase())) {
					alert('Correct!')
				} else {
					alert('Incorrect!')
				}

				targetClue.shown = false


				clueDisplay.html("")
				board.show()
			})
		// }


	// if(board.css("display") === 'block') {
	// 	board.hide()
	// 	console.log("I was when showing!")
	// } else {
	// 	board.show()
	// 	console.log("I was when hiding!")

	// }
})



}

// document.addEventListener("click", function(e) {
// 	console.log("I was clicked!")
// 	if(board.css("display") === 'block') {
// 		board.hide()
// 		console.log("I was when showing!")
// 	} else {
// 		board.show()
// 		console.log("I was when hiding!")

// 	}
// })
