import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js"
import { getDatabase, ref, set, onValue, update, push, child } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"
import { getStorage, ref as storeRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js"

import { displaySubscript } from "./gChat.js"

//firebaseConfig to be assigned from my server
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
}


//my server url. Helps hide apis and assign them when needed
const url = "https://gleaming-pink-pea-coat.cyclic.app/api"
// const url = "https://gleaming-pink-pea-coat.cyclic.app"

const apiCall = async () => {
    const rawApi = await fetch(url)
    const api = await rawApi.json()
    return api
}

//setting all api keys
const api = await apiCall()
firebaseConfig.apiKey = api.API_KEY.apiKey
firebaseConfig.authDomain = api.API_KEY.authDomain
firebaseConfig.databaseURL = api.API_KEY.databaseURL
firebaseConfig.projectId = api.API_KEY.projectId
firebaseConfig.storageBucket = api.API_KEY.storageBucket
firebaseConfig.messagingSenderId = api.API_KEY.messagingSenderId
firebaseConfig.appId = api.API_KEY.appId


// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const rdb = getDatabase() //"app" may or maynot be passed as parameter

const currentDate = new Date()
const UTCDate = currentDate.getUTCFullYear() + "/" + currentDate.getUTCMonth() + "/" + currentDate.getUTCDate()
const chatRef = ref(rdb, 'chatBox/' + UTCDate)

let siginStatus = false
// SIGNIN SIGNUP AND SIGNIN STATUS
//signin With Google    https://firebase.google.com/docs/auth/web/google-signin?hl=en&authuser=0#handle_the_sign-in_flow_with_the_firebase_sdk
export async function googleSignIn() {
    const provider = new GoogleAuthProvider()
    try {
        if(siginStatus) throw "already logged in"
        
        siginStatus = true
        const result = await signInWithPopup(auth, provider)
        const credential = await GoogleAuthProvider.credentialFromResult(result)
        // const token = credential.accessToken
        const user = result.user
        // console.log("user ", user.uid, user.displayName, user.email)

    } catch (error) {
        // Handle Errors here.
        console.error(error)
    }
}

//anonymous signin in
const anonymousSignInBtn = document.querySelector('#popup-signIn .btn-anonymous-signin')
anonymousSignInBtn?.addEventListener('click', () => { anonymousSignIn() })
async function anonymousSignIn() {
    try {
        if(siginStatus) throw "already logged in"
        siginStatus = true
        const credential = await signInAnonymously(auth)
        document.querySelector('#popup-signIn').classList.toggle('disable')
        setTimeout(() => {
            logout()
        }, 15 * 60 * 1000); //kick user ofter 15 min
    } catch (error) {
        // Handle Errors here.
       
        console.error("error: ", error)
    }
}

//logout
export async function logout() {
    try {
        await signOut(auth)
        siginStatus = false

        console.log("logged out successfully")
    } catch (error) {
        console.error("could not logout ", error)
    }
}


// check authentiucation status(runs on every render so caution while using on react)
onAuthStateChanged(auth, (user) => {
    const signoutButton = document.querySelectorAll('.signIn')
    const chatBox = document.querySelector(".chat-box")
    const dropDownMenu = `<ul>
        <li class='notificationBox'>Notifications</li>
        <li>Friends</li>
        <li>Messages</li>
        <li>Followers</li>
        <li>Share</li>
        <li><a href='./profile.html'>Settings</a></li>
        <li class='triggerLogout'>Log out</li>
    </ul>`


    if (user) {
        const userData = { "uid": user.uid, "displayName": user.displayName, "email": user.email }
        localStorage.setItem("userData", JSON.stringify(userData))
        const chatList = document.querySelectorAll(".touch-devices .chat-list")

        signoutButton[0].innerHTML = "Profile" + dropDownMenu
        signoutButton[0].classList.add("logged-in")
        signoutButton[0].classList.remove("logged-out")
        signoutButton[1].innerHTML = "Profile"
        signoutButton[1].classList.add("logged-in")
        signoutButton[1].classList.remove("logged-out")

        //set some values in database if user successfully logged in
        const displayName = JSON.parse(localStorage.getItem("userData")).displayName
        const userDataRef = ref(rdb, "UserData/" + user.uid + "/displayName")
        set(userDataRef, displayName)
        siginStatus = true

        
        
    } else {
        console.log("log out successful")
        localStorage.setItem("userData", JSON.stringify(""))
        signoutButton[0].innerHTML = "Log In"
        signoutButton[0].classList.add("logged-out")
        signoutButton[1].innerHTML = "Log In"
        signoutButton[1].classList.add("logged-out")

        //if user logs out the window is deactivated
        chatBox?.classList.add("disable")
    }
    loginLogout()

    document.querySelector('.notificationBox')?.addEventListener('click', () => { notificationPopup() })

})

