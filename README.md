# ChromeGeheim
Chrome extension to automatically encrypt all text entered on any website.

## Description
This Chrome extension finds all input[type=text] and textarea fields on a website and gives the user the option to passkey protect any data that is entered before it is sent to the server by a self chosen encryption method. Fields are highlighted either in green or red, with green meaning encryption is applied while red notifies the user that no encryption is used for the data in that field. By clicking on the shield in the upper right corner, encryption can be toggled.

## Technical summary
Any encrypted data is preambled with "crYP7" and should be Base64 encoded. Currently the encryption and decryption methods used can only be manually adjusted and apply to all websites. The example method is a simple XOR against the encryption password and does not provide any real protection.
