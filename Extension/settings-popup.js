var geheimPopupEl = null;
var geheimPopupTarget = null;

function geheimPopup(target, settings)
{
	geheimPopupEl = document.getElementById("geheim-popup");
	geheimPopupTarget = target;
	geheimPopupEl.style.display = "inline";
	// Show existing keys	
	var existingKeys = document.querySelector("#geheim-popup #keys");
	settings.methods.sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function (method)
	{
		var methodEl = document.createElement("li");
		methodEl.className = "method";
		methodEl.innerHTML = method.name;
		existingKeys.appendChild(methodEl);
		settings.keys.filter(k => k.methodid == method.id).sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function (key)
		{
			var keyEl = document.createElement("li");
			keyEl.className = "key";
			keyEl.innerHTML = key.name;
			keyEl.setAttribute("geheimdialog", true);
			keyEl.setAttribute("methodid", key.methodid);
			keyEl.setAttribute("keyid", key.id);
			existingKeys.appendChild(keyEl);
		});
	});
}

window.addEventListener("click", function(event)
{
	var el = event.target;
	// Dialog events
	if (el.getAttribute("geheimdialog"))
	{
		geheimPopupEl.style.display = "none";
		geheimPopupTarget.methodid = el.getAttribute("methodid");
		geheimPopupTarget.keyid = el.getAttribute("keyid");
		//el.value = el.originalValue;
		el.value = el.value;
		geheimPopupTarget.setAttribute("geheim", true);
	}
	if (el.getAttribute("geheimaddkey"))
	{
		window.postMessage({type: "FROM_PAGE", text: "AddKey"}, "*");
	}
	if (el.getAttribute("geheimsettings"))
	{
		window.postMessage({type: "FROM_PAGE", text: "OpenSettings"}, "*");
	}
	if (el.getAttribute("geheimcancel"))
	{
		geheimPopupEl.style.display = "none";
	}
});