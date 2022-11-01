import { storageRef } from "./Config/firebaseConfig.js"
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js"

const inputElement = document.querySelector("#imageUpload")
inputElement.addEventListener("change", handleFiles, false)
const preview = document.querySelector("#preview")
const fileSelect = document.querySelector("#fileSelect")

let fullPath;
let uploadFile;

fileSelect.addEventListener("click", (e) => {
  if (inputElement) {
    inputElement.click()
  }
}, false)

function handleFiles() {
  const uid = JSON.parse(localStorage.getItem("userData")).uid
  try {
    if (uid === null || uid === undefined) {
      throw "user not logged in"
    }
  } catch (error) {
    console.log(error)
    return
  }

  const file = this.files[this.files.length - 1]
  // console.log(file.name, file.size, file.type)
  const img = document.createElement("img")
  img.classList.add("image-obj")
  img.file = file
  preview.append(img)

  const reader = new FileReader()

  reader.onload = (e) => {
    img.src = e.target.result
  }
  reader.readAsDataURL(file)

  fileSelect.innerText = file.name

  const uploadFileName = `/${uid}/avatar/pic.jpeg`

  const path = ref(storageRef, uploadFileName)

  fullPath = path
  uploadFile = file

}


const btn = document.querySelector("#upload-btn")
btn.addEventListener("click",()=>{uploadPp()})

function uploadPp() {
  // console.log("fire")
  if(fullPath === undefined || uploadFile === undefined)
  {
    console.log("no path set or file in variable")
    return
  }
  // 'file' comes from the Blob or File API
  uploadBytes(fullPath, uploadFile).then((snapshot) => {
    console.log('Uploaded a profile image!');
    fullPath = undefined 
    document.querySelector('section div').innerHTML = '<h2 style="color: white; text-shadow: 2px 2px 5px #333">Profile pic successfully uploaded</h2>'
  });

}