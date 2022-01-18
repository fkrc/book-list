// Book Class: Kitap hakkında bilgiler barındırır
class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }
  
  // UI Class: UI ile alakalı işleri yapan class
  class UI {
    static displayBooks() {
      const books = Store.getBooks();
  
      books.forEach((book) => UI.addBookToList(book));
    }
  
    static addBookToList(book) {
      const list = document.querySelector('#book-list');
  
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
  
      list.appendChild(row);
    }
  
    static deleteBook(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
      }
    }
  
    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
  
      // 3 snde alertleri kapatma
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
    }
  }
  
  // Store Class: Kitapları sakladığımız class
  class Store {
    static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
  
      return books;
    }
  
    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    static removeBook(isbn) {
      const books = Store.getBooks();
  
      books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }
  }
  
  // Kitapları gösterdiğimiz kısım
  document.addEventListener('DOMContentLoaded', UI.displayBooks);
  
  // Kitap ekleme
  document.querySelector('#book-form').addEventListener('submit', (e) => {
    
    e.preventDefault();
  
    // Form Value toplama
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
  
    // kontrol etme
    if(title === '' || author === '' || isbn === '') {
      UI.showAlert('Lütfen tüm alanları doldurunuz', 'danger');
    } else {
      // Yeni Kitap Oluşturma
      const book = new Book(title, author, isbn);
  
      // UI kısmına bir kitap ekleme
      UI.addBookToList(book);
  
      // Kitabı kaydetme
      Store.addBook(book);
  
      // Kitap eklendi yazısını gösterme
      UI.showAlert('Kitap Eklendi', 'success');
  
      // Eklendikten sonra alanları temizleme
      UI.clearFields();
    }
  });
  
  // Kitap Silme İşlemi
  document.querySelector('#book-list').addEventListener('click', (e) => {
    // UI'dan silme
    UI.deleteBook(e.target);
  
    // Kaydedilen yerden kitabı çıkarma
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
    // Kaldırıldı mesajını gösterme
    UI.showAlert('Kitap Kaldırıldı', 'success');
  });