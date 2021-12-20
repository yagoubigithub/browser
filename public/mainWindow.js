const isDev = require("electron-is-dev");
const path =  require('path')

const { BrowserWindow, app,ipcMain,Menu ,MenuItem} = require("electron");






let mainWindow = new BrowserWindow({
    show :false,
   //frame : false,
   //useContentSize : true,
  // transparent : true,
    webPreferences: {
      
      
      nodeIntegration : true,
      contextIsolation : false,
      enableRemoteModule: true,
      webviewTag: true,
   
     
    },
  
    icon: `${path.join(__dirname, "./logo512.png")}`,
    
  });
 //mainWindow.setContentProtection(true)
 mainWindow.maximize()
 
  
  

 if (process.platform === 'darwin' && !isDev) {
  const template = [
    {
      label: app.getName(),
      submenu: [{ role: 'hide' }, { role: 'hideothers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }]
    },
    {
      label: 'Edit',
      submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectall' }]
    },
    {
      label: 'View',
      submenu: [{ role: 'togglefullscreen' }]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
} else {
  Menu.setApplicationMenu(null)
}
  
    if( app.isPackaged){

      mainWindow.loadFile( path.join(__dirname, "index.html"))
    }else{
      mainWindow.loadURL("http://localhost:3000");
    }
  

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
  
 
mainWindow.on('close', (e)=>{
  app.quit()
})




    const menu = new Menu()

    // Build menu one item at a time, unlike
    menu.append(new MenuItem ({label: 'Cut',role: 'cut'}))
    menu.append(new MenuItem ({label: 'Copy',role: 'copy'}))
    menu.append(new MenuItem ({label: 'Paste',role: 'paste'}))
    
    menu.append(new MenuItem({type: 'separator'}))
    menu.append(new MenuItem ({label: 'Select all',role: 'selectall'}))
  
  
    app.on("web-contents-created", (...[/* event */, webContents]) => {

      //Webview is being shown here as a window type
      console.log(webContents.getType())
      webContents.on("context-menu", (event, click) => {
        event.preventDefault();
        console.log(webContents.getType())
        menu.popup(webContents);
      }, false);
      });

/*
ipcMain.on("closeWindow" ,  (event, value)=>{
  app.quit();
})
ipcMain.on("minimizeWindow",(event, value)=>{
  mainWindow.minimize()
})

ipcMain.on("changeScreen",(event, value)=>{
  if(value.isFullScreen){
    //max
    mainWindow.maximize()
  }else{
    mainWindow.unmaximize()
  }
  
})
*/

module.exports = mainWindow;