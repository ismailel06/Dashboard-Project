const bodyelement = document.querySelector("body")
const toggle = document.getElementById("toggle")
const toggleicon = document.querySelector(".fa-moon")
const appendsidebar = document.getElementById("sidebar-icon")
const sidebar = document.getElementById("sidebar-wrapper")
const wrapper = document.getElementById("wrapper")


toggle.addEventListener("change",function(){
    if(toggle.checked){
        bodyelement.style.backgroundColor = "#0c0e16"
        toggleicon.style.color = "white"
        bodyelement.style.color = "white"
    }else{
        bodyelement.style.backgroundColor = "white"
        toggleicon.style.color = "#1b5a84"
        bodyelement.style.color = "black"
    }
})

appendsidebar.addEventListener("click" ,()=>{
    wrapper.classList.toggle("toggled");
})


let books = JSON.parse(localStorage.getItem('book')) ||
[
    { id: 1, title: "The Little Prince" ,authorId: 1 , genre: "Philosophy" , total: 5 , available: 2},
    { id: 2, title: "1984" ,authorId: 2 , genre: "Sci-fi" , total: 10 , available: 5},
    { id: 3, title: "The Miserables" ,authorId: 3 , genre: "History" , total: 7 , available: 4},
    { id: 4, title: "The Gambler" ,authorId: 4 , genre: "Literature" , total: 16 , available: 11}
];

let authors = JSON.parse(localStorage.getItem('authors')) ||
[
    { id: 1, name: "Antoine de Saint-Exupery"},
    { id: 2, name: "George Orwell"},
    { id: 3, name: "Victor Hugo"},
    { id: 4, name: "fydor dostoiveski"}
];

let myChart;

function saveTolocalStorage(){
    localStorage.setItem('books',JSON.stringify(books))
    localStorage.setItem('authors',JSON.stringify(authors))
}

function generateId(data){
    if(data.length === 0) return 1;
    return Math.max(...data.map(item => item.id)) + 1;
}

function getAuthorName(authorId){
    const author = authors.find(a => a.id === authorId)
    return author ? author.name : "Unknown";
}

document.querySelectorAll('[data-view]').forEach(link =>{
    link.addEventListener("click",function(e){
        e.preventDefault();
        const targetView = this.getAttribute('data-view');
        switchView(targetView);
    })
})


function switchView(viewId){
    document.querySelectorAll('.spa-view').forEach(view =>{
        view.classList.add('hidden')
    })

    const target = document.getElementById(viewId);
    if(target){
        target.classList.remove('hidden');
    }

    document.querySelectorAll('[data-view]').forEach(link => {
        link.classList.remove('active');
    })

    document.querySelector(`[data-view="${viewId}"]`).classList.add('active');

    if(viewId === 'dashboard-view'){
        renderDashboard();
    }else if(viewId === 'books-view'){
        populateAuthorsSelect('book-author')
        renderBooks();
    }else if(viewId === 'authors-view'){
        renderAuthors();
    }
}

document.getElementById('add-author-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('author-name')
    const name = nameInput.value.trim();

    if(name){
        console.log(name);
        const newAuthor = {
            id: generateId(authors),
            name: name
        }
        authors.push(newAuthor);
        saveTolocalStorage();
        renderAuthors();
        populateAuthorsSelect('book-author');
        nameInput.value = '';
    }
});

function deleteAuthor(id){
    if(confirm("Do you really want to remove this Author ? Associated Books will be marked as 'Unknown Author' .")){
        books.forEach(book =>{
            if(book.authorId === id){
                book.authorId = null;
            }
        });

        authors = authors.filter(a => a.id !== id)
        saveTolocalStorage();
        renderAuthors();
        renderBooks();
        populateAuthorsSelect('book-author');
    }
}


function renderAuthors(){
    const listElement = document.getElementById('authors-list');

    listElement.innerHTML = '';
    if(authors.length === 0){
        listElement.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Empty list .</td></tr>'
        return
    }

    authors.forEach(a =>{
        const bookCount = books.filter(b => b.authorId === authors.id).length;
        const row = `
            <tr>
                <td>${a.name}</td>
                <td>${bookCount}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteAuthor(${a.id})" >
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        ` ;
        listElement.innerHTML += row;
    })
}

function populateAuthorsSelect(selectId, selectedId = null){
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">Choose an Author ...</option>'
    authors.forEach(a => {
        const selectedAttr = a.id === selectedId ? 'selected' : '';
        selectElement.innerHTML += `<option value="${a.id}" ${selectedAttr}>${a.name}</option>`;
    });
}

function prepareBookModal(mode,bookId = null){
    const modalTitle = document.getElementById('bookModalLabel');
    const form = document.getElementById('book-form');
    const bookIdInput = document.getElementById('book-id');

    form.reset();
    bookIdInput.value = '';

    populateAuthorsSelect('book-author');

    if(mode === 'add'){
        modalTitle.textContent = 'Add new book';
    }else if(mode ==='edit' && livreId){
        modalTitle.textContent = 'Edit existing Book'
        const book = books.find(b => b.id === bookId);
        if(book){
            bookIdInput.value = book.id;
            document.getElementById('book-title').value = book.title;
            document.getElementById('book-genre').value = book.genre;
            document.getElementById('book-total').value = book.total;
            document.getElementById('book-available').value = book.available;

            populateAuthorsSelect('book-author',book.authorId);
        }
    }
}
