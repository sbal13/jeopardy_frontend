document.addEventListener('DOMContentLoaded', function(){
	loadScreen()
})

const screen = $('#game-screen')
const welcome = $('#welcome')
const board = $('#game-board')
const clueDisplay = $("#clue-display")
const userDisplay = $("#user-display")
var currentUser;

function loadScreen(){
	welcome.html('<h2 id="welcome-message"> Click here to start! </h2>')
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
	welcome.html(userForm)
	$('#user-form').on('submit', function(event){
		event.preventDefault()
		const userName = $('#username').val()
		currentUser = new User(userName)
		welcome.html(`<h2> Welcome ${userName} </h2>`)
		userDisplay.html(`${currentUser.name}: $${currentUser.score}`)
		welcome.html("")
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
				<div id="clue-${clue.id}" class="clue inline-middle">
					<h3 class="text-center">$${clue.value}</h3>
				</div>
			`
		}).join("")



		return `<div class="col-md-2">
			<div class="category"><h4>${object["category"].title.toUpperCase()}</h4></div>
			<div id="clues" class="">
				
				${cluesHTML}

			</div>
		</div>`
	}).join("")

	Clue.makeDD()

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
		




		if (targetClue.dd===true) {
			const ddHTML = `
				<p>You have selected a Daily Double! Please make a wager between $5 and $${maxWager()}</p>
				<form id="wager-form">
					<input type="number" id="wager">
				</form>
			`
			clueDisplay.html(ddHTML)

			$('#wager-form').on("submit", function(e){
				e.preventDefault()
				targetClue.value = parseInt($('#wager').val())
				$('#daily-double').html(`<p>You have wagered: $${targetClue.value}</p>`)
				guess(responseHTML,targetClue)

				// clueDisplay.html(responseHTML)

			})

		} else {
			guess(responseHTML,targetClue)
			// clueDisplay.html(responseHTML)
		}


		



		// $('#answer-form').on("submit", function(e){
		// 	e.preventDefault()

		// 	if (targetClue.answer.toLowerCase().includes($('#answer').val().toLowerCase()) && newTimer.seconds > 0) {
		// 		currentUser.score += targetClue.value
		// 		alert(`Correct! You now have $${currentUser.score}`)
		// 	} else {
		// 		currentUser.score -= targetClue.value
		// 		alert(`Incorrect! The correct answer was ${targetClue.answer}. You are now at $${currentUser.score}`)
		// 	}
		// 	checkEndGame()
		// 	backToGame()

		// 	newTimer.stop()

		// })
		console.log(this)
		targetClue.shown = false 
		this.innerHTML= ""
		
		
	})

}

function guess(responseHTML, targetClue){

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
			checkEndGame()
			backToGame()

			newTimer.stop()

		})
}



function backToGame(){
	userDisplay.html(`${currentUser.name}: $${currentUser.score}`)
	clueDisplay.html("")
	$('#daily-double').html("")
	board.show()

}

function maxWager(){
	if (currentUser.score <= 1000) {
		return 1000
	} else {
		return currentUser.score
	}
}

function checkEndGame() {
	const shownClues = Clue.all().filter(clue => clue.shown)
	if(shownClues.length === 0) {
		if(currentUser.score > 0) {
			alert(`Congrats! You won $${currentUser.score}`)
		} else {
			alert(`Game over! You owe us $${-currentUser.score}`)
		}
		location.reload()
	}

}
