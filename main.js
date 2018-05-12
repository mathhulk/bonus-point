const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

/*
 *	VARIABLES
 */
let win;

/*
 *	FUNCTIONS
 */
function createWindow () {
	win = new BrowserWindow({width: 1000, height: 765, frame: false, show: false, backgroundColor: "#fff", minWidth: 1000, minHeight: 765});
	win.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file:",
		slashes: true
	}));
	
	/*
	 *	FUNCTIONS -> EVENTS
	 */
	win.once("ready-to-show", () => {
		win.show()
	});
	win.on("closed", () => {
		win = null;
	});
}

/*
 *	EVENTS
 */
app.on("ready", createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
app.on("activate", () => {
	if (win === null) {
		createWindow();
	}
});
