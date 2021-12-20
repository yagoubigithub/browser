const {ipcRenderer} = require("electron");

   console.log("start test.js")

    ipcRenderer.on("getString" , (e, url)=>{
      

      console.log( document.getElementsByTagName('html')[0].outerHTML) 

      ipcRenderer.sendToHost(document.getElementsByTagName('html')[0].outerHTML )

    })