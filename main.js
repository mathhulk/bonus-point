// VARIABLES
const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
const {autoUpdater} = require("electron-updater");

var application;

// FUNCTIONS
function createWindow( ) {
	application = new BrowserWindow({
		width: 1000, 
		height: 765, 
		frame: false, 
		show: false, 
		backgroundColor: "#fff", 
		minWidth: 1000, 
		minHeight: 765
	});
	
	application.loadURL(url.format({
		pathname: path.join(__dirname, "www/index.html"),
		protocol: "file:",
		slashes: true
	}));
	
	// EVENTS
	application.once("ready-to-show", function( ) {
		application.show( );
	});
	
	application.on("closed", function( ) {
		application = null;
	});
}

/*
 *	EVENTS
 */
app.on("ready", function( ) {
	autoUpdater.checkForUpdatesAndNotify( );
	createWindow( );
});

app.on("window-all-closed", function( ) {
	if(process.platform !== "darwin") app.quit( );
});

app.on("activate", function( ) {
	if(application === null) createWindow( );
});
