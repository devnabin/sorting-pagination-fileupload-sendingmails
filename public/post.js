//server time setup
window.addEventListener("load", (event) => {
  time();

  const postid = localStorage.getItem('post') 
  const url = `post/${postid}`
  console.log(url)
  makeFetchReq(url).then((res) => {
  if(res){
      renderUI(res)
  }
  }); 

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

//all fetch
async function makeFetchReq(url) {
  try {
    const bindata = await fetch(url);
    let data = bindata.json();
    return data;
  } catch (error) {}
}

//rendring ui
function    renderUI(res){
 const heading = document.querySelector('h1')
 const img = document.querySelector('img')
 const body = document.querySelector('p')
heading.textContent = res.title
img.src = `blog/${res._id}/pic`
body.textContent = res.description
}