//
//	VARIABLES
//
const fs = require("fs");
const Store = require("electron-store");
const store = new Store();

const NONE = "";

//
//	FUNCTIONS
// 
function getClasses() {
	if(Object.keys(store.get("bonus-point.classes")).length > 0) {
		$.each(store.get("bonus-point.classes"), function(index, value) {
			loadClass(index);
		});
	} else {
		fs.readFile("www/templates/no-classes.txt", "utf-8", function(error, data) {
			$(".classes").html(data);
		});
	}
}

function loadClass(id) {
	var current = store.get("bonus-point.classes." + id), points = 0;
	if(store.get("bonus-point.classes." + id + ".students")) {
		$.each(store.get("bonus-point.classes"), function(index, value) {
			points = points + value.points;
		});
	}
	fs.readFile("www/templates/classes.txt", "utf-8", function(error, data) {
		data = data.replace("{{id}}", id).replace("{{name}}", current.name).replace("{{points}}", points + " Points");
		if($(".no-classes").length > 0) $(".classes").html(data);
		else $(".classes").append(data);
	});
}

function updateClass(id, name) {
	store.set("bonus-point.classes." + id + ".name", name);
	$(".classes li[data-class='" + id + "'] .name").text(name);
}

function deleteClass(id) {
	store.delete("bonus-point.classes." + id);
	$(".content").removeAttr("data-class").empty();
	$("li[data-class='" + id + "']").remove();
}

function selectClass(id) {
	var current = store.get("bonus-point.classes." + id), points = 0;
	if(store.get("bonus-point.classes." + id + ".students")) {
		$.each(store.get("bonus-point.classes"), function(index, value) {
			points = points + value.points;
		});
	}
	fs.readFile("www/templates/class.txt", "utf-8", function(error, data) {
		$(".content").html(data.replace("{{name}}", current.name).replace("{{points}}", points + " Points")).attr("data-class", id);
	});
}

function createClass(id, name) {
	store.set("bonus-point.classes." + id, {name: name});
	loadClass(id);
}

//
//	EVENTS
//
$(document).ready(function() {
	getClasses();
});

$(document).on("click", ".createClass", function() {
	createClass(Date.now(), "New class");
});

$(document).on("click", ".deleteClass", function() {
	deleteClass($(".content").attr("data-class"));
	if($(".classes").is(":empty")) {
		
		fs.readFile("www/templates/no-classes.txt", "utf-8", function(error, data) {
			$(".classes").append(data);
		});
	}
});

$(document).on("input", ".content .title h2", function() {
	updateClass($(this).closest("[data-class]").attr("data-class"), $(this).text() == NONE ? "New class" : $(this).text());
});

$(document).on("click", ".classes li", function() {
	if($(this).is("[data-class]")) selectClass($(this).attr("data-class"));
});

$(document).on("focusout", ".content .title h2", function() {
	if($(this).text() == NONE) $(this).text("New class");
});




