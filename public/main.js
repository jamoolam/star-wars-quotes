const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
    //The easiest way to trigger a PUT request in modern browsers is to use the Fetch API.
    fetch('/quotes', {
        method: 'put',
        //We need to tell the server we’re sending JSON data by setting the Content-Type headers to application/json.
        headers: { 'Content-Type': 'application/json' },
        //Next, we need to convert the data we send into JSON. We can do this with JSON.stringify. This data is passed via the body property.
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.',
        }),
    })
    .then(res => {
        if (res.ok) return res.json()
      })
      .then(response => {
        window.location.reload(true)
      })
})

deleteButton.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Darth Vader'
    })
  })
  .then(res => {
    if(res.ok) return res.json()
  })
  .then(response => {
    if(response === 'No quote to delete') {
        messageDiv.textContent = 'No Darth Vader quote to delete'
    } else {
        window.location.reload()
    }
  })
})