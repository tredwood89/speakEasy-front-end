class App {
  constructor(){

    this.book_list = document.getElementById('book-list');
    this.book_show = document.getElementById('book_show')
    this.authorForm =  document.getElementsByName("books_form")[0]
    this.authorButton = document.getElementsByName("author_form")[0]
    this.authorList = document.getElementById('authorList')
  }

    fetchBooks(){
      fetch(`http://localhost:3000/api/v1/books`)
      .then((res)=> res.json())
      .then((json)=>this.listAllBooks(json))
    }

    listAllBooks(books){
      books.forEach((book)=>{
        let li = document.createElement('li');

        li.innerText = book.title

        this.book_list.appendChild(li)
        li.addEventListener('click', (event)=>{
          this.book_show.innerText = ""
          this.showBookListener(book,event)
        })
      })
    }
    showBookListener(bookObj,event){
      console.log(event);
      let p = document.createElement('p');
      p.innerText = `Title:  ${bookObj.title}`
      p.setAttribute("class","bookP")
      p.setAttribute("class","bookfo")
      this.book_show.append(p);
      this.findBookAuthor(bookObj)
    }

    findBookAuthor(bookObj){
      let author_id = bookObj.author_id
      fetch(`http://localhost:3000/api/v1/authors/${author_id}`)
        .then((res)=>res.json())
        .then((json)=>this.showBookAuthor(json))
    }

    showBookAuthor(authorObj){
      let p = document.createElement('p')
      p.innerText =`Author:  ${authorObj.name}`
      p.setAttribute("class","bookfo")
      this.book_show.appendChild(p)

      // let img = document.createElement('img')
      // img.src = authorObj.url
      // this.book_show.appendChild(img)
    }

    fetchAuthorList(){
      fetch("http://localhost:3000/api/v1/authors")
      .then(res => res.json())
      .then(json => this.showsAuthorList(json))
    }

    showsAuthorList(json){
      for(let i = 0; i<json.length; i++){
        this.authorList.innerHTML +=`<option value=${json[i].id}>${json[i].name}</option>`
      }
    }

    selectAuthor(){
      this.authorForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        let li = document.createElement('li')
        li.innerText = event.target[0].value
        this.book_list.appendChild(li)

        let title = event.target[0].value
        console.log(title);
        let genre = event.target[1].value
        let author_id = event.target[2].value

        let options = {
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
             Accept: "application/json"
          },
          body: JSON.stringify({
            	"book":{
            		"title":`${title}`,
            		"genre":`${genre}`,
            		"author_id": `${author_id}`
            	}
            })
        }
        fetch('http://localhost:3000/api/v1/books',options)
        .then((res)=>res.json())
        .then((json)=>console.log(json))
      })
    }

    createAuthor(){
      this.authorButton.addEventListener('submit', (event)=>{
        event.preventDefault();
        let name = event.target[0].value
        let url = event.target[1].value

        let options = {
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
             Accept: "application/json"
          },
          body:JSON.stringify({
              "author":{
                "name":`${name}`,
                "url":`${url}`
              }
            })
          }
        fetch('http://localhost:3000/api/v1/authors',options)
         .then((res)=>res.json())
         .then((json)=>this.authorList.innerHTML +=`<option value=${json.id}>${json.name}</option>`);
      })
    }



}
