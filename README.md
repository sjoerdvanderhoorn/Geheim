# ChromeGeheim
Chrome extension to automatically encrypt all text entered on any website.

## Description
This Chrome extension finds all input[type=text] and textarea fields on a website and gives the user the option to passkey protect any data that is entered before it is sent to the server by a self chosen encryption method. Fields are highlighted either in green or red, with green meaning encryption is applied while red notifies the user that no encryption is used for the data in that field. By clicking on the shield in the upper right corner, encryption can be toggled.

## Technical summary
Any encrypted data is preambled with "crYP7" and should be Base64 encoded. Currently the encryption and decryption methods used can only be manually adjusted and apply to all websites. The example method is a simple XOR against the encryption password and does not provide any real protection.

The settings can be accessed through ChromeGeheim's extension button and allow the user to completely turn the extension on or off, and to change the encryption methods and passwords.

 ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/ChromeGeheim/develop/Screenshots/Settings.png "Settings")

## Screenshot tour
1. Sending an encrypted message through a public channel such as a forum. Fields in green are encrypted before they are sent to the server. This provides a layer of security since the server owner or anybody else with access to it, will not be able to tell anything about the content you provided. Fields in red (such as "Username") are sent to the server in plain text, in order for the server to deliver the message to the right person. 
 * ![alt text](https://github.com/sjoerdvanderhoorn/ChromeGeheim/raw/develop/Screenshots/01.%20Send%20an%20encrypted%20message%20through%20a%20public%20forum.png "1")
2. The receiver will be able to read the message just fine, as long as the right password and the proper decryption method is used. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/ChromeGeheim/develop/Screenshots/02.%20Encrypted%20message%20received.png "2")
3. Any person who does not have the proper password or decryption method in place, will see an encrypted string that is of no use. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/ChromeGeheim/develop/Screenshots/03.%20Message%20when%20encryption%20is%20turned%20off.png "3")
4. The intended receiver will be able to read the message just fine. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/ChromeGeheim/develop/Screenshots/04.%20Message%20text.png "4")
5. While it is gibberish to any other person. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/ChromeGeheim/develop/Screenshots/05.%20Message%20text%20when%20encryption%20is%20turned%20off.png "5")
6. Replying to messages is just as simple as sending a new one. Encryption will automatically apply to all fields that need it. 
 * ![alt text](https://raw.githubusercontent.com/sjoerdvanderhoorn/ChromeGeheim/develop/Screenshots/06.%20Encrypted%20reply.png "6")
