window.addEventListener("scroll",function(){
   var header = document.querySelector("header");
   header.classList.toggle("sticky",window.scrollY > 0)
   
} )

var swiper = new Swiper(".mySwiper", {
  loop: true,
  autoplay: {
    delay: 10000, // 300,000 ملي ثانية (5 دقائق)
    disableOnInteraction: false, // يستمر التشغيل التلقائي حتى بعد تفاعل المستخدم
  },
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 300,
    modifier: 1,
    slideShadows: false,
  },
  pagination: { 
    el: ".swiper-pagination",
  },
});
// bot massege 
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessagebtn = document.querySelector("#send-message");
const fileinput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const Filecancelbtn = document.querySelector("#file-cancel");
const chatbotTogger = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chat");



const userData ={
  message: null,
  file: {
    data: null,
    mime_type: null
  }
}
const initialInputHeight = messageInput.scrollHeight;
API_KEY ="AIzaSyAAHNk9qDEXDJaepHMFtS30JTa2LHm1l3k";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const createMassageElement =(content , ...classses) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classses);
  div.innerHTML = content;
  return div
}
const handleOutgoingMessage = (e) => {
e.preventDefault();
userData.message = messageInput.value.trim();
messageInput.value = "";
fileUploadWrapper.classList.remove("file-uploaded");
messageInput.dispatchEvent(new Event("input"));
  const messageContent = `<div class="message-text"></div>
  ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}
  `;
 const outgoingMeassageDiv =  createMassageElement(messageContent, "user-message")
 outgoingMeassageDiv.querySelector(".message-text").textContent = userData.message;
 chatBody.appendChild(outgoingMeassageDiv);
 chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
 setTimeout(() => {
  const messageContent = `               <img src="img/11zon_cropped.png" class="bot-avatar" >

<div class="message-text">
 <div class="thinking-ind">
<div class="dot"></div>
<div class="dot"></div>
<div class="dot"></div>
 </div>
</div>`;
  const incomingMeassageDiv =  createMassageElement(messageContent, "bot-message", "thinking")
  chatBody.appendChild(incomingMeassageDiv);
 chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  generateBotResponse(incomingMeassageDiv);
 }, 600)
}
const generateBotResponse = async (incomingMeassageDiv) => {
  const messageElement = incomingMeassageDiv.querySelector(".message-text");
  const requestOptions = {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    contents: [{
      parts:[{text: userData.message}, ...(userData.file.data ?[{ inline_data: userData.file }] : [])]
      }]
  })

  }
  try{
const response = await fetch(API_URL, requestOptions);
const data = await response.json();
if(!response.ok)throw new Error(data.error.message);

const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
messageElement.innerText = apiResponseText;
  }catch(error){
console.log(error);
messageElement.innerText = error.message;
messageElement.style.color = "#ff0000"
  }
  finally{
    userData.file = {};
    incomingMeassageDiv.classList.remove("thinking");
 chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  }
}
messageInput.addEventListener("keydown", (e)=> {
  const userMessage = e.target.value.trim();
  if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768){
   handleOutgoingMessage(e)

  }
});
messageInput.addEventListener("input", () => {
  messageInput.style.hight = `${initialInputHeight}px`;
  messageInput.style.hight = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius =  messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});
fileinput.addEventListener("change", (e) => {
  const file = fileinput.files[0];
  if(!file)return;
  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    
    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type
    }
  fileinput.value = "";

  }
  reader.readAsDataURL(file);
});
//remove
Filecancelbtn.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
})
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
      const{ selectionStart: start, selectionEnd: end } = messageInput;
      messageInput.setRangeText(emoji.native, start, end, "end");
      messageInput.focus();
    },
    
    onClickOutside: (e) => {
      if(e.target.id === "emoji-pecker"){
        document.body.classList.toggle("show-emoji-picker");
      }else{
        document.body.classList.remove("show-emoji-picker");

      }
    }
});
 
document.querySelector(".chat-form").appendChild(picker);
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"))
sendMessagebtn.addEventListener("click", (e) => handleOutgoingMessage(e))
document.querySelector("#file-upload").addEventListener("click", () => fileinput.click());
chatbotTogger.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// js test 
// start socail 
let toggle = document.querySelector(".menu-toogle");
let menu = document.querySelector(".menu");
toggle.onclick = function(){
  menu.classList.toggle(`active`);
}