function loginLogout() {

    //log in log out with google
    let signin_out
    if (anonymousSignInBtn) //anonymous signin option only on home page
    {

        signin_out = document.querySelector(".profile-tab")
        const popupSignIn = document.querySelector('#popup-signIn')
        signin_out.addEventListener("click", () => { popupSignIn.classList.toggle('disable') })
        const googleSigninInBtn = document.querySelector('#popup-signIn .btn-google-signin')
        googleSigninInBtn.addEventListener('click', ()=>{
            callGoogleSignIn()
            popupSignIn.classList.toggle('disable') 
        })
    }
    else
    {
        signin_out = document.querySelector("#signIn-signOut")
        signin_out.addEventListener('click', () => { callGoogleSignIn() })
    }
    const log_outBtn = document.querySelector(".triggerLogout")
    log_outBtn?.addEventListener("click", () => { callGoogleSignIn('logout') })
    const signoutButton = document.querySelectorAll('.signIn')[0]
    const signoutButton1 = document.querySelectorAll('.signIn')[1]

    function callGoogleSignIn(signinDefault = 'siginIn') {

        if (signinDefault === 'siginIn' && signoutButton.classList.contains("logged-out")) {
            googleSignIn()
        }
        if (signinDefault !== 'siginIn' && signoutButton.classList.contains("logged-in")) {
            logout()
        }
        if (signinDefault === 'siginIn' && signoutButton1.classList.contains("logged-out")) {
            googleSignIn()
        }
        if (signinDefault !== 'siginIn' && signoutButton1.classList.contains("logged-in")) {
            logout()
        }

    }

}


// X-X-X-X-X-X-X
// REALTIME DATABASE
//add data to RDB
export async function addToRealTimeDB(data, room = "public") {
    try {

        //confirm login coformation
        const userData = JSON.parse(localStorage.getItem("userData"))
        if (userData === "") throw "User not logged in"

        //creating data to be send to server
        const utcTimestamp = new Date().getTime()
        const userDataToSend = { "time": utcTimestamp, "msg": data, "uid": userData.uid, "displayName": userData.displayName, "email": userData.email }

        //ref
        // const userDataRef = ref(rdb, "chatBox/hkas25t5aef76814nmsdzv/" + userData.uid + utcTimestamp)
        const userDataRef = ref(rdb, "chatBox/" + UTCDate + "/" + userData.uid + utcTimestamp)

        if (room === 'public') {

            //send entry to server
            await set(userDataRef, userDataToSend)

        } else {
            const userDataOnSessions = JSON.parse(sessionStorage.getItem("userData"))
            const userDataRef = ref(rdb, "privateChatRoomIDS/" + userDataOnSessions.chatroomID)

            const userDataToSend = { "msg": data, "uid": userData.uid, "displayName": userData.displayName, "UTCTimeStamp": utcTimestamp }

            onValue(userDataRef, (snapshot) => {
                const data = snapshot.val()
                data.push(userDataToSend)
                // console.log("added to rdb")
                set(userDataRef, data)
            }, {
                onlyOnce: true
            })

        }


    } catch (error) {
        console.error(error)
    }
}

