const path = require("path");
const system = require("fs");

let templates = { };

if( ! store.get("classes") ) store.set("classes", { });

$(document).ready(function( ) {
	getTemplates( );
	getClasses( );
	
	$(document).on("click", ".classes .stick .new", function( ) {
		createClass( );
	});
	
	$(document).on("keypress", ".classes .scroll .class h2, .open .scroll .student h2", function( ) {
		if(event.which === 13) event.preventDefault( );
	});
	
	$(document).on("click", ".classes .scroll .class", function( ) {
		if( $(this).is("[data-class]") ) loadClass( $(this).attr("data-class") );
	});

	$(document).on("input", ".classes .scroll .class h2", function( ) {
		updateClass( $(this).text( ) );
	});
	
	$(document).on("focusout", ".classes .scroll .class h2", function( ) {
		if($(this).text( ).length === 0) $(this).text("New class");
	});
	
	$(document).on("click", ".open .stick .delete", function( ) {
		deleteClass( );
	});
	
	$(document).on("click", ".open .stick .new", function( ) {
		createStudent( );
	});
	
	$(document).on("click", ".control .delete", function( ) {
		deleteSelection( );
	});
	
	$(document).on("click", ".control .subtract", function( ) {
		subtractPointSelection( );
	});
	
	$(document).on("click", ".control .add", function( ) {
		addPointSelection( );
	});
	
	$(document).on("click", ".open .scroll .student:not(.oops)", function(event) {
		$(this).toggleClass("selected");
		
		if($(".open .scroll .student.selected").length > 0) $(".control").show( );
		else $(".control").hide( );
	});
	
	$(document).on("input", ".open .scroll .student h2", function( ) {
		updateStudent( $(this).parent( ).attr("data-student"), $(this).text( ) );
	});
	
	$(document).on("focusout", ".open .scroll .student h2", function( ) {
		if($(this).text( ).length === 0) $(this).text("New student");
	});
});

function getTemplates( ) {
	let files = system.readdirSync( path.join(__dirname, "resources", "templates") );
	
	$.each(files, function(index, value) {
		templates[value.slice(0, -4)] = system.readFileSync(path.join(__dirname, "resources", "templates",  value), "utf-8");
	});
}

function replace(template, data) {
	$.each(data, function(index, value) {
		template = template.replace("{{ " + index + " }}", value);
	});
	
	return template;
} 

function getClasses( ) {
	let classes = store.get("classes");
	
	if(Object.keys(classes).length > 0) {
		$.each(alphabetical(classes), function(index, value) {
			getClass(index, value);
		});
	} else {
		$(".classes .scroll").html(templates["no-classes"]);
	}
}

function getClass(index) {
	let classes = store.get("classes");
	
	let template = replace(templates["classes"], {id: index, name: classes[index].name, points: classes[index].points + " Points"});
	
	if($(".classes .scroll .class.oops").length > 0) $(".classes .scroll").html(template);
	else $(".classes .scroll").append(template);
}

function updateClass(name) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let classes = store.get("classes");
	classes[index].name = standard(name, "New class");
	store.set("classes", classes);
}

function deleteClass( ) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let classes = store.get("classes");
	delete classes[index];
	store.set("classes", classes);
	
	$(".classes .scroll .class[data-class='" + index + "']").remove( );
	
	if( $(".classes .scroll .class").length === 0 ) $(".classes .scroll").html(templates["no-classes"]);
	
	$(".open").empty( );
	$(".control").hide( );
}

function createClass( ) {
	let index = Date.now( );
	
	let classes = store.get("classes");
	classes[index] = { name: "New class", points: 0, students: { } };
	store.set("classes", classes);
	
	getClass(index);
}

function loadClass(index) {
	let classes = store.get("classes");
	
	$(".classes .scroll .class").removeClass("selected");
	$(".classes .scroll .class[data-class='" + index + "']").addClass("selected");
	
	$(".open").html(templates["class"]);
	
	if(Object.keys(classes[index].students).length > 0) {
		$.each(alphabetical(classes[index].students), function(studentIndex, value) {
			getStudent(studentIndex);
		});
	} else {
		$(".open .scroll").html(templates["no-students"]);
	}
}

function getStudent(studentIndex) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let classes = store.get("classes");
	
	let template = replace(templates["students"], {id: studentIndex, name: classes[index].students[studentIndex].name, points: classes[index].students[studentIndex].points + " Points"});
	
	if($(".open .scroll .student.oops").length > 0) $(".open .scroll").html(template);
	else $(".open .scroll").append(template);
}

function createStudent( ) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let studentIndex = Date.now( );
	
	let classes = store.get("classes");
	classes[index].students[studentIndex] = {name: "New student", points: 0};
	store.set("classes", classes);
	
	getStudent(studentIndex);
}

function updateStudent(studentIndex, name) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let classes = store.get("classes");
	classes[index].students[studentIndex].name = standard(name, "New student");
	store.set("classes", classes);
}

function deleteStudent(studentIndex) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let classes = store.get("classes");
	classes[index].points = classes[index].points - classes[index].students[studentIndex].points;
	
	$(".classes .scroll .class.selected p").text(classes[index].points + " Points");
	
	delete classes[index].students[studentIndex];
	store.set("classes", classes);
	
	$(".open .scroll .student[data-student='" + studentIndex + "']").remove( );
	
	if( $(".open .scroll .student").length === 0 ) $(".open .scroll").html(templates["no-students"]);
	
	$(".control").hide( );
}

function addPointStudent(studentIndex) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let classes = store.get("classes");
	classes[index].points++;
	classes[index].students[studentIndex].points++;
	
	$(".classes .scroll .class.selected p").text(classes[index].points + " Points");
	$(".open .scroll .student[data-student='" + studentIndex + "'] p").text(classes[index].students[studentIndex].points + " Points");
	
	store.set("classes", classes);
}

function subtractPointStudent(studentIndex) {
	let index = $(".classes .scroll .class.selected").attr("data-class");
	
	let classes = store.get("classes");
	classes[index].points = classes[index].points - 1;
	classes[index].students[studentIndex].points = classes[index].students[studentIndex].points - 1;
	
	$(".classes .scroll .class.selected p").text(classes[index].points + " Points");
	$(".open .scroll .student[data-student='" + studentIndex + "'] p").text(classes[index].students[studentIndex].points + " Points");
	
	store.set("classes", classes);
}

function deleteSelection( ) {
	$(".open .scroll .student.selected").each(function( ) {
		deleteStudent( $(this).attr("data-student") );
	});
}

function addPointSelection( ) {
	$(".open .scroll .student.selected").each(function( ) {
		addPointStudent( $(this).attr("data-student") );
	});
}

function subtractPointSelection(classSingle) {
	$(".open .scroll .student.selected").each(function( ) {
		subtractPointStudent( $(this).attr("data-student") );
	});
}

function standard(name, placeholder) {
	return name.length === 0 ? placeholder : name;
}

function clean(name) {
	return name.replace("<", "&lt;").replace(">", "&gt;");
}

function alphabetical(classes) {
	let line = [ ];
	let sorted = { };
	
	$.each(classes, function(index, value) {
		line.push({id: index, data: value});
	});
	
	line.sort(function(current, next) {
		if(current.data.name < next.data.name) return -1;
		
		if(current.data.name > next.data.name) return 1;
		
		return 0;
	});
	
	$.each(line, function(index, value) {
		sorted[value.id] = value.data;
	});
	
	return sorted;
}