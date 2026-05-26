let operation = '';

function clearCalc() 
{ 
	operation = ''; 
	document.getElementById("calcoutput").innerHTML = "";
	document.getElementById("calcoutputop").innerHTML = "";
}

function calculate() 
{
	/*
	try {
	eval(operation) 
	} catch (TypeError) {
		document.getElementById("calcoutput").innerHTML = "ERR";
		operation = '';
	}
	*/
	if (operation) //если ввод не пустой
	{ 
		if (operation.includes('*') || operation.includes('/') || operation.includes('+') || operation.includes('-')) // если ввод имеет хоть один мат операнду
			if (operation.charAt(operation.length - 1) != ' ') //если последний символ - НЕ пробел (тоесть пофакту является мат операндой)
			{
				document.getElementById("calcoutput").innerHTML = eval(operation);
				document.getElementById("calcoutputop").innerHTML = operation;
				operation = '';
			}
	}
}

function addValue(value) 
{
	
	const mathOperands = ['*', '/', '+', '-'];

	var last = operation.charAt(operation.length - 1);
	var secondlast = operation.charAt(operation.length - 2);
	var lastIsMath = mathOperands.includes(secondlast);
	
	if (mathOperands.includes(value)) //если значение - мат операнда проводим его по условиям, если хоть одно не соответствует, то ничего не делаем
	{ 
		if (!lastIsMath) //если предпоследний символ - не мат операнда
			if (last != '.') //если последний символ не десятичный разделитель
				if (operation.length != 0) //если пользователь хоть что то написал
				{
					operation = operation + " " + value + " ";
					document.getElementById("calcoutput").innerHTML = operation;
				}
	}
	else if (value == '.')
	{
		if (!last == '.' && !lastIsMath) //не добавляем точку если последний символ - точка или операнда
		{
			operation = operation + value;
		}
	}
	else if (value == '0' && operation.length == 0 || value == '0' && lastIsMath) // если пользователь пытается ввести 0 как первый символ, автоматически добавляем точку чтобы не морочиться
	{
		operation = operation + '0.';
		document.getElementById("calcoutput").innerHTML = operation;
	}
	else 
	{
		operation = operation + value;
		document.getElementById("calcoutput").innerHTML = operation;
	}
}