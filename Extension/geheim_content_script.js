// These functions can be customized to provide a custom encryption method
var geheimstatus;
var encryptpassword;
var decryptpassword;
var encrypt = function(data, password)
{
	return data;
}
var decrypt = function(data, password)
{
	return data;
}

// Load encryption functions
chrome.storage.sync.get(["active", "encryption-function", "encryption-password", "decryption-function", "decryption-password"], function(data)
{
	initializeEncryption(data);
});
// Encryption functions updated
chrome.storage.onChanged.addListener(function(changes, namespace)
{
	var data = {};
	for (key in changes)
	{
		data[key] = changes[key].newValue;
	}
	initializeEncryption(data);
	location.reload();
});

function initializeEncryption(data)
{
	// If no value exists, load default
	if (data["active"] === undefined)
	{
		data["active"] = true;
		chrome.storage.sync.set({"active": data["active"]});
	}
	if (!data["encryption-function"])
	{
		data["encryption-function"] = 'function(data, password){password = password.repeat(data.length / password.length + 1);data = data.split("");for (var i = 0; i < data.length; i++){data[i] = String.fromCharCode(data[i].charCodeAt(0) ^ password[i].charCodeAt(0));};var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};return Base64.encode(data.join(""));}';
		chrome.storage.sync.set({"encryption-function": data["encryption-function"]});
	}
	if (!data["encryption-password"])
	{
		data["encryption-password"] = "My Secret Password"
		chrome.storage.sync.set({"encryption-password": data["encryption-password"]});
	}
	if (!data["decryption-function"])
	{
		data["decryption-function"] = 'function(data, password){password = password.repeat(data.length / password.length + 1);var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};var data = Base64.decode(data);data = data.split("");for (var i = 0; i < data.length; i++){data[i] = String.fromCharCode(data[i].charCodeAt(0) ^ password[i].charCodeAt(0));};return data.join("");}';
		chrome.storage.sync.set({"decryption-function": data["decryption-function"]});
	}
	if (!data["decryption-password"])
	{
		data["decryption-password"] = "My Secret Password"
		chrome.storage.sync.set({"decryption-password": data["decryption-password"]});
	}
	// Set up encryption functions
	geheimstatus = data["active"];
	encryptpassword = data["encryption-password"];
	decryptpassword = data["decryption-password"];
	eval("encrypt=" + data["encryption-function"]);
	eval("decrypt=" + data["decryption-function"]);

	if (geheimstatus)
	{
		// Replace all encrypted values
		var encryptionPattern = new RegExp("crYP7([A-Za-z0-9+/=])*(={0,3})", "g")
		var textNodes = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, null, false);
		for (var node; node = textNodes.nextNode();)
		{
			if (encryptionPattern.test(node.wholeText))
			{
				if (node.parentNode.tagName != "TEXTAREA")
				{
					// Highlight that this text was originally encrypted
					node.parentNode.style.paddingRight = "20px";
					node.parentNode.style.backgroundColor = "#dbf9ca";
					node.parentNode.style.backgroundRepeat = "no-repeat";
					node.parentNode.style.backgroundPosition = "top right";
					node.parentNode.style.backgroundImage = "url('" + chrome.extension.getURL("/images/safe.png") + "')";
					// Show clear text
					node.nodeValue = node.nodeValue.replace(encryptionPattern, function(match)
					{
						return decrypt(match.substr(5, match.length), decryptpassword);
					});
				}
			}
		}

		// Loop through all input and textarea controls that already exist in order to ghost copy them
		document.querySelectorAll("input[type=text], textarea").forEach(function (node)
		{
			if (!node.isGhost && !node.isGhosted)
			{
				new Ghost(node);
			}
		});
	}
}