// read data once
async function readDataOnce(chatRef = chatRef) {
    let userData;
    await onValue(chatRef, (snapshot) => {
        const data = snapshot.val()
        console.log("latest entry in RDB ", data)
        userData = data
        // return data
    })


    return userData
}


//populate Gchat fields
onValue(chatRef, (snapshot) => {
    const data = snapshot.val()
    const currentUserUid = JSON.parse(localStorage.getItem("userData"))
    const chatWindow = document.querySelector(".chat-window")
    const chatWindowTouch = document.querySelector(".chat-box-touch-devices .chat-window")
    const chatuser = document.querySelector(".chat-user")
    if (chatWindow !== null && data !== null) {
        // let uniqueUsers = Object.values(data).map((entry) => { return entry.displayName }) //[...new Set(Object.values(data))]
        // uniqueUsers = [...new Set(uniqueUsers)]

        // const sortUsers = uniqueUsers.sort((a, b) => {
        const sortUsers = Object.values(data).sort((a, b) => {
            return (a > b) ? 1 : -1 //plane true false has issue on chrome
        })

        const users = sortUsers.map(entry => {
            //set displayName for anonymous users
            if(entry.displayName === undefined) entry.displayName = "Nameless Wonder"
            // randomBackgroundColor
            const BackgroundColor = 'background-color:rgba(255,255,255,0.5)'//`background-color:#${Math.floor(Math.random() * 16777215).toString(16)}`
            const textStyle = 'text-shadow:2px 2px 5px #333'
            return `<div data-avatar="${entry.uid}" class="user" style='${BackgroundColor};${textStyle}'><div>${entry.displayName}</div><div class='contextTriggerBtn'><i class="fa-solid fa-circle-chevron-down"></i></div></div>`
        })


        const sortMsg = Object.values(data).sort((a, b) => {
            return (new Date(a.time) > new Date(b.time)) ? 1 : -1 //plane true false has issue on chrome
        })
        const msgs = Object.values(sortMsg).map(entry => {
            // randomBackgroundColor
            const randomBackgroundColor = `background-color:#${Math.floor(Math.random() * 16777215).toString(16)}`
            const textStyle = 'text-shadow:2px 2px 5px #333'

            const leftRight = (entry.uid === currentUserUid.uid) ? "right" : "left";
            //set displayName for anonymous users
            if(entry.displayName === undefined) entry.displayName = "Nameless Wonder"
            return `<div class='${leftRight} chat-msg' data-id='${entry.uid}' style='${randomBackgroundColor};${textStyle}'>${entry.msg}<span class="subscript">${entry.displayName}</span></div>`
        })

        // chatuser.innerHTML = users.reduce((total, item) => { return total + item })
        if (chatuser) {
            chatuser.innerHTML = [...new Set(users)].reduce((total, item) => { return total + item })
            contextMenu()

        }

        chatWindow.innerHTML = msgs.reduce((total, item) => { return total + item })
        if (chatWindowTouch)
            chatWindowTouch.innerHTML = msgs.reduce((total, item) => { return total + item })

        //functions fetches the user avatar and adds them
        addAvatars()
        displaySubscript()

    }


})


//XXXX 
// https://firebase.google.com/docs/storage/web/create-reference#full_example
//fire storage
const storage = getStorage()
export const storageRef = storeRef(storage, "images")
function addAvatars() {
    const addAvatar = document.querySelectorAll('[data-avatar]')
    addAvatar.forEach((node) => {
        const uid = node.dataset.avatar //dataset or getAttribute both work
        const path = `images/${uid}/avatar/pic.jpeg`
        
        getDownloadURL(storeRef(storage, path))
            .then((url) => {
                // `url` is the download URL for 'images/stars.jpg'
                //inserted into an <img> element
                const img = document.createElement('img')
                img.setAttribute('src', url)
                img.setAttribute('style', 'width: 30px;height:30px;border:2px solid #fff;border-radius:50%')
                node.prepend(img)

            })
            .catch((error) => {
                // Handle any errors
                console.log("No profile pic found for user")
            });

    })


}


