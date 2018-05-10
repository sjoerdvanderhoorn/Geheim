// Load default settings
var settings = chrome.extension.getBackgroundPage().defaultSettings;

// Overwrite default settings with settings from storage
chrome.storage.local.get(["geheimSettings"], function(data)
{
	if(data["geheimSettings"])
	{
		settings = JSON.parse(data["geheimSettings"]);
	}
	getMethods();
	getKeys();
});

function getMethods()
{
	var methodsEl = document.getElementById("methods");
	settings.methods.sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function(method)
	{
		var methodEl = document.createElement("li");
		methodEl.innerHTML = method.name;
		methodEl.setAttribute("methodid", method.id);
		methodEl.onclick = function()
		{
			document.location.href = "settings-method.html?methodid=" + method.id;
		}
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
			keyEl.setAttribute("methodid", key.methodid);
			keyEl.setAttribute("keyid", key.id);
			keyEl.onclick = function()
			{
				document.location.href = "settings-key.html?methodid=" + key.methodid + "&keyid=" + key.id;
			}
			keysEl.appendChild(keyEl);
		});
	});
}

function saveMethod()
{
	chrome.storage.local.set(
	{
		"geheimSettings": JSON.stringify(settings)
	});
	alert("Settings saved");
}

function resetMethod()
{
	if (window.confirm("Are you sure you want to reset? This will remove all your settings and ENCRYPTION KEYS!"))
	{
		settings = chrome.extension.getBackgroundPage().defaultSettings;
		chrome.storage.local.set(
		{
			"geheimSettings": JSON.stringify(settings)
		});
		document.location.reload();
	}
}

function cancelMethod()
{
	window.close();
}


document.addEventListener("DOMContentLoaded", function()
{
	document.getElementById("reset").onclick = resetMethod;
});


