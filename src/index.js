document.addEventListener('DOMContentLoaded', () => {
  getNotes();
});

function getNotes() {
  fetch('http://localhost:3000/api/v1/notes')
    .then(response => response.json())
    .then(notesData => {
      notesData.forEach(note => renderIndividualNotes(note))
    })
}

function renderIndividualNotes(note) {
  let ul = document.getElementById('card')

  let li = document.createElement('li')
  let p_title = document.createElement('p')
  let p_body = document.createElement('p')
  let deleteButton = document.createElement('button')

  ul.appendChild(li)
  li.id = `li-${note.id}`
  li.className = `ui card`

  li.appendChild(p_title)
  p_title.id = `title-${note.id}`
  p_title.className = `header`
  p_title.innerText = note.title

  li.appendChild(p_body)
  p_body.id = `body-${note.id}`
  p_body.className = `description`
  p_body.innerText = note.body

  deleteButton.id = `deleteB-${note.id}`
  li.appendChild(deleteButton)
  deleteButton.innerText = `Delete`

  //////// update title after clicking on the 'edit' button/////////
  p_title.addEventListener('click', clickOnTitle)
  //////// update body after clicking on the 'edit' button /////////
  p_body.addEventListener('click', clickOnBody)

  deleteButton.addEventListener('click', function(event){
    event.preventDefault();
    let id = event.currentTarget.id.split('-')[1]
    deleteNote(id)
  })
}

function clickOnTitle(event) {
  event.preventDefault();
  let id = event.currentTarget.id.split('-')[1]
  let li = event.currentTarget.parentNode

  let editForm = document.createElement('form')
  let newTitleTField = document.createElement('input')

  let deleteB = document.querySelector(`#deleteB-${id}`)

  editForm.id = `editForm-${id}`
  newTitleTField.id = `input-${id}`

  let title = document.querySelector(`#title-${id}`)
  let body = document.querySelector(`#body-${id}`)

  li.removeChild(title)
  li.removeChild(body)
  li.removeChild(deleteB)
  li.appendChild(editForm)
  editForm.appendChild(newTitleTField)
  li.appendChild(body)
  li.appendChild(deleteB)


  let entireForm = document.querySelector(`#editForm-${id}`)

  newTitleTField.value = title.innerText

  let bodyText = body.innerText
  let titleText = title.innerText

  entireForm.addEventListener('submit', function(event){
    event.preventDefault();
    let newTitle = document.querySelector(`#input-${id}`).value
    updateTitle(id, newTitle, bodyText)
  })
}

function clickOnBody(event) {
    event.preventDefault();
    let id = event.currentTarget.id.split('-')[1]
    let li = event.currentTarget.parentNode
    let title = document.querySelector(`#title-${id}`)
    let body = document.querySelector(`#body-${id}`)
    let deleteB = document.querySelector(`#deleteB-${id}`)

    let newBody = document.createElement('form')
    let newBodyTextarea = document.createElement('textarea')
    let changeButton = document.createElement('button')

    li.removeChild(deleteB)
    li.removeChild(body)
    li.appendChild(newBody)
    li.appendChild(deleteB)
    newBody.appendChild(newBodyTextarea)
    newBody.appendChild(changeButton)

    newBody.id = `bodyText-${id}`
    newBodyTextarea.id = `textarea-${id}`
    changeButton.id = `updateB-${id}`
    changeButton.innerText = `Update`

    newBodyTextarea.value = body.innerText

    //// eventListener after you click the Update button
    changeButton.addEventListener('click', function(event){
      event.preventDefault();
      let newBodyText = event.currentTarget.parentElement.elements[0].value
      updateBody(id, newBodyText)
    })
}

const newNoteForm = document.querySelector('.actualform');

newNoteForm.addEventListener('submit', function(event){
  event.preventDefault()
  let newTitle = event.currentTarget.querySelector('#titleInput').value
  let newBody = event.currentTarget.querySelector('#textarea').value

  if (newTitle === "" || newBody === "") {
    alert("You forgot something...")
  } else {
    postNewNote(newTitle, newBody)
  }
})

// posts the new note to the database
function postNewNote(title, body) {
  fetch(`http://localhost:3000/api/v1/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      title: title,
      body: body
    })
  })
    .then(response => response.json())
    .then(notesData => {
      newNoteForm.reset();
      window.scrollTo(0, document.body.scrollHeight);
      renderIndividualNotes(notesData)
    })
}

function updateTitle(id, title, body) {
   let formData = {
     title: title,
     body: body
   }
   fetch(`http://localhost:3000/api/v1/notes/${id}`, {
     method: "PATCH",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(formData)
   })
     .then(response => response.json())
     .then(data => {
       let li = document.querySelector(`#li-${id}`)
       let oldForm = document.querySelector(`#editForm-${id}`)
       let oldbody = document.querySelector(`#body-${id}`)
       let deleteButton = document.querySelector(`#deleteB-${id}`)

       let title = document.createElement('p')
       let body = document.createElement('p')
       let delB = document.createElement('button')

       delB.id = `deleteB-${id}`
       delB.innerText = `Delete`

       li.removeChild(oldForm)
       li.removeChild(oldbody)
       li.removeChild(deleteButton)

       li.appendChild(title)
       li.appendChild(body)
       li.appendChild(delB)

       title.id = `title-${id}`
       body.id = `body-${id}`

       title.innerText = data.title
       body.innerText = data.body

       title.addEventListener('click', clickOnTitle)
       renderIndividualNotes()
     })
}

function updateBody(id, body) {
  let formData = {
    body: body
  }
  fetch(`http://localhost:3000/api/v1/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      let bodyForm = document.querySelector(`#bodyText-${id}`)
      let bodyButton = document.querySelector(`#updateB-${id}`)
      let li = document.querySelector(`#li-${id}`)
      let deleteB = document.querySelector(`#deleteB-${id}`)

      let newBody = document.createElement('p')

      newBody.id = `body-${id}`

      let oldTextarea = document.querySelector(`#textarea-${id}`)

      li.removeChild(bodyForm)
      li.removeChild(deleteB)

      let newButton = document.createElement('button')
      newButton.id = `deleteB-${id}`
      newButton.innerText = `Delete`

      li.appendChild(newBody)
      li.appendChild(newButton)

      newBody.innerText = data.body
  
      newBody.addEventListener('click', clickOnBody)
      renderIndividualNotes()
    })
}

function deleteNote(id) {
  fetch(`http://localhost:3000/api/v1/notes/${id}`, {
    method: "DELETE"
  }).then(response => response.json())
   .then(data => {
     let ul = document.querySelector(`#card`)
     let li = document.querySelector(`#li-${id}`)
     ul.removeChild(li)
   })
}
