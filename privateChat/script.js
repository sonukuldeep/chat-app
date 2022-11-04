import { addToPrivateDB, privateChat, addToRealTimeDB } from '../Config/firebaseConfig.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlParamsArray = Array.from(urlParams.values())

if (queryString.length !== 0) {
    sessionStorage.setItem("userData", JSON.stringify({ "chatroomID": urlParamsArray[0], "chatroomData": urlParamsArray[1] }))
    console.log(`sessionStorage set to ${urlParamsArray[0]}`)
}

document.addEventListener('DOMContentLoaded', () => {
    addToPrivateDB(copyToClip)


    // privateChat()

})

const copyToClip = () => {

    if (queryString.length === 0) {

        const rootID = document.querySelector('[data-url]')
        rootID.style.cursor = 'pointer'
        rootID.addEventListener('click', () => {

            // Copy the text inside the text field
            navigator.clipboard.writeText(rootID.getAttribute('data-url'));
            console.log("copied", rootID.getAttribute('data-url'))
        })
    }
}

const msg = document.querySelector("#userMsg")
const btnTrigger = document.querySelector(".sendBtn")
msg?.addEventListener("keypress", (event) => { if (event.key === "Enter") { event.preventDefault(); sendMsg() } })
btnTrigger?.addEventListener("click", () => { sendMsg() })
function sendMsg() {
    addToRealTimeDB(msg.value, 'private')
    console.log(msg.value)
    msg.value = ""
}

window.addEventListener('beforeunload', (event) => {
    event.returnValue = `Are you sure you want to leave?`;
  });
  