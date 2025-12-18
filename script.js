const bodyelement = document.querySelector("body")
const toggle = document.getElementById("toggle")
const toggleicon = document.querySelector(".fa-moon")
const appendsidebar = document.getElementById("sidebar-icon")
const sidebar = document.getElementById("sidebar-wrapper")
const wrapper = document.getElementById("wrapper")





let books = JSON.parse(localStorage.getItem('books')) ||
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
        const bookCount = books.filter(b => b.authorId === a.id).length;
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
    }else if(mode === 'edit' && bookId){
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

document.getElementById('book-form').addEventListener('submit',function(e){
    e.preventDefault();

    const Id = document.getElementById('book-id').value;
    const title = document.getElementById('book-title').value;
    const authorId = document.getElementById('book-author').value;
    const genre = document.getElementById('book-genre').value;
    const copies = parseInt(document.getElementById('book-total').value);
    let available = parseInt(document.getElementById('book-available').value);

    if(available > copies){
        alert("The Number of available copies must be less than Total copies");
        return;
    }

    const newBook={
        title,
        authorId,
        genre,
        total: copies,
        available 
    }

    if(id)
    {
        const index = books.findIndex(b => b.id === parseInt(Id));
        if(index !== -1){
            books[index] = {
                ...books[index],
                ...newBook
            }
        }
    }else{
            newBook.Id = generateId(books);
            books.push(newBook);
    }

    saveTolocalStorage();

    const modalElement = document.getElementById('bookModal')
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();

    renderBooks();
    renderDashboard();
});

function deleteBook(id){
    if(confirm("Are you sure you want to delete this book from the list ?")){
        books = books.filter(b => b.id !== id);
        saveTolocalStorage();
        renderBooks();
        renderDashboard();
    }
}

function renderBooks(){
    const listElement = document.getElementById('books-list');
    const searchTerm = document.getElementById('book-search').value.toLowerCase();
    const sortBy = document.getElementById('book-sort').value;

    listElement.innerHTML = '';

    let filterdBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm) ||
        b.genre.toLowerCase().includes(searchTerm) ||
        getAuthorName(b.authorId).toLowerCase().includes(searchTerm)
    );

    filterdBooks.sort((a , b) =>{
        if(sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if(sortBy === 'present-desc') return b.available - a.available;
        if(sortBy === 'total-desc') return b.total - a.total;
        return 0;
    });

    if(filterdBooks.length === 0)
    {
        listElement.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No book matches Search/filter </td></tr>';
        return;
    }

    filterdBooks.forEach(b =>{
        const authorName = getAuthorName(b.authorId);
        const availableClass = b.available === 0 ? 'text-danger fw-bold' : (b.available <= 2 ? 'text-warning' : 'text-success');

        const row = `
            <tr>
                <td>${b.title}</td>
                <td>${authorName}</td>
                <td>${b.genre}</td>
                <td>${b.total}</td>
                <td class="${availableClass}">${b.available}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" data-bs-toggle="modal" data-bs-target="#bookModal" onclick="prepareBookModal('edit' , ${b.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook(${b.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        listElement.innerHTML += row;
    })
}

document.getElementById('book-search').addEventListener("keyup",renderBooks);

function renderDashboard() {
    const totalBooks = books.length;
    const totaAuthors = authors.length;
    const totalCopies = books.reduce((acc, b) => acc + b.total , 0);
    const availableCopies = books.reduce((acc, b) => acc + b.available , 0);
    const emprunt = totalCopies - availableCopies;

    const kpis = [
        { title: "Total Books" , icon: "book" , value: totalBooks , color: "primary" },
        { title: "Emprunted Books" , icon: "arrow-down" , value: emprunt , color: "danger" },
        { title: "Available Copies" , icon: "check" , value: availableCopies , color: "success" },
        { title: "Total Authors" , icon: "users" , value: totaAuthors , color: "info" }
    ]

    const kpiHtml = kpis.map(kpi => 
        `
            <div class="col-md-3">
                <div class="kpi-card text-${kpi.color}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="fs-2">${kpi.value}</h5>
                            <p class="fs-5 mb-0 text-muted">${kpi.title}</p>
                        </div>
                        <i class="fas fa-${kpi.icon} fs-1 text-${kpi.color} opacity-25"></i>
                    </div>
                </div>
            </div>
        `
    ).join('');

    document.getElementById('kpi-row').innerHTML = kpiHtml;

    renderGenreChart();
    fetchOpenLibraryData();
}


function renderGenreChart(){
    const genreCounts = books.reduce((acc,b) => {
        const genre = b.genre.trim() || 'Not Specified';
        acc[genre] = (acc[genre] || 0) + 1;

        return acc;
    }, {});

    const labels = Object.keys(genreCounts);
    const data = Object.values(genreCounts);

    const backgroundColors = labels.map((_,i) => `hsl(${(i*50) % 360} , 70% , 50%)`);
    const ctx = document.getElementById('genreChart').getContext('2d');

    if(myChart)
    {
        myChart.destroy();
    }

    myChart = new Chart (ctx ,{
        type: 'doughnut',
        data:{
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' ,
                },
                title: {
                    display: false ,
                }
            }
        }
    });
}



function fetchOpenLibraryData() {
    const apiResultElement = document.getElementById('api-result');
    const query = 'Programming';
    const url = `https://openlibrary.org/search.json?q=${query}&limit=3`;

    apiResultElement.innerHTML = `<i class=""fas fa-spinner fa-spin me-2></i> Loding OpenLibrary data ...`;

fetch(url)
    .then(response =>{
        if(!response.ok){
            throw new Error(`HTTP Error : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const numFound = data.numFound;
        const Apibooks = data.docs;

        let resultHTML = `<p class="fw-bold text-dark">OpenLibrary API has found <span class="text-primary">${numFound.toLocaleString()}</span> results for "${query}" .</p>`;

        if(Apibooks && Apibooks.length > 0){
            resultHTML += `<p class="mt-2 mb-1">Some results (max 3):</p><ul>`;
            Apibooks.forEach(b =>{
                const title = b.title || 'Unknown Title';
                const author = b.author_name ? b.author_name.join(', ') : 'Unknown Author(s)' ;
                resultHTML += `<li><strong>${title}</strong> by ${author} (${b.first_publish_year || 'N/A'})</li>`;
            });
            resultHTML += `</ul>`;
        }
        apiResultElement.innerHTML = resultHTML;
    })
    .catch(error =>{
        console.error('An error has accured while fetching OpenLibrary data:', error);
        apiResultElement.innerHTML = `<p class="text-danger"><i class="fas fa-exclamation-triangle me-1"></i> Error while API loading: ${error.message}</p>`;
    });
}

window.onload = function() {

    switchView('dashboard-view');  
    renderAuthors();
    
    
};

appendsidebar.addEventListener("click" ,()=>{
    wrapper.classList.toggle("toggled");
})

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

