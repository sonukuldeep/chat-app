import {googleSignIn, logout, addToRealTimeDB} from './Config/firebaseConfig.js'

function activateList() {
    // signin_out.
    // element.childNode.classList.toggle("disabled")
    // console.log(signin_out.children[0])
}

//log in log out with google
const signin_out = document.querySelector("#signIn-signOut")
signin_out.addEventListener("click", ()=>{callGoogleSignIn()})
function callGoogleSignIn(){
    const signoutButton = document.querySelectorAll('.signIn')[0]
    if(signoutButton.classList.contains("logged-in")) {
        logout()
    } else {
        googleSignIn()

    }
}

// const group_chat = document.querySelector("#signIn-signOut")
// signin_out.addEventListener("click", ()=>{callGoogleSignIn()})
// function callGoogleSignIn(){
//     const signoutButton = document.querySelectorAll('.signIn')[0]
//     if(signoutButton.classList.contains("logged-in")) {
//         logout()
//     } else {
//         googleSignIn()

//     }
// }

const msg = document.querySelector("#userMsg")
const btnTrigger = document.querySelector(".sendBtn")
msg?.addEventListener("keypress",(event)=>{ if(event.key === "Enter"){event.preventDefault();sendMsg()}})
btnTrigger?.addEventListener("click",()=>{sendMsg()})
function sendMsg(){
    addToRealTimeDB(msg.value)
    console.log(msg.value)
    msg.value = ""
}

const popup = document.querySelector("#popup")
const popupCloseBtn = document.querySelector("#popup .close")
popupCloseBtn?.addEventListener("click", ()=>{popup.classList.toggle("disable")})

const groupChatBtn = document.querySelectorAll(".trigger-group-chat")
groupChatBtn[0]?.addEventListener("click", ()=>{popup.classList.toggle("disable")})
groupChatBtn[1]?.addEventListener("click", ()=>{popup.classList.toggle("disable")})