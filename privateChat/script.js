import { addToPrivateDB, privateChat } from '../Config/firebaseConfig.js'
//addToPrivateDB()

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const chatroomID = urlParams.get('chatroomID')
const chatroomData = urlParams.get('chatroomData')

if(chatroomID !== null && chatroomData !== null) {
    sessionStorage.setItem("userData", JSON.stringify({ "chatroomID": chatroomID, "chatroomData": chatroomData }))
    console.log(chatroomData,chatroomID)
}

document.addEventListener('DOMContentLoaded', () => {
    addToPrivateDB(copyToClip)


    // privateChat()

})

const copyToClip = () => {
    const rootID = document.querySelector('[data-url]')
    rootID.style.cursor = 'pointer'
    rootID.addEventListener('click', () => {

        // Copy the text inside the text field
        navigator.clipboard.writeText(rootID.getAttribute('data-url'));
        console.log("copied")
    })
}