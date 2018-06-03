/*
 *	VARIABLES
 */
const fs = require("fs");
const Store = require("electron-store");
const store = new Store();

/*
 *	FUNCTIONS
 */
function getClasses() {
	var classMultiple = store.get("bonus-point.classes");
	if(classMultiple && Object.keys(classMultiple).length > 0) {
		classMultiple = alphabetical(classMultiple);
		$.each(classMultiple, function(index, value) {
			loadClass(index);
		});
	} else {
		fs.readFile("www/templates/no-classes.txt", "utf-8", function(error, data) {
			$(".classes").html(data);
		});
	}
}
function loadClass(id) {
	var classSingle = store.get("bonus-point.classes." + id);
	fs.readFile("www/templates/classes.txt", "utf-8", function(error, data) {
		data = data.replace("{{id}}", id).replace("{{name}}", clean(classSingle.name)).replace("{{points}}", classSingle.points + " Points");
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
	$("li[data-class='" + id + "']").remove();
	$(".content").removeAttr("data-class").empty();
	$(".controls").hide();
	if($(".classes").is(":empty")) {
		fs.readFile("www/templates/no-classes.txt", "utf-8", function(error, data) {
			$(".classes").append(data);
		});
	}
}
function createClass(id, name) {
	store.set("bonus-point.classes." + id, {name: name, points: 0});
	loadClass(id);
}
function selectClass(id) {
	var classSingle = store.get("bonus-point.classes." + id);
	fs.readFile("www/templates/class.txt", "utf-8", function(error, data) {
		$(".content").html(data.replace("{{name}}", clean(classSingle.name))).attr("data-class", id);
		if(classSingle.students && Object.keys(classSingle.students).length > 0) {
			classSingle.students = alphabetical(classSingle.students);
			$.each(classSingle.students, function(index, value) {
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
	var student = store.get("bonus-point.classes." + classSingle + ".students." + id);
	fs.readFile("www/templates/students.txt", "utf-8", function(error, data) {
		data = data.replace("{{id}}", id).replace("{{name}}", clean(student.name)).replace("{{points}}", student.points + " Points");
		if($(".no-students").length > 0) $(".students").html(data);
		else $(".students").append(data);
	});
}
function createStudent(classSingle, id, name) {
	store.set("bonus-point.classes." + classSingle + ".students." + id, {name: name, points: 0});
	loadStudent(classSingle, id);
}
function updateStudent(classSingle, id, name) {
	store.set("bonus-point.classes." + classSingle + ".students." + id + ".name", name);
}
function deleteStudent(classSingle, id) {
	var points = store.get("bonus-point.classes." + classSingle + ".points") - store.get("bonus-point.classes." + classSingle + ".students." + id + ".points");
	store.set("bonus-point.classes." + classSingle + ".points", points);
	store.delete("bonus-point.classes." + classSingle + ".students." + id);
	$("li[data-class='" + classSingle + "'] p.points").text(points + " Points");
	$("li[data-student='" + id + "']").remove();
	$(".controls").hide();
	if($(".students").is(":empty")) {
		fs.readFile("www/templates/no-students.txt", "utf-8", function(error, data) {
			$(".students").html(data);
		});
	}
}
function addPointStudent(classSingle, id) {
	var points = store.get("bonus-point.classes." + classSingle + ".students." + id + ".points") + 1;
	store.set("bonus-point.classes." + classSingle + ".students." + id + ".points", points);
	$("li[data-student='" + id + "'] p.points").text(points + " Points");
	points = store.get("bonus-point.classes." + classSingle + ".points") + 1;
	store.set("bonus-point.classes." + classSingle + ".points", points);
	$("li[data-class='" + classSingle + "'] p.points").text(points + " Points");
}
function subtractPointStudent(classSingle, id) {
	var points = Math.max(0, store.get("bonus-point.classes." + classSingle + ".students." + id + ".points") - 1);
	store.set("bonus-point.classes." + classSingle + ".students." + id + ".points", points);
	$("li[data-student='" + id + "'] p.points").text(points + " Points");
	points = Math.max(0, store.get("bonus-point.classes." + classSingle + ".points") - 1);
	store.set("bonus-point.classes." + classSingle + ".points", points);
	$("li[data-class='" + classSingle + "'] p.points").text(points + " Points");
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

function clean(text) {
	return text.replace("<", "&lt;").replace(">", "&gt;");
}

function validate(text, placeholder) {
	if(text === "") return placeholder;
	return text;
}

function alphabetical(list) {
	var sortable = [], sorted = {};
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

/*
 *	EVENTS
 */
$(document).ready(function() {
	$(".controls").css("right", $(".content").width() / 2 - $(".controls").width() / 2);
	getClasses();
	
	$(window).on("resize", function() {
		$(".controls").css("right", $(".content").width() / 2 - $(".controls").width() / 2);
	});
	
	$(document).on("click", ".createClass", function() {
		createClass(Date.now(), "New class");
	});
	$(document).on("click", ".deleteClass", function() {
		deleteClass($(".content").attr("data-class"));
	});
	$(document).on("click", ".classes li", function() {
		if($(this).is("[data-class]")) selectClass($(this).attr("data-class"));
	});
	
	$(document).on("click", ".createStudent", function() {
		createStudent($(".content").attr("data-class"), Date.now(), "New student");
	});
	
	$(document).on("click", ".deleteSelection", function() {
		deleteSelection($(".content").attr("data-class"));
	});
	$(document).on("click", ".subtractPointSelection", function() {
		subtractPointSelection($(".content").attr("data-class"));
	});
	$(document).on("click", ".addPointSelection", function() {
		addPointSelection($(".content").attr("data-class"));
	});
	$(document).on("click", ".students li:not(.no-students)", function(event) {
		if($(this).hasClass("select")) $(this).removeClass("select");
		else $(this).addClass("select");
		
		if($(".select").length > 0) $(".controls").show();
		else $(".controls").hide();
	});

	$(document).on("input", ".content .title h2", function() {
		updateClass($(".content").attr("data-class"), validate($(this).text(), "New class"));
	});
	$(document).on("input", ".students li p.name", function() {
		updateStudent($(".content").attr("data-class"), $(this).closest("[data-student]").attr("data-student"), validate($(this).text(), "New student"));
	});
	$(document).on("focusout", ".content .title h2", function() {
		if($(this).text() === "") $(this).text("New class");
	});
	$(document).on("focusout", ".students li p.name", function() {
		if($(this).text() === "") $(this).text("New student");
	});
});