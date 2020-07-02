//===============================================================================================

//server time setup
window.addEventListener("load", (event) => {
  time();
  showMore('hide')
  fetchPost();
  //for deleting post from local storage
  if (localStorage.getItem("post")) {
    localStorage.removeItem("post");
  }
});

//gettime
function time() {
  fetch("/time")
    .then((res) => res.json())
    .then((res) => {
      document.querySelector("#time").textContent = res.time;
    });
}

setInterval(() => {
  time();
}, 1000);

//===============================================================================================
//===============================================================================================
//add button animation
document.querySelector(".writePost").addEventListener("click", () => {
  document.querySelector(".blog-div").classList.toggle("e");
  document.querySelector(".material-icons").classList.toggle("f");
  document.querySelector(".writePost").classList.toggle("g");
  let a = document.querySelector(".material-icons").textContent;
  a == "clear" ? (a = "edit") : (a = "clear");
  document.querySelector(".material-icons").textContent = a;
});

//===============================================================================================
//===============================================================================================
//clear values after post is submitted and making post field hide
function clearValues() {
  document.querySelector("#heading").value = "";
  document.querySelector("#des").value = "";
  document.querySelector("#file").value = "";

  //hiding  post div
  document.querySelector(".blog-div").classList.toggle("e");

  //chage the cross add post button to edit add post button
  let a = document.querySelector(".material-icons").textContent;
  a == "clear" ? (a = "edit") : (a = "clear");
  document.querySelector(".material-icons").textContent = a;

}
//===============================================================================================
//===============================================================================================

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#heading").value;
  const description = document.querySelector("#des").value;

  if (!title || !description)
    return console.log("either tile or description is missing");

  //Getting data from input , as file stored in files array so we take first index of that array
  const myfiles = document.querySelector("#file").files[0];

  let fd = new FormData();

  //adding that file with upload attribute
  fd.append("upload", myfiles);
  fd.append("description", description);
  fd.append("title", title);

  //makeing post request to save file in server
  fetch("/blog", {
    method: "POST",
    /*     headers: {
      'Content-Type': 'application/json'
      to use form data we should not use content-type : 'application json'
    }, */
    body: fd,
  })
    .then((res) => res.json())
    .then((res) => {
      renderUI(res._id, res.title, res.description);
      clearValues();
    })
    .catch((e) => console.log(e));
});

//all fetch
async function makeFetchReq(url) {
  try {
    const bindata = await fetch(url);
    let data = bindata.json();
    return data;
  } catch (error) {}
}

//====================================================================================================================
//render ui component in ui
function renderUI(id, title, des) {
  let html = `<div class="postdiv" id="%id%">
<div class="postheading">
%title%
</div>
<br>
<div class="postdescription">
%des%
</div>
</div>
`;

  html = html.replace("%id%", id);
  html = html.replace("%title%", title);
  html = html.replace("%des%", des);

  const main = document.querySelector(".main");
  main.insertAdjacentHTML("afterbegin", html);

}
//====================================================================================================================

const main = document.querySelector(".main");

main.addEventListener("click", (e) => {
  let id;
  if (!e.target.parentNode.id) {
    id = e.target.id;
  } else {
    id = e.target.parentNode.id;
  }
  if (id) {
    localStorage.setItem("post", id);
    window.location.href = "post";
  }
});

//show more for pagination

function showMore(args) {
  if(args == 'hide'){
    document.querySelector('.clk').classList.toggle('hide')
    document.querySelector('.nomore').classList.toggle('hide')
  }else if(args == 'showmore'){
    document.querySelector('.clk').classList.toggle('hide')
  }else if(args == 'nopost'){
    document.querySelector('.nomore').classList.toggle('hide')
  }
}


document.querySelector(".clk").addEventListener("click",  fetchPost);



//fetchpost
let skip=0;
function fetchPost(){
  if(skip==0){
    showMore('showmore')

  }
  makeFetchReq(`/blog/?limit=2&skip=${skip}`).then((res) => {
    if(res.length == 0){
      showMore('nopost')
      showMore('showmore')
    }else{
      res.forEach((element) => {
        renderUI(element._id, element.title, element.description);
      });
      
    }
  });
  skip+=2;
}



//Delete all the post in one click
document.querySelector('.del-all-post').addEventListener('click', ()=>{
const val = prompt('Are you sure Want to clear all the Data, Type `yes` or `YES` FOR DELETE ')  
if(val === 'YES' || val === 'yes'){
  fetch('/blog' , {
method : 'DELETE'
  }).then(res => res.json())
  .then(res =>{
    alert(res.message)
    window.location.href = '/'
  })
}

})