// Listen for DOM changes on original node that need to replicate to ghost
var observer = new MutationObserver(function(mutations)
{
	mutations.forEach(function(mutation)
	{
		// Update attributes on ghost
		if (mutation.type == "attributes" && mutation.target.isGhosted && mutation.attributeName != "id" && mutation.attributeName != "name")
		{
			mutation.target.ghost.setAttribute(mutation.attributeName, mutation.target.getAttribute(mutation.attributeName));
			//setGhostProperties(mutation.target.ghost);
			mutation.target.ghost.setGhostProperties();
		}
		// Update attributes on original node
		if (mutation.type == "attributes" && mutation.target.isGhost && mutation.attributeName != "id" && mutation.attributeName != "name")
		{
			// To prevent an endless loop, do not copy forward changes on the ghost to the node since the node will be invisible anyway
		}
		// Remove ghost or original node if other from pair is removed
		mutation.removedNodes.forEach(function(target)
		{
			if (target.isGhosted)
			{
				target.ghost.remove();
			}
			else if (target.isGhost)
			{
				target.node.remove();
			}
		});
		// Add ghost for new node
		mutation.addedNodes.forEach(function(target)
		{
			if (!target.isGhost && ((target.tagName == "INPUT" && target.type == "text") || (target.tagName=="TEXTAREA")))
			{
				new Ghost(target);
			}
		});
	});
});
if (geheimstatus)
{
	observer.observe(document.body,
	{
		attributes: true,
		childList: true,
		characterData: true,
		subtree: true
	});
}


function Ghost(node)
{
	// Store original
	this.node = node;
	this.node.isGhosted = true;
	// Clone element
	this.ghost = node.cloneNode(false);
	this.ghost.isEncrypted = false;
	// Decrypt value and set default encryption state
	if (this.node.value.substr(0, 5) == "crYP7")
	{
		this.ghost.value = decrypt(this.ghost.value.substr(5), decryptpassword);
		this.ghost.isEncrypted = true;
	}
	else if (this.node.id.match("user|username|mail|search|find") || this.node.name.match("user|username|mail|search|find"))
	{
		this.ghost.isEncrypted = false;
	}
	else if (this.ghost.value == "")
	{
		this.ghost.isEncrypted = true;
	}
	// Store references to ghost
	this.ghost.node = this.node;
	this.node.ghost = this.ghost;
	// Set properties
	this.ghost.setGhostProperties = setGhostProperties;
	this.ghost.setGhostProperties();
	// Assign control to page
	this.node.parentNode.insertBefore(this.ghost, this.node.nextSibling);
	// Bind events
	this.ghost.addEventListener("input", this, false);
	this.ghost.addEventListener("click", this, false);
	this.ghost.addEventListener("mousemove", this, false);
	this.ghost.addEventListener("mouseout", this, false);
	// Hide original
	this.node.style.display = "none";
}

Ghost.prototype.handleEvent = function(event)
{
	switch (event.type)
	{
		case "input" : this.updated(); break;
		case "click" : this.click(); break;
		case "mousemove" : this.mousemove(); break;
		case "mouseout" : this.mouseout(); break;
	}
}

Ghost.prototype.updated = function()
{
	if (this.ghost.isEncrypted)
	{
		this.node.value = "crYP7" + encrypt(this.ghost.value, encryptpassword);
	}
	else
	{
		this.node.value = this.ghost.value;
	}
}
Ghost.prototype.click = function()
{
	if (event.offsetY < 20 && (event.target.clientWidth - event.offsetX) < 20)
	{
		// Toggle node encryption on or off
		event.target.isEncrypted = !event.target.isEncrypted;
		event.target.setGhostProperties();
		event.target.dispatchEvent(new Event("input"));
	}
}
Ghost.prototype.mousemove = function()
{
	if (event.offsetY < 20 && (event.target.clientWidth - event.offsetX) < 20)
	{
		event.target.style.backgroundImage = "url('" + chrome.extension.getURL("/images/hover.png") + "')";
		event.target.style.cursor = "pointer";
	}
	else
	{
		event.target.setGhostProperties();
	}
}
Ghost.prototype.mouseout = function()
{
	event.target.setGhostProperties();
}

function setGhostProperties()
{
	// Set important properties
	this.isGhost = true;
	// Remove attributes to prevent duplicates
	this.removeAttribute("id");
	this.removeAttribute("name");
	// Generic layout
	this.style.display = "initial";
	this.style.cursor = "auto";
	this.style.backgroundRepeat = "no-repeat";
	this.style.backgroundPosition = "top right";
	if (this.isEncrypted)
	{
		this.style.backgroundColor = "#dbf9ca";
		this.style.backgroundImage = "url('" + chrome.extension.getURL("/images/safe.png") + "')";
	}
	else
	{
		this.style.backgroundColor = "#f9cdca";
		this.style.backgroundImage = "url('" + chrome.extension.getURL("/images/unsafe.png") + "')";
	}
}

