const app = require('electron');
const path = require('path');
const url = require('url');

const Store = require('electron-store');
const store = new Store();
const dateFormat = require('dateformat');

var classroom;
var student;
var points;
var students;

/*
 *	EVENTS
 */
$(".minimizeWindow").click(function() {
    app.remote.getCurrentWindow().minimize();
});

$(".maximizeWindow").click(function() {
    (!app.remote.getCurrentWindow().isMaximized() ? app.remote.getCurrentWindow().maximize() : app.remote.getCurrentWindow().unmaximize());
});

$(".closeWindow").click(function() {
    app.remote.getCurrentWindow().close();
});

$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    app.shell.openExternal(this.href);
});

$(document).on("click", ".addPoints", function() {
	classroom = $(this).attr("data-class");
	student = $(this).attr("data-student");
	store.set("classes." + classroom + ".students." + student, store.get("classes." + classroom + ".students." + student) + 1);
	$(".classes ." + classroom + " .students ." + student + " .points").text(parseInt($(".classes ." + classroom + " .students ." + student + " .points").text()) + 1);
	$(".classes ." + classroom + " .total-points").text(parseInt($(".classes ." + classroom + " .total-points").text()) + 1);
});

$(document).on("click", ".removePoints", function() {
	classroom = $(this).attr("data-class");
	student = $(this).attr("data-student");	
	store.set("classes." + classroom + ".students." + student, store.get("classes." + classroom + ".students." + student) - 1);
	$(".classes ." + classroom + " .students ." + student + " .points").text(parseInt($(".classes ." + classroom + " .students ." + student + " .points").text()) - 1);
	$(".classes ." + classroom + " .total-points").text(parseInt($(".classes ." + classroom + " .total-points").text()) - 1);
});

$(document).on("click", ".addStudent", function() {
	classroom = $(this).attr("data-class");
	student = $(".classes ." + $(this).attr("data-class") + " .addStudentInput").val();
	$(".classes ." + $(this).attr("data-class") + " .addStudentInput").val("");
	if(student != "" && !store.has("classes." + classroom + ".students." + replaceAll(student, " ", "-")) && /^[\w\-\s]+$/.test(student)) {
		store.set("classes." + classroom + ".students." + replaceAll(student, " ", "-"), 0);
		$(".classes ." + classroom + " .total-students").text(parseInt($(".classes ." + classroom + " .total-students").text()) + 1);
		if(parseInt($(".classes ." + classroom + " .total-students").text()) == 1) {
			$(".classes ." + classroom + " .students").empty();
		}
		$(".classes ." + classroom + " .students").append("<tr class=\"" + replaceAll(student, " ", "-") + "\">" +
			"<td>" + student + "</td>" +
			"<td class=\"points text-right\">0</td>" +
				"<td class=\"text-right\"><span class=\"btn btn-neutral addPoints\" data-class=\"" + classroom + "\" data-student=\"" + replaceAll(student, " ", "-") + "\"><i class=\"fa fa-chevron-up\"></i></span></td>" +
				"<td class=\"text-right\"><span class=\"btn btn-neutral removePoints\" data-class=\"" + classroom + "\" data-student=\"" + replaceAll(student, " ", "-") + "\"><i class=\"fa fa-chevron-down\"></i></span></td>" +
				"<td class=\"text-right\"><span class=\"btn btn-danger removeStudent\" data-class=\"" + classroom + "\" data-student=\"" + replaceAll(student, " ", "-") + "\"><i class=\"fa fa-times\"></i></span></td>" +
		"</tr>");
	}
});