// private chat hand shake. Basically this script will create and offer room URL code for the other party to join into
//add data to RDB
export const addToPrivateDB = (dependencyFunction, runFromGchat = false) => {
    try {

        //confirm login coformation
        const userData = JSON.parse(localStorage.getItem("userData"))
        if (userData === "") throw "User not logged in"

        const queryString = window.location.search

        if (queryString.length === 0) {

            //creating data to be send to server
            const utcTimeStamp = new Date().getTime()

            //creating a random roomID
            const roomID = Math.random().toString(36).slice(7) //26 alphabet + 10 numbers

            const userDataToSend = { "time": utcTimeStamp, "room": roomID, "roomStatus": "open", "roomOwneruid": userData.uid, "participents": [userData.uid], "roomOwnerdisplayName": userData.displayName, "roomOwneremail": userData.email }

            //send entry to server
            // Get a key for a new Post.
            const newPostKey = push(child(ref(rdb), 'privateChatRoom')).key;

            // Write the chat room data simultaneously
            const updates = {};
            updates["/privateChatRooms/" + newPostKey] = userDataToSend; // it contains room id, chat status, creation date info,.., etc
            updates["/UserData/" + userData.uid + "/Chats/" + newPostKey] = "active"; //this contains all the active chats user has
            // updates["/UserData/" + userData.uid + "/notification"] = { 'sendPrivateMsgInvite': "", "sendFriendRequest": "", "followUser": "", "reportUser": "" };
            updates["/privateChatRoomIDS/" + roomID] = [{ "msg": "Click on this message box to copy the invite code", "uid": "bot", "displayName": "bot", "UTCTimeStamp": utcTimeStamp }]; //this contains all the msg in the chat room

            update(ref(rdb), updates).then(() => {
                console.log('successfully created room')

                sessionStorage.setItem("userData", JSON.stringify({ "chatroomID": roomID, "chatroomData": newPostKey }))

                //setting chatroom data in localstorage 
                // localStorage.setItem('chatroomData',JSON.stringify({ "chatroomID": roomID, "chatroomData": newPostKey })) 
                // constChatroomData = { "chatroomID": roomID, "chatroomData": newPostKey }
                // console.log(roomID, newPostKey)
                if (!runFromGchat) {
                    privateChat(dependencyFunction)

                }
                else {
                    dependencyFunction()
                }


            })
        } else
            privateChat(dependencyFunction)

    } catch (error) {
        console.error(error)
    }

}

export const privateChat = (copyToClip) => {
    const chatData = JSON.parse(sessionStorage.getItem("userData"))
    const chatroomID = chatData.chatroomID
    const chatroomData = chatData.chatroomData

    const chatRef = ref(rdb, 'privateChatRoomIDS/' + chatroomID)
    onValue(chatRef, (snapshot) => {
        const data = snapshot.val()
        const currentUserUid = JSON.parse(localStorage.getItem("userData"))
        const chatWindow = document.querySelector("#chat-window")
        // const chatuser = document.querySelector(".chat-user")


        // console.log('db changed')
        if (true) {//chatWindow !== null && data !== null) {

            const sortUsers = Object.values(data).sort((a, b) => {
                return (a > b) ? 1 : -1 //plane true false has issue on chrome
            })

            const users = sortUsers.map(entry => {
                // set BackgroundColor
                const BackgroundColor = 'background-color:rgba(255,255,255,0.5)'
                const textStyle = 'text-shadow:2px 2px 5px #333'
                return `<div data-avatar="${entry.uid}" class="user" style='${BackgroundColor};${textStyle}'><div>${entry.displayName}</div></div>`
            })

            let notificationTrigger

            const msgs = Object.values(data).map(entry => {
                // little bit of styling
                const BackgroundColor = 'background-color:rgba(255,255,255,0.5)'
                const textStyle = 'text-shadow:2px 2px 5px #333'

                const leftRight = (entry.uid === currentUserUid.uid) ? "right" : "left"
                leftRight === "left" ? notificationTrigger = true : notificationTrigger = false

                if (entry.uid === 'bot') {
                    const urlData = `http://localhost:5500/privateChat/?room=${chatroomID}&chatdata=${chatroomData}`
                    return `<div class='chat-msg' data-url='${urlData}' style='${BackgroundColor};${textStyle};text-transform:none'>${entry.msg}</div>`
                }
                return `<div class="${leftRight} chat-msg">${entry.msg}<span class="subscript">${entry.displayName}</span></div>`
                // return { "class": `${leftRight} chat-msg`, "body": entry.msg, "spanBody": entry.displayName }
            })

            // chatuser.innerHTML = [...new Set(users)].reduce((total, item) => { return total + item })
            if (chatWindow)
                chatWindow.innerHTML = msgs.reduce((total, item) => { return total + item })

            if (notificationTrigger) {

                //play notification sound
                // playNotification()

            }


            //functions fetches the user avatar and adds them
            addAvatars()

            copyToClip()

            displaySubscript()

        }


    })
}

