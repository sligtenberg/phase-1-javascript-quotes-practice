document.addEventListener('DOMContentLoaded', () => {
    populate();
    document.getElementById('new-quote-form').addEventListener('submit', (event) => addQuote(event))
})

function populate () {
    fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then((quotesObj) => {
        for (let quoteObj of quotesObj) {
            buildQuoteHTMLElement (quoteObj)
        }
    })
    fetch('http://localhost:3000/likes')
    .then(res => res.json())
    .then((likesObj) => {
        for (let like of likesObj) {
            addLikeHTMLElement(like.quoteId)
        }
    })
}

function buildQuoteHTMLElement (quoteObj) {
    const newQuote = document.createElement('li')
    newQuote.className = 'quote-card'
    newQuote.id = quoteObj.id
    newQuote.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${quoteObj.quote}</p>
            <footer class="blockquote-footer">${quoteObj.author}</footer>
            <br>
            <button id='like-button' class='btn-success'>Likes: <span>0</span></button>
            <button id='delete-button' class='btn-danger'>Delete</button>
        </blockquote>
    `
    newQuote.children[0].children[3].addEventListener('click', () => {
        addLike(quoteObj.id)
    })
    newQuote.children[0].children[4].addEventListener('click', () => {
        newQuote.remove()
        deleteQuote(quoteObj.id)
        deleteAssociatedLikes(quoteObj.id);
    })
    document.getElementById('quote-list').appendChild(newQuote)
}

function addLikeHTMLElement (quoteId) {
    document.getElementById(quoteId).children[0].children[3].children[0].textContent++ // updates the HTML
}

function addLike (quoteId) {
    addLikeHTMLElement (quoteId) // increase the HTML element
    const newLikeObj = {
        quoteId: quoteId,
        createdAt: Date.now()
    }
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLikeObj)
    })

}

function addQuote (event) {
    event.preventDefault()
    const newQuoteObj = {
        quote: event.target[0].value, // this is the quote entered in the form
        author: event.target[1].value, // this is the author entered into the form
    }
    // add it to the HTML
    buildQuoteHTMLElement (newQuoteObj)
    // send it to the database too
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuoteObj)
    })
}

function deleteQuote (id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

function deleteAssociatedLikes (quoteId) {
    fetch('http://localhost:3000/likes/')
    .then(res => res.json())
    .then((likes) => {
        for (let like of likes) {
            if (like.id === quoteId) {
                fetch(`http://localhost:3000/likes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        }
    })
}