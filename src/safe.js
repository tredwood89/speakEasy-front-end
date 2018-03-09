const code = [38, 38]
const background_url = "https://cdn.vox-cdn.com/thumbor/8y7aLb3NWf_LYywCg91iLUwPMQk=/0x0:2400x1590/1200x800/filters:focal(1008x603:1392x987)/cdn.vox-cdn.com/uploads/chorus_image/image/57764707/Tap_Room_1_High_Res.0.jpg"
//[38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
function init() {
let index = 0;

document.body.addEventListener('keydown',function (e){
  console.log(e.which)
    const key = parseInt(e.which)
    if (key === code[index]){
      index++;
      if (index === code.length){
        // alert("Hurray");
        console.log("cleared doc")
        document.body.innerHTML = ""
        document.body.style.backgroundImage = `url("https://cdn.vox-cdn.com/thumbor/8y7aLb3NWf_LYywCg91iLUwPMQk=/0x0:2400x1590/1200x800/filters:focal(1008x603:1392x987)/cdn.vox-cdn.com/uploads/chorus_image/image/57764707/Tap_Room_1_High_Res.0.jpg")`
        renderDom()
        index = 0;
      }
    } else {
      index = 0;
    }
  })
}

function renderDom(){
  a = document.body
  a.innerHTML = `
  <div id="title">
      <h1><marquee> SPEAK 🙊 EASY</marquee></h1>


  </div>`
  safeLoad();
}

function safeLoad(){
  fetch("https://morning-shore-28838.herokuapp.com/api/v1/comments")
  .then(res => res.json())
  .then(json => {
    let sortedComments = sortByDate(json)
    showComments(sortedComments)
  })
}

function sortByDate(commentList){
  console.log(commentList);
  let sorted =  commentList.sort(function(a,b){
     return b.id - a.id
  })

  return sorted
}

function showComments(list){
  let body = document.body
  let masterComments = document.createElement("div")
  masterComments.setAttribute("id","MasterComment")
  masterComments.style = "overflow-y:scroll; height:525px; background:#c85c5773; "
  body.appendChild(masterComments)
  console.log(masterComments)
  for(let i = 0; i <list.length; i++){
    masterComments.innerHTML +=
  `  <ul class="comment-lister" style="border:thick">
      <ul style="color:#f9f9f9">
        <h3>${list[i].content}</h3>
        <p>posted on: ${new Date(list[i].created_at)}</p>
        <img src="https://media1.tenor.com/images/0f460ba06671ee7c84c548e48c4db28f/tenor.gif?itemid=8518397" style="visibility: hidden;">
        <p id = "li" name="likeScore"> ❤️${list[i].like}</p>
        <button class="likes"  data-id="${list[i].id}" type="button">Like</button>
      </ul>
    </ul>`
  }
    body.innerHTML +=
      `<br><br><form  id="usrform" method="POST">
        <textarea rows="8" cols="75" name="comment" form="usrform">
        First rule about SpeakEasy is you dont speak about SpeakEasy...</textarea>
        <input type="submit">
        </form>`
        commentEventListener()
  buttonLister()
}

  function buttonLister(){
    let buttons = document.getElementsByClassName("likes")
    for(let i =0; i<buttons.length; i++){
      buttons[i].addEventListener('click', (event)=> {
          /// alert some info about the comment the content and number of likes


      let commentId = buttons[i].dataset.id
      /// I need to figure out which comment is whichn
      let options = {
        method: "PATCH",
        headers: {
          "Content-Type":"application/json",
          Accept: "application/json"
        }
      }

      /*
      Types of Patch I might build
      1. PATCH /comments { content: "Edited Comment", ....}
      2. PATCH /comments {}
      */

      /// Why not update the page then send the fetch
      /// if optimistically rendering you must first update the page
      /// then fetch
      //// then verify that what's on the page is the same as the return of the fetch

      fetch(`https://morning-shore-28838.herokuapp.com/api/v1/comments/${commentId}`, options)
        .then((res) => res.json())
        .then((json) => {
          console.log(json)

            updatePage(json, buttons[i])


          /// updatePage

          // the updated number of likes
        })

          // alert()
      buttons[i].parentNode.children[2].style.visibility = "visible"
      //document.getElementsByTagName(img)
      buttons[i].previousElementSibling.innerHTML++

      })
     }
    }

    // buttonLister(list[i])
    // console.log(s)
    // }
    // let buttons = document.getElementsByTagName("button")
    //
    // for(let j = 0; j < buttons.length; j++){
    //   console.log(buttons[j])
    // buttons[j].addEventListener("click", event =>{
    //   let like = document.getElementById("likes")
    //   let addLike = parseInt(like.innerText)
    //   addLike += 1
    // })
    // }

    function updatePage(data, button) {
      button.previousElementSibling.innerHTML = data.like
    }
          // optimistically render comment to screen
    function commentEventListener(){
      let commentForm = document.getElementById('usrform')
      commentForm.addEventListener('submit', (event)=>{
        event.preventDefault()
        let commentSubmission = event.target[0].value;
        let commentBody = document.getElementById("MasterComment")
        let newComment = document.createElement("ul")
        newComment.innerHTML +=
        `  <ul class="comment-lister">
            <ul style="color:#f9f9f9">
              <h3>${commentSubmission}</h3>
              <p>${new Date()}</p>
              <img src="https://media1.tenor.com/images/0f460ba06671ee7c84c548e48c4db28f/tenor.gif?itemid=8518397" style="visibility: hidden;">
              <p name="likeScore"> Likes: 0 </p>
              <button class="likes"  type="button">Like</button>
            </ul>
          </ul>`
          commentBody.insertBefore(newComment, commentBody.childNodes[0])
        let options = {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
            Accept:"application/json"
          },
          body:JSON.stringify({content:commentSubmission})
        }
        fetch('https://morning-shore-28838.herokuapp.com/api/v1/comments',options)
          .then((res)=>res.json())
          .then((json)=>console.log(json))
        })
      }

      // function renderToCommentList(comment){
      //   let commentBody = document.getElementById("MasterComment")
      //   commentBody.innerHTML+=
      //   `  <div class="comment-lister">
      //       <div style="color:#f9f9f9">
      //         <p>${comment.content}</p>
      //         <p>${comment.created_at}</p>
      //         <img src="https://media1.tenor.com/images/0f460ba06671ee7c84c548e48c4db28f/tenor.gif?itemid=8518397" style="visibility: hidden;">
      //         <p name="likeScore">${comment.like}</p>
      //         <button class="likes"  data-id="${comment.id}" type="button">Like</button>
      //       </div>
      //     </div>`
      // }
