// VARIABLES
const fs = require("fs");
const Store = require("electron-store");
const store = new Store( );

var configuration = define(store.get("bonus-point"), {classes: { }});

// FUNCTIONS
async function saveConfiguration( ) {
	store.set("bonus-point", configuration);
}

function getClasses( ) {
	if(configuration.classes && Object.keys(configuration.classes).length > 0) {
		$.each(alphabetical(configuration.classes), function(index, value) {
			loadClass(index);
		});
	} else {
		fs.readFile("www/templates/no-classes.txt", "utf-8", function(error, data) {
			$(".classes").html(data);
		});
	}
}

function loadClass(id) {
	fs.readFile("www/templates/classes.txt", "utf-8", function(error, data) {
		data = data.replace("{{id}}", id).replace("{{name}}", clean(configuration.classes[id].name)).replace("{{points}}", configuration.classes[id].points + " Points");
		if($(".no-classes").length > 0) $(".classes").html(data);
		else $(".classes").append(data);
	});
}

function updateClass(id, name) {
	configuration.classes[id].name = name;
	$(".classes li[data-class='" + id + "'] .name").text(name);
}

function deleteClass(id) {
	delete configuration.classes[id];
	$("li[data-class='" + id + "']").remove( );
	$(".content").removeAttr("data-class").empty( );
	$(".controls").hide( );
	if($(".classes").is(":empty")) {
		fs.readFile("www/templates/no-classes.txt", "utf-8", function(error, data) {
			$(".classes").append(data);
		});
	}
}

function createClass(id, name) {
	configuration.classes[id] = {name: name, points: 0, students: { }};
	loadClass(id);
}

function selectClass(id) {
	fs.readFile("www/templates/class.txt", "utf-8", function(error, data) {
		$(".content").html(data.replace("{{name}}", clean(configuration.classes[id].name))).attr("data-class", id);
		if(configuration.classes[id].students && Object.keys(configuration.classes[id].students).length > 0) {
			$.each(alphabetical(configuration.classes[id].students), function(index, value) {
				loadStudent(id, index);
			});
		} else {
			fs.readFile("www/templates/no-students.txt", "utf-8", function(error, data) {
				$(".students").html(data);
			});
		}
	});
}

function loadStudent(classSingle, id) {
	fs.readFile("www/templates/students.txt", "utf-8", function(error, data) {
		data = data.replace("{{id}}", id).replace("{{name}}", clean(configuration.classes[classSingle].students[id].name)).replace("{{points}}", configuration.classes[classSingle].students[id].points + " Points");
		if($(".no-students").length > 0) $(".students").html(data);
		else $(".students").append(data);
	});
}

function createStudent(classSingle, id, name) {
	configuration.classes[classSingle].students[id] = {name: name, points: 0};
	loadStudent(classSingle, id);
}

function updateStudent(classSingle, id, name) {
	configuration.classes[classSingle].students[id].name = name;
}

function deleteStudent(classSingle, id) {
	configuration.classes[classSingle].points = configuration.classes[classSingle].points - configuration.classes[classSingle].students[id].points;
	delete configuration.classes[classSingle].students[id];
	$("li[data-class='" + classSingle + "'] p.points").text(configuration.classes[classSingle].points + " Points");
	$("li[data-student='" + id + "']").remove( );
	$(".controls").hide( );
	if($(".students").is(":empty")) {
		fs.readFile("www/templates/no-students.txt", "utf-8", function(error, data) {
			$(".students").html(data);
		});
	}
}

function addPointStudent(classSingle, id) {
	configuration.classes[classSingle].students[id].points++;
	configuration.classes[classSingle].points++;
	$("li[data-student='" + id + "'] p.points").text(configuration.classes[classSingle].students[id].points + " Points");
	$("li[data-class='" + classSingle + "'] p.points").text(configuration.classes[classSingle].points + " Points");
}

function subtractPointStudent(classSingle, id) {
	configuration.classes[classSingle].students[id].points = Math.max(0, configuration.classes[classSingle].students[id].points - 1);
	configuration.classes[classSingle].points = Math.max(0, configuration.classes[classSingle].points - 1);
	$("li[data-student='" + id + "'] p.points").text(configuration.classes[classSingle].students[id].points + " Points");
	$("li[data-class='" + classSingle + "'] p.points").text(configuration.classes[classSingle].points + " Points");
}

function deleteSelection(classSingle) {
	$(".select").each(function() {
		deleteStudent(classSingle, $(this).attr("data-student"));
	});
}

function addPointSelection(classSingle) {
	$(".select").each(function() {
		addPointStudent(classSingle, $(this).attr("data-student"));
	});
}

function subtractPointSelection(classSingle) {
	$(".select").each(function() {
		subtractPointStudent(classSingle, $(this).attr("data-student"));
	});
}

function clean(string) {
	return string.replace("<", "&lt;").replace(">", "&gt;");
}

function set(string, standard) {
	if(string === "") return standard;
	return string;
}

function define(object, standard) {
	if(object) return object;
	return standard
}

function alphabetical(list) {
	let sortable = [], sorted = {};
	$.each(list, function(index, value) {
		sortable.push({id: index, data: value});
	});
	sortable.sort(function(current, next) {
		if(current.data.name < next.data.name) return -1;
		if(current.data.name > next.data.name) return 1;
		return 0;
	});
	$.each(sortable, function(index, value) {
		sorted[value.id] = value.data;
	});
	return sorted;
}

// EVENTS
$(document).ready(function( ) {
	setInterval(saveConfiguration, 500);
	$(".controls").css("right", $(".content").width( ) / 2 - $(".controls").width( ) / 2);
	getClasses( );
	
	$(window).on("resize", function( ) {
		$(".controls").css("right", $(".content").width( ) / 2 - $(".controls").width( ) / 2);
	});
	
	$(document).on("click", ".createClass", function( ) {
		createClass(Date.now( ), "New class");
	});
	
	$(document).on("click", ".deleteClass", function( ) {
		deleteClass($(".content").attr("data-class"));
	});
	
	$(document).on("click", ".classes li", function( ) {
		if($(this).is("[data-class]")) selectClass($(this).attr("data-class"));
	});
	
	$(document).on("click", ".createStudent", function( ) {
		createStudent($(".content").attr("data-class"), Date.now(), "New student");
	});
	
	$(document).on("click", ".deleteSelection", function( ) {
		deleteSelection($(".content").attr("data-class"));
	});
	
	$(document).on("click", ".subtractPointSelection", function( ) {
		subtractPointSelection($(".content").attr("data-class"));
	});
	
	$(document).on("click", ".addPointSelection", function( ) {
		addPointSelection($(".content").attr("data-class"));
	});
	
	$(document).on("click", ".students li:not(.no-students)", function(event) {
		if($(this).hasClass("select")) $(this).removeClass("select");
		else $(this).addClass("select");
		if($(".select").length > 0) $(".controls").show( );
		else $(".controls").hide( );
	});

	$(document).on("input", ".content .title h2", function( ) {
		updateClass($(".content").attr("data-class"), validate($(this).text( ), "New class"));
	});
	
	$(document).on("input", ".students li p.name", function( ) {
		updateStudent($(".content").attr("data-class"), $(this).closest("[data-student]").attr("data-student"), validate($(this).text( ), "New student"));
	});
	
	$(document).on("focusout", ".content .title h2", function( ) {
		if($(this).text( ) === "") $(this).text("New class");
	});
	
	$(document).on("focusout", ".students li p.name", function( ) {
		if($(this).text( ) === "") $(this).text("New student");
	});
});