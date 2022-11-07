export const displaySubscript = () => {
    const hideUserNameOnSelectMsg = document.querySelectorAll('.chat-msg .subscript')
    hideUserNameOnSelectMsg.forEach((element, index) => {
        if (element.textContent !== hideUserNameOnSelectMsg[index + 1]?.textContent) {
            element.style.display = "block"

        }
    })
}

// export const contextMenu = () => {

//     const contextTrigger = document.querySelectorAll(".contextTriggerBtn")

//     contextTrigger.forEach(btn => {
//         const contextMenu = document.createElement('div')
//         contextMenu.classList.add("contextMenu")
//         contextMenu.innerHTML = `<div>
//             <ul>
//                 <li><button>Send private message invite</button></li>
//                 <li><button>Send friend request</button></li>
//                 <li><button>Follow user</button></li>
//                 <li><button>Report</button></li>
//             </ul>
//         </div>`
        
//         btn.append(contextMenu)
//         btn.addEventListener("click", (e) => {
//             e.preventDefault()
//             contextMenu.classList.toggle("visible")
//         })

//     })


// }


