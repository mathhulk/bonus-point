//
//	VARIABLES
//
const fs = require("fs");
const Store = require("electron-store");
const store = new Store();

//
//	FUNCTIONS
// 
function getClasses() {
	var classMultiple = store.get("bonus-point.classes");
	if(classMultiple && Object.keys(classMultiple).length > 0) {
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
	var classSingle = store.get("bonus-point.classes." + id), points = 0;
	if(classSingle.students && Object.keys(classSingle.students).length > 0) {
		$.each(classSingle.students, function(index, value) {
			points = points + value.points;
		});
	}
	fs.readFile("www/templates/classes.txt", "utf-8", function(error, data) {
		data = data.replace("{{id}}", id).replace("{{name}}", clean(classSingle.name)).replace("{{points}}", points + " Points");
		if($(".no-classes").length > 0) {
			$(".classes").html(data);
		} else {
			$(".classes").append(data);
		}
	});
}

function loadStudent(id) {
	var student = store.get("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id);
	fs.readFile("www/templates/students.txt", "utf-8", function(error, data) {
		data = data.replace("{{id}}", id).replace("{{name}}", clean(student.name)).replace("{{points}}", student.points + " Points");
		if($(".no-students").length > 0) {
			$(".students").html(data);
		} else {
			$(".students").append(data);
		}
	});
}

function createStudent(name) {
	var id = Date.now();
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".points", 0);
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".name", name);
	loadStudent(id);
}

function updateClass(name) {
	name = name === "" ? "New class" : name;
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".name", name);
	$(".classes li[data-class='" + $(".content").attr("data-class") + "'] .name").text(name);
}

function updateStudent(id, name) {
	name = name === "" ? "New class" : name;
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".name", name);
}

function deleteStudent(id) {
	var points = Math.max(0, store.get("bonus-point.classes." + $(".content").attr("data-class") + ".points") - store.get("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".points"));
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".points", points);
	$("li[data-class='" + $(".content").attr("data-class") + "'] p.points").text(points + " Points");
	store.delete("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id);
	$("li[data-student='" + id + "']").remove();
	if($(".select").length === 0) {
		$(".controls").fadeOut(100);
	}
	if($(".students").is(":empty")) {
		fs.readFile("www/templates/no-students.txt", "utf-8", function(error, data) {
			$(".students").html(data);
		});
	}
}

function deleteClass() {
	store.delete("bonus-point.classes." + $(".content").attr("data-class"));
	$("li[data-class='" + $(".content").attr("data-class") + "']").remove();
	$(".content").removeAttr("data-class").empty();
	if($(".classes").is(":empty")) {
		fs.readFile("www/templates/no-classes.txt", "utf-8", function(error, data) {
			$(".classes").append(data);
		});
	}
}

function selectClass(id) {
	var classSingle = store.get("bonus-point.classes." + id);
	fs.readFile("www/templates/class.txt", "utf-8", function(error, data) {
		$(".content").html(data.replace("{{name}}", clean(classSingle.name))).attr("data-class", id);
		if(classSingle.students && Object.keys(classSingle.students).length > 0) {
			$.each(classSingle.students, function(index, value) {
				loadStudent(index);
			});
		} else {
			fs.readFile("www/templates/no-students.txt", "utf-8", function(error, data) {
				$(".students").html(data);
			});
		}
	});
}

function addPointStudent(id) {
	var points = store.get("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".points") + 1;
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".points", points);
	$("li[data-student='" + id + "'] p.points").text(points + " Points");
	points = store.get("bonus-point.classes." + $(".content").attr("data-class") + ".points") + 1;
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".points", points);
	$("li[data-class='" + $(".content").attr("data-class") + "'] p.points").text(points + " Points");
}

function subtractPointStudent(id) {
	var points = Math.max(0, store.get("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".points") - 1);
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".students." + id + ".points", points);
	$("li[data-student='" + id + "'] p.points").text(points + " Points");
	points = Math.max(0, store.get("bonus-point.classes." + $(".content").attr("data-class") + ".points") - 1);
	store.set("bonus-point.classes." + $(".content").attr("data-class") + ".points", points);
	$("li[data-class='" + $(".content").attr("data-class") + "'] p.points").text(points + " Points");
}

function deleteSelection() {
	$(".select").each(function() {
		deleteStudent($(this).attr("data-student"));
	});
}

function addPointSelection() {
	$(".select").each(function() {
		addPointStudent($(this).attr("data-student"));
	});
}

function subtractPointSelection() {
	$(".select").each(function() {
		subtractPointStudent($(this).attr("data-student"));
	});
}

function createClass(name) {
	var id = Date.now();
	store.set("bonus-point.classes." + id, {name: name, points: 0});
	loadClass(id);
}

function clean(text) {
	return text.replace("<", "&lt;").replace(">", "&gt;");
}

//
//	EVENTS
//
$(document).ready(function() {
	getClasses();
	
	$(document).on("click", ".createClass", function() {
		createClass("New class");
	});

	$(document).on("click", ".createStudent", function() {
		createStudent("New student");
	});

	$(document).on("click", ".deleteClass", function() {
		deleteClass();
	});
	
	$(document).on("click", ".deleteSelection", function() {
		deleteSelection();
	});
	
	$(document).on("click", ".subtractPointSelection", function() {
		subtractPointSelection();
	});
	
	$(document).on("click", ".addPointSelection", function() {
		addPointSelection();
	});
	
	$(document).on("click", ".deleteSelection", function() {
		deleteSelection();
	});

	$(document).on("input", ".content .title h2", function() {
		updateClass($(this).text());
	});

	$(document).on("input", ".students li p.name", function() {
		updateStudent($(this).closest("[data-student]").attr("data-student"), $(this).text());
	});

	$(document).on("click", ".classes li", function() {
		if($(this).is("[data-class]")) {
			selectClass($(this).attr("data-class"));
		}
	});

	$(document).on("focusout", ".content .title h2", function() {
		if($(this).text() === "") {
			$(this).text("New class");
		}
	});

	$(document).on("focusout", ".students li p.name", function() {
		if($(this).text() === "") {
			$(this).text("New student");
		}
	});
	
	$(document).on("click", ".students li:not(.no-students)", function(event) {
		if($(this).hasClass("select")) {
			$(this).removeClass("select");
		} else {
			$(this).addClass("select");
		}
		if($(".select").length > 0) {
			$(".controls").fadeIn(100);
		} else {
			$(".controls").fadeOut(100);
		}
	});
});