let operation = '';

function clearCalc() { 
	operation = ''; 
	document.getElementById("calcoutput").innerHTML = "";
}

function calculate() { 
	try {
	eval(operation) 
	} catch (TypeError) {
	document.getElementById("calcoutput").innerHTML = "ERR";
	operation = '';
	}
	document.getElementById("calcoutput").innerHTML = eval(operation);
	operation = '';
}

function addValue(value) {
	if (['*', '/', '+', '-'].includes(value)) {
		operation = operation + " " + value + " ";
		document.getElementById("calcoutput").innerHTML = operation;
	}
	else {
		operation = operation + value.toString();
		document.getElementById("calcoutput").innerHTML = operation;
	}
}