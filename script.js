const bodyelement = document.querySelector("body")
const toggle = document.getElementById("toggle")
const toggleicon = document.querySelector(".fa-moon")
const appendsidebar = document.querySelector(".sidebar-icon")
const sidebar = document.querySelector(".sidebar")

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

appendsidebar.addEventListener("click" ,function(){
    const currwidth = getComputedStyle(sidebar).width

    if(currwidth === "0px"){
        sidebar.style.width = "250px"
    }else{
        sidebar.style.width = "0px"
    }
})