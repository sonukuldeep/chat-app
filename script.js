import {googleSignIn, logout} from './Config/firebaseConfig.js'

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

const group_chat = document.querySelector("#signIn-signOut")
signin_out.addEventListener("click", ()=>{callGoogleSignIn()})
function callGoogleSignIn(){
    const signoutButton = document.querySelectorAll('.signIn')[0]
    if(signoutButton.classList.contains("logged-in")) {
        logout()
    } else {
        googleSignIn()

    }
}