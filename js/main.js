// All element
const el = {
   mobileNav: document.querySelector(".mobile_menu"),
   header: document.querySelector("nav"),
   navIcon: document.querySelector(".mobile_nav"),
   shortenActive: document.querySelector(".shorten_active"),
   shortenLinkParent: document.querySelector(".shorten_link_p"),
   inputUrl: document.querySelector(".url"),
   submit: document.querySelector(".shorten_btn"),
   errorMsg: document.querySelector(".input_error_msg"),
   api: "https://rel.ink/api/links/",
   allShortenLink: [],
   allShortenLinkUrl: []
}

// Debug
const log = e => console.log(e);

// MockUp
const loadMockup = (data) => {
   let res = `<div class="shorten_active">
                  <p class="link">${data.url}</p>
                  <div class="left">
                     <span class="shorten_link">https://rel.ink/${data.hashid}</span>
                     <span class="copy">Copy</span>
                  </div>
               </div>`;
   
   el.shortenLinkParent.insertAdjacentHTML("beforeend", res);
}

// Shorten Link Function
async function shorten(link) {
   let post, other, call, data;

   post  = {
      url: link
   }

   other = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(post)
   }

   call  = await fetch(el.api, other);
   
   if (call.ok) {
      data  = await call.json();

      loadMockup(data);
      el.allShortenLink.push(data.hashid);
      el.allShortenLinkUrl.push(data.url);
      localStorage.setItem("shortenLink", el.allShortenLink);
      localStorage.setItem("shortenLinkUrl", el.allShortenLinkUrl);
   } else {
      log(`error: ${call.status}`)
   }

}

// Load All Recent Shorten Link
async function loadShortenLink(id) {
   let call, data;
   
   call = await fetch(`${el.api}${id}`);
   data = await call.json();
   loadMockup(data);
}

// Validate Input
const validateInput = inp => {
   switch (true) {

      case inp.value == "":
         inp.classList.add("input_empty");
         el.errorMsg.textContent = "Please add a link";
         el.errorMsg.classList.add("error_active");
         return false;
      break;

      case inp.value.length < 5:
         inp.classList.add("input_empty");
         el.errorMsg.textContent = "Please enter a valid link";
         el.errorMsg.classList.add("error_active");
         return false;
      break;

      case el.allShortenLinkUrl.indexOf(inp.value) > -1:
         return false;
      break;

      default:
         inp.classList.remove("input_empty");
         el.errorMsg.classList.remove("error_active");
         return true;

   }
};

// Load the Links
const loadLink = (id) => {
   ids = id.split(",");
   ids.forEach(id => {
      el.allShortenLink.push(id);
      loadShortenLink(id)
   })
}

// Load the Url
const loadUrl = (url) => {
   url.split(",").forEach(u => el.allShortenLinkUrl.push(u));
}

//Copy link
const copyLink = (link) => {

   let textarea = document.createElement("textarea");
   textarea.value = link.textContent;
   document.body.appendChild(textarea);
   textarea.select();
   document.execCommand("copy");
   textarea.remove();

}

// App
const app = () => {
   // check if link is shorten and load it
   let hashid, hashUrl;
   hashid   = localStorage.getItem("shortenLink");
   hashUrl  = localStorage.getItem("shortenLinkUrl");
   
   (hashid === "" || hashid === null) ? "" : loadLink(hashid);
   (hashUrl === "" || hashUrl === null) ? "" : loadUrl(hashUrl);

   // Submit btn
   el.submit.addEventListener("click", () => {
      validateInput(el.inputUrl) ? shorten(el.inputUrl.value) : ""
   })

   // Navigation Menu
   el.navIcon.addEventListener("click", () => {
      el.mobileNav.classList.toggle("mobile_active");
      el.header.classList.toggle("sticky");
   })

   // Copy Url
   el.shortenLinkParent.addEventListener("click", (e) => {

      if (e.target.classList.contains("copy")) {
         let copy = e.target.parentElement.previousElementSibling;

         document.querySelectorAll(".copy").forEach(c => {
            c.classList.remove("copied");
            c.textContent = "copy";
         })

         copyLink(copy);
         e.target.classList.add("copied");
         e.target.textContent = "copied";

      }

   })
}

app();