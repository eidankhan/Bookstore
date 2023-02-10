let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 29.99,
        quantity: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 100,
        quantity: 15
    },
    {
        id: 3,
        title: "Moby-Dick",
        author: "Herman Melville",
        price: 25,
        quantity: 7
    },
];

let selectedBookId = 0;
let sellBookId = 1;

$(document).ready(function () {
    console.info("JQuery plugin loaded successfully for index.html");
    $('#bookModal').modal('hide');
    $('#sellBookModal').modal('hide');
    generate_table();
});

function generate_table() {
    console.info("Generating table...");
    // Empty table 
    $('#books_table_body').html('');
    var tr
    for (var i = 0; i < books.length; i++) {
        tr = $('<tr>');
        tr.append("<td>" + books[i].id + "</td>");
        tr.append("<td>" + books[i].title + "</td>");
        tr.append("<td>" + books[i].author + "</td>");
        tr.append("<td>" + books[i].price + "</td>");
        tr.append("<td>" + books[i].quantity + "</td>");
        tr.append('<td>' +
            '<div class="d-flex">' +
            '<button type="button" class="btn btn-primary m-1" onClick="showUpdateBookModalForm(' + books[i].id + ')"> Update</button>' +
            '<button type="button" class="btn btn-danger m-1" onClick="deleteBookByID(' + books[i].id + ')">Delete</button>' +
            '</div>' +
            '</td>');
        tr.append("</tr>");
        $('#books_table_body').append(tr);
    }
}

function showAddBookModal() {
    console.log('Adding book to store');
    $('#bookModalTitle').text('Add New Book');
    $('#saveOrUpdateButtonTitle').text('Save');
    $('#bookModal').modal('show');
}

function showSellBookForm() {
    console.info('Launching sell book form');
    populateBooksDropdown();
    $('#sellBookModal').modal('show');
}

function sellBook(id, quantity, books) {
    
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id && books[i].quantity >= quantity) {
            books[i].quantity -= quantity;
            return {
                id: books[i].id,
                title: books[i].title,
                author: books[i].author,
                price: books[i].price,
                quantity: quantity,
                totalPrice: books[i].price * quantity
            };
        }
    }
    return null;
}

function exportInvoice(invoice) {
    $('#invoiceModalTitle').text('Invoice Details');
    $('#invoiceId').text("ID: " + invoice.id);
    $('#invoiceTitle').text("Title: " + invoice.title);
    $('#invoiceAuthor').text("Author: " + invoice.author);
    $('#invoiceQuantity').text("Quantity: " + invoice.quantity);
    $('#invoiceTotalPrice').text("Total Price: $: " + invoice.totalPrice.toFixed(2));
    $('#invoiceModal').modal('show');
}

function sellBookAndExportInvoice() {
    let personsAvailableBalance = 1000;
    let sellBookQuantity = $('#sellBookQuantity').val();
    let bookDetails = findBookById(parseInt(sellBookId));
    if(personsAvailableBalance < sellBookQuantity*bookDetails.price)
    {
        $('#sellBookQuantity').val('');
        $('#sellBookModal').modal('hide');
        $('#invoiceModalTitle').text('Insufficient Balance');
        $('#invoiceId').text("You don't have enough money to buy this book");
        $('#invoiceModal').modal('show');
        return;
    }
    let invoice = sellBook(parseInt(sellBookId), sellBookQuantity, books);
    if (invoice) {
        $('#sellBookQuantity').val('');
        generate_table();
        $('#sellBookModal').modal('hide');
        exportInvoice(invoice);
    } else {
        $('#sellBookQuantity').val('');
        $('#sellBookModal').modal('hide');
        $('#invoiceModalTitle').text('Book Out of Stock');
        $('#invoiceId').text("Book with ID " + sellBookId + " is out of stock");
        $('#invoiceModal').modal('show');
    }
}

function populateBooksDropdown() {
    $("#booksDropdown").html('');
    let select = $("<select class='form-select'></select>");
    for (let i = 0; i < books.length; i++) {
        let book = $("<option></option>")
            .attr("value", books[i].id)
            .text(books[i].title);
        select.append(book);
    }
    $("#booksDropdown").append(select);
    select.change(function () {
        sellBookId = $(this).val();
    });
}

function showUpdateBookModalForm(bookId) {
    selectedBookId = bookId;
    var book = findBookById(selectedBookId);
    console.log('Book By Id = ', bookId, ' => ', book);
    //Setting data in book modal form
    $('#title').val(book.title);
    $('#author').val(book.author);
    $('#price').val(book.price);
    $('#quantity').val(book.quantity);

    $('#bookModalTitle').text('Update Book Details');
    $('#saveOrUpdateButtonTitle').text('Update');
    $('#bookModal').modal('show');
}

function findBookById(bookId) {
    //var bookId1 = parseInt(bookId);
    console.log('Find BookById called');
    for (let i = 0; i < books.length; i++) {
        console.log(books[i].id, '===', bookId, ' ? ', books[i].id === bookId);
        if (books[i].id === bookId) {
            console.log("Book By Id: " + bookId + " found");
            return books[i];
        }
    }
    return null;
}

function saveOrUpdateBook() {
    // Create a new book object
    var bookId = selectedBookId;
    console.log('Book ID: ' + bookId);
    var book = {
        id: sizeOfBookStore() + 1,
        title: $('#title').val(),
        author: $('#author').val(),
        price: $('#price').val(),
        quantity: $('#quantity').val()
    }
    if (bookId > 0) {
        book.id = bookId;
        updateBookById(bookId, book);
    }
    else {
        console.log('Adding book to book store');
        books.push(book);
    }
    generate_table();
    $('#bookModal').modal('hide');
    resetFormData();
}

function updateBookById(bookId, updatedBook) {
    //var bookId1 = parseInt(bookId);
    console.log('Find BookById called');
    for (let i = 0; i < books.length; i++) {
        console.log(books[i].id, '===', bookId, ' ? ', books[i].id === bookId);
        if (books[i].id === bookId) {
            books[i] = updatedBook;
            return books[i];
        }
    }
    return null;
}

function deleteBookByID(bookId) {
    var book = findBookById(bookId);
    books.pop(book);
    generate_table();
    resetFormData();
}

function sizeOfBookStore() {
    return books.length;
}

function resetFormData() {
    $('#title').val('');
    $('#author').val('');
    $('#price').val('');
    $('#quantity').val('');
}