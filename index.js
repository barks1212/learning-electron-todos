const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());
  //Here we give the mainWindow some additional functionality by defining that on the event "closed" the app quits out. This means that no matter how many additional windows are open, if the main window is closed then the entire app shuts down.

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});
//Here we tell the app to use our menu template, overwriting Electrons default template and therefore erasing and key bind shortcuts we have and temporarily removing taskbar functionality 

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  }); 
  addWindow.loadURL(`file://${__dirname}/add.html`)
} 
// Here we define a function the creates a new browser window but instead of passing in an empty object which returns a default spec window, we define some parameters such as width and height (both take pixel values) and a title to instruct the user what to do with this pop up window. We will pass this function to our submenu label 'new todo'.

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { 
        label: 'New Todo',
        click () { createAddWindow() }
    },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ] 
  }
]; //*Wrap* Here, each object added to this template corresponds to a dropdown on the taskbar, first object will be assigned to app name on OSX. To create new labels within a label we define "submenu" as a key and give it a value of an array of objects or new sub-labels" We add a label called quit and also set one of the keys to be the click function which returns app.quit(exits the app). We also pass in the accelerator key which is used to define key binds. Here we check the users OS with a turnary and set the key bind to quit to use either command or ctrl

// Within the sub-label "New Todo" we define a new key to be a click function where on click, the createAddWindow function is called

if (process.platform=== 'darwin') {
  menuTemplate.unshift({})
}
//Here we are checking what operating system the user is running. Darwin refers to OSX. Our problem was that the first label we define on OSX gets hidden automatically under the name of the app (electron in this case) whereas windows users would correctly see "file". To get around this we append an empty object onto our template if the user is on OSX.