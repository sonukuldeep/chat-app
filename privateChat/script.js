import { addToPrivateDB, privateChat } from '../Config/firebaseConfig.js'
//addToPrivateDB()

document.addEventListener('DOMContentLoaded',()=>{
    addToPrivateDB()
    privateChat()

})
