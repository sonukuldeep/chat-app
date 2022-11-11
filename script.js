import { googleSignIn, logout, addToRealTimeDB } from './Config/firebaseConfig.js'



const chatList = document.querySelectorAll(".touch-devices .chat-list")
chatList[0]?.addEventListener("click", () => { activateList(0) })
chatList[1]?.addEventListener("click", () => { activateList(1) })
function activateList(index) {

    const element = chatList[index].nextElementSibling
    element.classList.toggle("disabled")
    // console.log(chatList)
}



const closeBtn = document.querySelector(".notificationDiv .close")
closeBtn.addEventListener("click", ()=>{
    document.querySelector('.notificationDiv').classList.toggle('disable')
})


const msg = document.querySelector("#userMsg")
const msg2 = document.querySelector(".chat-box-touch-devices #userMsg")
const btnTrigger = document.querySelectorAll(".sendBtn")
msg?.addEventListener("keypress", (event) => { if (event.key === "Enter") { event.preventDefault(); sendMsg() } })

// btnTrigger?.addEventListener("click", () => { sendMsg() })
btnTrigger.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        sendMsg()
    })
})
function sendMsg() {
    
    if(msg.value !== ""){
        addToRealTimeDB(msg.value)
        msg.value = ""
    }


    if(msg2.value !== "")
    {
        addToRealTimeDB(msg2.value)
        msg2.value = ""
    }
    // console.log(msg.value)
}

//popup triggers
const popup = document.querySelector("#popup")
const popupCloseBtn = document.querySelector("#popup .close")
const popup2 = document.querySelector("#popup-private")
const popupCloseBtn2 = document.querySelector("#popup-private .close")
const groupChatBtn = document.querySelectorAll(".trigger-group-chat")
const popupPrivate = document.querySelector("#popup-private")
const privatepChatBtn = document.querySelectorAll(".trigger-private-chat")

popupCloseBtn?.addEventListener("click", () => { popup.classList.toggle("disable") })
popupCloseBtn2?.addEventListener("click", () => { popup2.classList.toggle("disable") })

groupChatBtn[0]?.addEventListener("click", () => { popup.classList.toggle("disable");popupPrivate.classList.add("disable") })
groupChatBtn[1]?.addEventListener("click", () => { popup.classList.toggle("disable");popupPrivate.classList.add("disable") })

privatepChatBtn[0]?.addEventListener("click", () => { popup.classList.add("disable");popupPrivate.classList.toggle("disable") })
privatepChatBtn[1]?.addEventListener("click", () => { popup.classList.add("disable");popupPrivate.classList.toggle("disable") })