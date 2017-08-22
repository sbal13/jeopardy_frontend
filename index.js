document.addEventListener('DOMContentLoaded', function(){
	loadScreen()
})

const screen = $('#game-screen')
const board = $('#game-board')
const clueDisplay = $("#clue-display")
const userDisplay = $("#user-display")
var currentUser;

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
		currentUser = new User(userName)
		board.html(`<h2> Welcome ${userName} </h2>`)
		userDisplay.html(`${currentUser.name}: $${currentUser.score}`)
		setCategories()
	})
}



function setCategories(){
	
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
			
		const targetId = parseInt(this.id.split("-")[1])

		const targetClue = Clue.all().find(clue => clue.id === targetId)
		
		board.hide()

		const responseHTML = `
			<p>${targetClue.question}</p>
			<form id="answer-form">
				<input type="text" id="answer">
			</form>
		`
		var newTimer = new Timer(targetClue)

		clueDisplay.html(responseHTML)

		$('#answer-form').on("submit", function(e){
			e.preventDefault()

			if (targetClue.answer.toLowerCase().includes($('#answer').val().toLowerCase()) && newTimer.seconds > 0) {
				currentUser.score += targetClue.value
				alert(`Correct! You now have $${currentUser.score}`)
			} else {
				currentUser.score -= targetClue.value
				alert(`Incorrect! The correct answer was ${targetClue.answer}. You are now at $${currentUser.score}`)
			}

			backToGame()

			newTimer.stop()

		})
		console.log(this)
		this.innerHTML= ""
		
	})

}



function backToGame(){
	userDisplay.html(`${currentUser.name}: $${currentUser.score}`)
	clueDisplay.html("")
	board.show()
}
