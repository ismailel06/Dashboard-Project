const bodyelement = document.querySelector("body")
const toggle = document.getElementById("toggle")
const toggleicon = document.querySelector(".fa-moon")

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