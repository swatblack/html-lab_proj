

window.addEventListener("resize", function() {
	if (window.innerWidth <= 550) {document.getElementById("message").setAttribute("cols", "20");}
	if (window.innerWidth > 550) {document.getElementById("message").setAttribute("cols", "50");}
})

function submitComment(event){
	if (event) event.preventDefault();
	// ОСТОРОЖНО - ЗДЕСЬ АБСОЛЮТНО ОХУЕВШЕЕ ЖАНГЛИРОВАНИЕ МИЛЛИАРДА НЕПОНЯТНЫХ НАЗВАНИЙ ПЕРЕМЕННЫХ!!!!
	//распаковываем (по идее не обязательно но мне лень каждый раз писать 'fdata.')
    let fio2 = document.getElementById("fio").value;
    let avatar = document.getElementById("uploadav").files[0];
    let message = document.getElementById("message").value || document.getElementById("messagemobile").value;
	
	var avnotdefault = true;
	let familia = "";
	let imya = "";
	let otchestvo = "";
	//проверяем фио и распаковываем
	if (fio2.split(' ').length != 3) {
		alert("ФИО должно состоять из трёх слов!");
		return;
	}
	else {
		familia = fio2.split(' ')[0];
		imya = fio2.split(' ')[1];
		otchestvo = fio2.split(' ')[2];
	}
	//проверяем аву
	if (avatar) {
		if (Math.round(avatar.size/1024) > (5 * 1024)) {
			if (confirm("Размер картинки превышает 5МБ!\nИспользовать аватарку по умолчанию?")){
				avnotdefault = false;
			}
			else {
				return;
			}
		}
	}
	else {
		avnotdefault = false;
	}
	if (!message.trim()) {
		alert("Не оставляйте пустых комментариев, напишите хоть что-то!");
		return;
	}
	
	//корневой элемент коммента в котором будут приклеены все остальные элементы
	let comment = document.createElement("div");
	comment.setAttribute("class", "comment");
	
	//элемент картинки
	let avatar2 = document.createElement("img");
	avatar2.setAttribute("class", "commenticon");
	avatar2.setAttribute("width", "100");
	avatar2.setAttribute("height", "100");
	if (avnotdefault) {
		let imageUrl = URL.createObjectURL(avatar);
        avatar2.setAttribute("src", imageUrl);
	}
	else {
		avatar2.setAttribute("src", "defaultav.png");
	}
	comment.appendChild(avatar2);
	
	//элемент фио
	let namefield = document.createElement("p");
	namefield.setAttribute("class", "namefield");
	namefield.innerHTML = `Имя:${imya}<br/>Фамилия:${familia}<br/>Отчество:${otchestvo}`;
	comment.appendChild(namefield);
	
	//элемент текста (у меня уже названия для переменных кончаются, но ладно уже почти закончили)
	let agga = document.createElement("p");
	agga.setAttribute("class", "commentcontent");
	agga.innerHTML = message.replace(/\n/g, '<br>');;
	comment.appendChild(agga);
	
	//ну и наконец-то... постим.
	document.getElementById("commentcontainer").appendChild(comment);
	document.getElementById("commenting").reset();
}

function nothingButLetters(){
	var e = event || window.event;
    var key = e.key || e.which;

    if (key.search(/[^А-я ]/) != -1 && key != "Backspace") { //если в вводе есть что то кроме букв и клавиша не backspace (regex это боль) 
        if (e.preventDefault) e.preventDefault();
    }
}