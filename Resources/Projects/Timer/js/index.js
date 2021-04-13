function getElem(id){
	return document.getElementById(id);
}
function digitConfig(digit){
	if(digit<10){
		return '0'+digit;
	}
	return digit;
}
	function beginClock(){
	var date=new Date();
	var hourElem=date.getHours();
	var minuteElem=date.getMinutes();
	var secondElem=date.getSeconds();
	//var myClock=getElem('myClock');
	//myClock.setAttribute('datetime',date.toUTCString());

	var hourTen = Math.trunc(hourElem / 10);
	var hourOne = hourElem - hourTen * 10; 

	var minuteTen = Math.trunc(minuteElem / 10);
	var minuteOne = minuteElem - minuteTen * 10;

	var secondTen = Math.trunc(secondElem / 10);
	var secondOne = secondElem - secondTen * 10;

	document.getElementById("hourten").innerHTML = hourTen;
	document.getElementById("hourone").innerHTML = hourOne;
	
	document.getElementById("minuteten").innerHTML = minuteTen;
	document.getElementById("minuteone").innerHTML = minuteOne;
	
	document.getElementById("secondten").innerHTML = secondTen;
	document.getElementById("secondone").innerHTML = secondOne;
	// hourElem.innerHTML=digitConfig(date.getHours());
	// minuteElem.innerHTML=digitConfig(date.getMinutes());
	// secondElem.innerHTML=digitConfig(date.getSeconds());
}
			beginClock();
			setInterval('beginClock()',500);