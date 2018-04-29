var settings = {methods: [], keys: []};

chrome.storage.sync.get(["geheimSettings"], function(data)
{
	if(data["geheimSettings"])
	{
		settings = JSON.parse(data["geheimSettings"]);
		getMethods();
		getKeys();
	}
});

function getMethods()
{
	var methodsEl = document.getElementById("methods");
	settings.methods.sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function(method)
	{
		var methodEl = document.createElement("li");
		methodEl.innerHTML = method.name;
		methodsEl.appendChild(methodEl);
	});
}

function getKeys()
{
	var keysEl = document.getElementById("keys");
	settings.methods.sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function (method)
	{
		var methodEl = document.createElement("li");
		methodEl.className = "method";
		methodEl.innerHTML = method.name;
		keysEl.appendChild(methodEl);
		settings.keys.filter(k => k.methodid == method.id).sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function (key)
		{
			var keyEl = document.createElement("li");
			keyEl.className = "key";
			keyEl.innerHTML = key.name;
			keyEl.setAttribute("geheimdialog", true);
			keyEl.setAttribute("methodid", key.methodid);
			keyEl.setAttribute("keyid", key.id);
			keysEl.appendChild(keyEl);
		});
	});
}

function saveMethod()
{
	chrome.storage.sync.set(
	{
		"geheimSettings": document.getElementById("settings").value
	});
	window.close();
}

function resetMethod()
{
	chrome.storage.sync.set(
	{
		"geheimSettings": null
	});
	window.close();
}


function cancelMethod()
{
	window.close();
}


document.addEventListener("DOMContentLoaded", function()
{
	/*
	chrome.storage.sync.get(["geheimSettings"], function(data)
	{
		if (data["geheimSettings"])
		{
			document.getElementById("settings").value = data["geheimSettings"];
		}
	});*/
	
	document.getElementById("save").onclick = saveMethod;
	document.getElementById("reset").onclick = resetMethod;
	document.getElementById("cancel").onclick = cancelMethod;
});