function playNotification() {
    let audio = new Audio("../Assets/notificationSound.mp3");
    audio.play();
}

//notification
const user = JSON.parse(localStorage.getItem("userData"))
const userDataRef = ref(rdb, "UserData/" + user.uid + "/notification/sendPrivateMsgInvite")
onValue(userDataRef, (snapshot) => {
    const data = snapshot.val()
    const notification = document.querySelector('.notification')
    if (notification)
        notification.innerHTML = ""

    data?.forEach((request, index) => {
        const newdata = document.createElement('li')
        newdata.innerHTML = formatNotification(request)
        notification.append(newdata)
    })
    playNotification()
    acceptChatInviteAddTrigger()
    chatResponseAccept()
    clearChatInvite(data, userDataRef)
})

function formatNotification(request) {
    let resp;
    switch (request.status) {
        case 'accepted':
            resp = `Chat request accepted by ${request.displayName} <button id='${request.dateTime}' data-chat='${request.chatroomData.chatroomData}' data-roomid='${request.chatroomData.chatroomID}' class="chatResponseAccept clearChatInvite">Click to open chat</button> <button id='${request.dateTime}' class="clearChatInvite">Cancel</button>`
            break;

        default:
            resp = `private chat request from ${request.displayName} <button id='${request.dateTime}' data-user='${request.from}' class="acceptChatInvite clearChatInvite">Accept</button> <button id='${request.dateTime}' class="clearChatInvite">Cancel</button>`
            break;
    }
    return resp
}

function clearChatInvite(data, userDataRef) {
    const clearChatInviteBtn = document.querySelectorAll('.clearChatInvite')
    let filteredNotification
    clearChatInviteBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filteredNotification = data?.filter(request => {
                return request.dateTime.toString() !== e.target.getAttribute('id')
            })
            set(userDataRef, filteredNotification)
        })
    })
}

function chatResponseAccept() {
    const acceptedResponse = document.querySelectorAll('.chatResponseAccept')
    if (acceptedResponse !== null) {
        acceptedResponse.forEach(response => {
            response.addEventListener('click', () => {
                const roomData = response.getAttribute('data-chat')
                const roomId = response.getAttribute('data-roomid')
                const urlData = `http://localhost:5500/privateChat/?room=${roomId}&chatdata=${roomData}`
                // console.log(roomData,roomId)
                window.open(urlData, '_blank')
            })
        })
    }

}

