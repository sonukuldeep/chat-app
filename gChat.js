export const displaySubscript = () => {
    const hideUserNameOnSelectMsg = document.querySelectorAll('.chat-msg .subscript')
    hideUserNameOnSelectMsg.forEach((element, index) => {
        if (element.textContent !== hideUserNameOnSelectMsg[index + 1]?.textContent) {
            element.style.display = "block"

        }
    })
}