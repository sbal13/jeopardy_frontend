document.addEventListener('DOMContentLoaded', function(){
	loadScreen()
})

const screen = $('#game-screen')

function loadScreen(){
	screen.html('<h2 id="welcome-message"> Click here to start! </h2>')
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
	screen.html(userForm)
	$('#user-form').on('submit', function(event){
		event.preventDefault()
		const userName = $('#username').val()
		screen.html(`<h2> Welcome ${userName} </h2>`)
		setCategories()
	})
	
}

function setCategories(){
	// const mm = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
	// const yy = ["2010", "2011", "2012", "2013", "2014"]

	// const randMonth = mm[Math.floor(Math.random() * mm.length)];
	// const randYear = yy[Math.floor(Math.random() * yy.length)];
	// const url = `http://jservice.io/api/clues?min_date=${randYear}-${randMonth}-08T12:00:00.000Z&max_date=${randYear}-${randMonth}-08T12:00:00.000Z`

	// fetch(url).then(resp => resp.json()).then(json => console.log(json))

	fetch("http://localhost:3000/api/v1/categories").then()

}