$(document).on("click", ".removeStudent", function() {
	classroom = $(this).attr("data-class");
	student = $(this).attr("data-student");
	$(".classes ." + classroom + " .students ." + student).remove();
	$(".classes ." + classroom + " .total-students").text(parseInt($(".classes ." + classroom + " .total-students").text()) - 1);
	$(".classes ." + classroom + " .total-points").text(parseInt($(".classes ." + classroom + " .total-points").text()) - store.get("classes." + classroom + ".students." + student));
	store.delete("classes." + classroom + ".students." + student);
	if(parseInt($(".classes ." + classroom + " .total-students").text()) == 0) {
		$(".classes ." + classroom + " .students").append("<tr>" +
			"<td>No students have been added to this class.</td>" +
			"<td class=\"text-right\">-</td>" +
			"<td class=\"text-right\">-</td>" +
			"<td class=\"text-right\">-</td>" +
			"<td class=\"text-right\">-</td>" +
		"</tr>");
	}
});

$(document).on("click", ".addClass", function() {
	$(".spoiler").hide();
	classroom = $(".main .addClassInput").val();
	$(".main .addClassInput").val("");
	if(!store.has("classes." + replaceAll(classroom, " ", "-") + ".status") && /^[\w\-\s]+$/.test(classroom) && classroom != "") {
		store.set("classes." + replaceAll(classroom, " ", "-") + ".status", true);
		store.set("classes." + replaceAll(classroom, " ", "-") + ".creation", Date.now());
		$(".count").text(parseInt($(".count").text()) + 1);
		$(".classes").append("<div class=\"card card-slim " + replaceAll(classroom, " ", "-") + "\">" +
			"<div class=\"card-title\">" +
				"<span class=\"name\">" + classroom + "</span> <span class=\"btn btn-title btn-success\"><span class=\"total-students\">0</span> students</span> <span class=\"btn btn-title btn-success\"><span class=\"total-points\">0</span> points</span> <span class=\"btn btn-title btn-neutral spoiler-btn\" data-spoiler-id=\"spoiler-" + replaceAll(classroom, " ", "-") + "\" data-spoiler-value=\"active\">Close</span> <span class=\"btn btn-title btn-danger removeClass\" data-class=\"" + replaceAll(classroom, " ", "-") + "\">Remove</span>" +
			"</div>" +
			"<div class=\"spoiler\" id=\"spoiler-" + replaceAll(classroom, " ", "-") + "\">" +
				"<div class=\"card-content\">" +
					"Created on " + dateFormat(Date.now(), 'mmmm dS, yyyy') +
				"</div>" +
				"<div class=\"table-wrapper\">" +
					"<table>" +
						"<thead>" +
							"<tr>" + 
								"<th>Student</td>" +
								"<th class=\"text-right\">Points</td>" +
								"<th class=\"text-right\">Add Points</td>" +
								"<th class=\"text-right\">Subtract Points</td>" +
								"<th class=\"text-right\">Remove Student</td>" +
							"</tr>" +
						"</thead>" +
						"<tbody class=\"students\">" +
							"<tr>" +
								"<td>No students have been added to this class.</td>" +
								"<td class=\"text-right\">-</td>" +
								"<td class=\"text-right\">-</td>" +
								"<td class=\"text-right\">-</td>" +
								"<td class=\"text-right\">-</td>" +
							"</tr>" +
						"</tbody>" +
					"</table>" +
				"</div>" +
				"<div class=\"card-title\"><b>Add Student</b></div>" +
				"<div class=\"card-content\">" +
					"<input placeholder=\"John Smith\" type=\"text\" class=\"addStudentInput\" maxlength=\"100\" /> <span class=\"btn btn-neutral btn-title addStudent\" data-class=\"" + replaceAll(classroom, " ", "-") + "\">Create</span>" +
				"</div>" +
			"</div>" +
		"</div>");
	}
});

$(document).on("click", ".removeClass", function() {
	classroom = $(this).attr("data-class");
	store.delete("classes." + classroom);
	$(".classes ." + classroom).remove();
	$(".count").text(parseInt($(".count").text()) - 1);
});

$(document).on("click", ".spoiler-btn", function() {
	$(".spoiler").hide();
	if($(this).attr("data-spoiler-value") == "inactive") {
		$(this).attr("data-spoiler-value", "active");
		$("#" + $(this).attr("data-spoiler-id")).show();
		$(this).text("Close");
	} else {
		$(this).attr("data-spoiler-value", "inactive");
		$("#" + $(this).attr("data-spoiler-id")).hide();
		$(this).text("View");
	}
});

