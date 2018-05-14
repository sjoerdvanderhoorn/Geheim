# Geheim
Chrome extension to automatically encrypt all text entered on any website.

![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/Geheim/master/Screenshots/Encryption%20key%20selection.png "Encryption key selection")


## Description
This Chrome extension finds all input[type=text] and textarea fields on a website and gives the user the option to passkey protect any data that is entered before it is sent to the server by a self chosen encryption method. Fields are highlighted either in green or red, with green meaning encryption is applied while red notifies the user that no encryption is used for the data in that field. By clicking on the shield in the upper right corner or by double clicking in a field, encryption can be toggled.

## Technical summary
Any encrypted data is encoded in format ":geheim:`method id`:`key id`:`encrypted data`:".

The settings can be accessed through Geheim's extension button.

 ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/Geheim/master/Screenshots/Settings.png "Settings")

## Screenshot tour
1. Sending an encrypted message through a public channel such as a forum. Fields in green are encrypted before they are sent to the server. This provides a layer of security since the server owner or anybody else with access to it, will not be able to tell anything about the content you provided. Fields in red (such as "Username") are sent to the server in plain text, in order for the server to deliver the message to the right person. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/Geheim/master/Screenshots/01.%20Send%20an%20encrypted%20message%20through%20a%20public%20forum.png "1")
2. The receiver will be able to read the message just fine, as long as the right password and the proper decryption method is used. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/Geheim/master/Screenshots/02.%20Encrypted%20message%20received.png "2")
3. Any person who does not have the proper password or decryption method in place, will see an encrypted string that is of no use. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/Geheim/master/Screenshots/03.%20Message%20when%20encryption%20is%20turned%20off.png "3")
4. The intended receiver will be able to read the message just fine. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/Geheim/master/Screenshots/04.%20Message%20text.png "4")
5. While it is gibberish to any other person. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/Geheim/master/Screenshots/05.%20Message%20text%20when%20encryption%20is%20turned%20off.png "5")
