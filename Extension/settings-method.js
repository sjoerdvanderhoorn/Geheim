// Load default settings
var settings = chrome.extension.getBackgroundPage().defaultSettings;

// Page parameters
var currentUrl = new URL(window.location.href);
var methodid = currentUrl.searchParams.get("methodid");
var keyid = currentUrl.searchParams.get("keyid");

// Overwrite default settings with settings from storage
chrome.storage.sync.get(["geheimSettings"], function(data)
{
	if(data["geheimSettings"])
	{
		settings = JSON.parse(data["geheimSettings"]);
	}
	if (methodid)
	{
		getMethod();
	}
});

function getMethod()
{
	settings.methods.filter(m => m.id == methodid).find(function (key)
	{
		document.getElementById("name").value = key.name;
		document.getElementById("id").value = key.id;
		document.getElementById("encrypt").value = key.encrypt;
		document.getElementById("decrypt").value = key.decrypt;
		document.getElementById("generateKeys").value = key.generateKeys;
	});
}

function randomId()
{
	document.getElementById("id").value = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
	return false;
}

function saveMethod()
{
	if (!document.getElementById("name").value || !document.getElementById("id").value || !document.getElementById("encrypt").value || !document.getElementById("decrypt").value || !document.getElementById("generateKeys").value)
	{
		alert("Enter all required fields to save:\n\n- Method name\n- Method code\n- Encryption function\n- Decryption function\n- Key generation function");
		return false;
	}
	if (methodid)
	{
		// Update
		settings.methods.filter(m => m.id == methodid).find(function (method)
		{
			method.id = document.getElementById("id").value;
			method.name = document.getElementById("name").value;
			method.encrypt = document.getElementById("encrypt").value;
			method.decrypt = document.getElementById("decrypt").value;
			method.generateKeys = document.getElementById("generateKeys").value;
		});
	}
	else
	{
		// Add
		settings.methods.push(
		{
			"id": document.getElementById("id").value,
			"name": document.getElementById("name").value,
			"encrypt": document.getElementById("encrypt").value,
			"decrypt": document.getElementById("decrypt").value,
			"generateKeys": document.getElementById("generateKeys").value
		});
	}
	chrome.storage.sync.set(
	{
		"geheimSettings": JSON.stringify(settings)
	});
	window.history.back();
}

function deleteMethod()
{
	if (window.confirm("Are you sure you want to delete this method? All attached keys will also be removed."))
	{
		if (methodid)
		{
			// Delete method
			for (var i=0; i < settings.methods.length; i++)
			{
				if (settings.methods[i].id == methodid)
				{
					settings.methods.splice(i, 1);
				}
			}
			// Delete key(s)
			for (var i=0; i < settings.keys.length; i++)
			{
				if (settings.keys[i].methodid == methodid)
				{
					settings.keys.splice(i, 1);
				}
			}
			chrome.storage.sync.set(
			{
				"geheimSettings": JSON.stringify(settings)
			});
		}
		window.history.back();
	}
}

function cancelMethod()
{
	window.history.back();
}

document.addEventListener("DOMContentLoaded", function()
{
	document.getElementById("save").onclick = saveMethod;
	document.getElementById("delete").onclick = deleteMethod;
	document.getElementById("cancel").onclick = cancelMethod;
	document.getElementById("randomId").onclick = randomId;
});