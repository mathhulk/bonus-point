const app = require("electron");

$(".minimizeWindow").click(function( ) {
    app.remote.getCurrentWindow( ).minimize( );
});

$(".maximizeWindow").click(function( ) {
    ( ! app.remote.getCurrentWindow( ).isMaximized( ) ? app.remote.getCurrentWindow( ).maximize( ) : app.remote.getCurrentWindow( ).unmaximize( ) );
});

$(".closeWindow").click(function( ) {
    app.remote.getCurrentWindow( ).close( );
});

$(document).on("click", "a[href^=\"http\"]", function(event) {
    event.preventDefault( );
	
    app.shell.openExternal(this.href);
});