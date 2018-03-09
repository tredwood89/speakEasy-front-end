document.addEventListener("DOMContentLoaded", function() {
  console.log("hello")
  let app = new App()
  app.fetchBooks()
  app.fetchAuthorList()
  app.selectAuthor()
  app.createAuthor()
  init()
});