/*
 *	BONUS POINT
 */
function page() {
	$(".classes").empty();
	if(store.get("classes") === undefined) {
		$(".count").text(0);
	} else {
		$(".count").text(Object.keys(store.get("classes")).length);
	}
	$.each(store.get("classes"), function(index, value) {
		if(store.get("classes." + index + ".students") == undefined) {
			students = 0;
		} else {
			students = Object.keys(store.get("classes." + index + ".students")).length;
		}
		local = "<div class=\"card card-slim " + index + "\">" +
			"<div class=\"card-title\">" +
				"<span class=\"name\">" + replaceAll(index, "-", " ") + "</span> <span class=\"btn btn-title btn-success\"><span class=\"total-students\">" + students + "</span> students</span> <span class=\"btn btn-title btn-success\"><span class=\"total-points\"></span> points</span> <span class=\"btn btn-title btn-neutral spoiler-btn\" data-spoiler-id=\"spoiler-" + index + "\" data-spoiler-value=\"inactive\">View</span> <span class=\"btn btn-title btn-danger removeClass\" data-class=\"" + index + "\">Remove</span>" +
			"</div>" +
			"<div class=\"spoiler\" id=\"spoiler-" + index + "\">" +
				"<div class=\"card-content\">" +
					"Created on " + dateFormat(value.creation, 'mmmm dS, yyyy') +
				"</div>" +
				"<div class=\"table-wrapper\">" +
					"<table>" +
						"<thead>" +
							"<tr>" + 
								"<th>Students</td>" +
								"<th class=\"text-right\">Points</td>" +
								"<th class=\"text-right\">Add Points</td>" +
								"<th class=\"text-right\">Subtract Points</td>" +
								"<th class=\"text-right\">Remove Student</td>" +
							"</tr>" +
						"</thead>" +
						"<tbody class=\"students\">";
				points = 0;
				$.each(value.students, function(student, point) {
					points += point;
					local += "<tr class=\"" + student + "\">" +
						"<td>" + replaceAll(student, "-", " ") + "</td>" +
						"<td class=\"points text-right\">" + point + "</td>" +
						"<td class=\"text-right\"><span class=\"btn btn-neutral addPoints\" data-class=\"" + index + "\" data-student=\"" + student + "\"><i class=\"fa fa-chevron-up\"></i></span></td>" +
						"<td class=\"text-right\"><span class=\"btn btn-neutral removePoints\" data-class=\"" + index + "\" data-student=\"" + student + "\"><i class=\"fa fa-chevron-down\"></i></span></td>" +
						"<td class=\"text-right\"><span class=\"btn btn-danger removeStudent\" data-class=\"" + index + "\" data-student=\"" + student + "\"><i class=\"fa fa-times\"></i></span></td>" +
					"</tr>";
				});
				if(students == 0) {
					local += "<tr>" +
						"<td>No students have been added to this class.</td>" +
						"<td class=\"text-right\">-</td>" +
						"<td class=\"text-right\">-</td>" +
						"<td class=\"text-right\">-</td>" +
						"<td class=\"text-right\">-</td>" +
					"</tr>";
				}
				local += "</tbody>" +
					"</table>" +
				"</div>" +
				"<div class=\"card-title\"><b>Add Student</b></div>" +
				"<div class=\"card-content\">" +
					"<input placeholder=\"John Smith\" type=\"text\" class=\"addStudentInput\" maxlength=\"100\" /> <span class=\"btn btn-neutral btn-title addStudent\" data-class=\"" + index + "\">Create</span>" +
				"</div>" +
			"</div>" +
		"</div>";
		$(".classes").append(local);
		$(".classes ." + index + " .total-points").text(points);
	});
	$(".spoiler").hide();
}

/*
 *	TOOLS
 */
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/*
 *	LOAD
 */
page();