async function acceptChatInviteAddTrigger() {
    const acceptChatInviteBtn = document.querySelectorAll('.acceptChatInvite')
    const runthisWhenChatDataBaseIsDone = (e) => {


        // sessionStorage.setItem("userData", JSON.stringify({ "chatroomID": roomID, "chatroomData": newPostKey }))

        const sessionStorageData = JSON.parse(sessionStorage.getItem("userData"))
        const roomId = sessionStorageData.chatroomID
        const roomData = sessionStorageData.chatroomData

        //request was accepted hence sending the sender of request a responce to join private chat
        const fromUid = e.target.getAttribute('data-user')
        const userDataRef = ref(rdb, "UserData/" + fromUid + "/notification/sendPrivateMsgInvite")
        const utcTimeStamp = new Date().getTime()
        const currentUid = JSON.parse(localStorage.getItem('userData')).uid

        //sending chat room details
        // const chatData = JSON.parse(localStorage.getItem('chatroomData'))
        // console.log(fromUid,"fire")
        const userDataToSend = { "from": currentUid, "displayName": user.displayName, "dateTime": utcTimeStamp, "status": "accepted", "chatroomData": sessionStorageData }

        onValue(userDataRef, (snapshot) => {
            let data = snapshot.val()
            if (data !== null || data.length > 0) {
                // data = [userDataToSend]
                data.push(userDataToSend)

            }
            else {
                data = [userDataToSend]
            }
            // console.log(data, "fire")

            set(userDataRef, data)
        }, {
            onlyOnce: true
        })
        window.open(`http://localhost:5500/privateChat/?room=${roomId}&chatdata=${roomData}`, '_blank')
    }

    acceptChatInviteBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {

            //creatingDatabbase
            addToPrivateDB(() => { runthisWhenChatDataBaseIsDone(e) }, true)



        })
    })

}


function notificationPopup() {

    const notificationDiv = document.querySelector('.notificationDiv')
    notificationDiv.classList.toggle('disable')
}


function contextMenu() {

    const contextTrigger = document.querySelectorAll(".contextTriggerBtn")
    const currentUid = user.uid

    contextTrigger.forEach(btn => {
        const contextMenu = document.createElement('div')
        contextMenu.classList.add("contextMenu")
        const userUid = btn.parentNode.getAttribute('data-user')
        if (currentUid === userUid) {
            contextMenu.innerHTML = `<div>
            <ul>
                <li><a href="./index.html">Back to home page</a></li>
                <li><button>Send friend request</button></li>
                <li><button>Follow user</button></li>
                <li><button>Report</button></li>
            </ul>
        </div>`
        }
        else {
            contextMenu.innerHTML = `<div>
            <ul>
                <li class="triggerPrivateMsgRequest"><button>Send private message invite</button></li>
                <li class="triggerFriendRequest"><button>Send friend request</button></li>
                <li class="TriggerFollowUserRequest"><button>Follow user</button></li>
                <li class="triggerReport"><button>Report</button></li>
            </ul>
        </div>`
        }


        btn.append(contextMenu)
        btn.addEventListener("click", (e) => {
            e.preventDefault()
            contextMenu.classList.toggle("visible")
        })


    })

    document.querySelectorAll('.triggerPrivateMsgRequest')?.forEach((trigger) => { trigger.addEventListener('click', (e) => { triggerPrivateMsgRequest(e) }) })
    document.querySelectorAll('.triggerFriendRequest')?.forEach((trigger) => { trigger.addEventListener('click', (e) => { triggerFriendRequest(e) }) })
    document.querySelectorAll('.TriggerFollowUserRequest')?.forEach((trigger) => { trigger.addEventListener('click', (e) => { TriggerFollowUserRequest(e) }) })
    document.querySelectorAll('.triggerReport')?.forEach((trigger) => { trigger.addEventListener('click', (e) => { triggerReport(e) }) })

}

function triggerPrivateMsgRequest(e) {
    const userUid = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-avatar') //sad truth
    const currentUid = user.uid
    const userDataRef = ref(rdb, "UserData/" + userUid + "/notification/sendPrivateMsgInvite")
    const utcTimeStamp = new Date().getTime()
    const userDataToSend = { "from": currentUid, "displayName": user.displayName, "dateTime": utcTimeStamp, "status": "open" }

    console.log("triggerprivatechat")

    onValue(userDataRef, (snapshot) => {
        let data = snapshot.val()
        if (data !== null) {
            // data = [userDataToSend]
            data.push(userDataToSend)

        }
        else {
            data = [userDataToSend]
        }
        // console.log(data, "fire")

        set(userDataRef, data)
    }, {
        onlyOnce: true
    })


}

