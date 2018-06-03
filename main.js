/*
 *	VARIABLES
 */
const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
const {autoUpdater} = require("electron-updater");

let win;


/*
 *	FUNCTIONS
 */
function createWindow() {
	win = new BrowserWindow({
		width: 1000, 
		height: 765, 
		frame: false, 
		show: false, 
		backgroundColor: "#fff", 
		minWidth: 1000, 
		minHeight: 765
	});
	win.loadURL(url.format({
		pathname: path.join(__dirname, "www/index.html"),
		protocol: "file:",
		slashes: true
	}));
	
	/*
	 *	EVENTS
	 */
	win.once("ready-to-show", () => {
		win.show();
	});
	win.on("closed", () => {
		win = null;
	});
}

/*
 *	EVENTS
 */
app.on("ready", () => {
	autoUpdater.checkForUpdatesAndNotify();
	createWindow();
});
app.on("window-all-closed", () => {
	if(process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
	if(win === null) createWindow();
});
