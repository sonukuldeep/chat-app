import { addToPrivateDB, privateChat, addToRealTimeDB } from '../firebaseConfig.js'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlParamsArray = Array.from(urlParams.values())

if (queryString.length !== 0) {
    sessionStorage.setItem("userData", JSON.stringify({ "chatroomID": urlParamsArray[0], "chatroomData": urlParamsArray[1] }))
    console.log(`sessionStorage set to ${urlParamsArray[0]}`)
}

const copyToClip = () => {
    
    const rootID = document.querySelector('#chat-window [data-url]')
    if (queryString.length === 0) {
        
        rootID.style.cursor = 'pointer'
        rootID.addEventListener('click', () => {
            
            // Copy the text inside the text field
            navigator.clipboard.writeText(rootID.getAttribute('data-url'));
            console.log("copied", rootID.getAttribute('data-url'))
        })
    } else {
        rootID.innerHTML = "Say Hi to your friend"
        rootID.removeAttribute('data-url')
    }
}

addToPrivateDB(copyToClip)

const msg = document.querySelector("#userMsg")
const btnTrigger = document.querySelector(".sendBtn")
msg?.addEventListener("keypress", (event) => { if (event.key === "Enter") { event.preventDefault(); sendMsg() } })
btnTrigger?.addEventListener("click", () => { sendMsg() })
function sendMsg() {
    addToRealTimeDB(msg.value, 'private')
    // console.log(msg.value)
    msg.value = ""
}


const notificationDiv = document.querySelector('.notificationDiv')
const notificationDivBtn = document.querySelector('.notificationDiv .close')
notificationDivBtn.addEventListener('click', ()=>{
    notificationDiv.classList.toggle('disable')
})

window.addEventListener('beforeunload', (event) => { //works once user interacts with the website else it doesn't trigger
    event.returnValue = `Are you sure you want to leave? You will lose the chat`
})

