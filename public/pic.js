//ON window load we get the time from server
window.addEventListener("load", (event) => {
  time();
});


//gettime from the server
function time() {
  fetch("/time")
    .then((res) => res.json())
    .then((res) => {
      document.querySelector("#time").textContent = res.time;
    });
}


//setinterval to run the time function in every one second
setInterval(() => {
  time();
}, 1000);


//Sending form data
document.querySelector("#submitpic").addEventListener("click", (e) => {
  //Prevent browser from reload
  e.preventDefault();

  //Creating new form data
  let fd = new FormData();

  //Getting data from input , as file stored in files array so we take first index of that array
  let myfiles = document.getElementById("avtar").files[0];

  //adding that file with upload attribute
  fd.append("upload", myfiles);

  //makeing post request to save file in server
  fetch("/image", {
    method: "POST",
    body: fd,
  })
    //when response is in object the res.json() work
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
});
