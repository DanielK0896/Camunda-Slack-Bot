/* This file can be reached by calling swagger API endpoint. Pass mail password and local part */

    var request = require('request');
    var URL = "https://kasapi.kasserver.com/soap/wsdl/KasAuth.wsdl";
    var secrets = require('../../secrets');
   
    module.exports = {
        addMailAccount: addMailAccount
    };
   
    function addMailAccount(req, res) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', URL, true);

        var params = JSON.stringify({
            mail_password: req.mailPassword,
            local_part: req.localPart,
            domain_part: "cct-ev.de",
            responder: "N",
        });


        var sr =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<soapenv:Envelope ' + 
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                'xmlns:api="https://kasapi.kasserver.com/soap/wsdl/KasAuth.wsdl" ' +
                'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
                'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
                '<soapenv:Body>' +
                    '<api:some_api_call soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
                        '<KasUser xsi:type="xsd:string">' + secrets.kasUserName + '</KasUser>' +
                        '<KasAuthType xsi:type="xsd:string">sha1</KasAuthType>' +
                        '<KasPassword xsi:type="xsd:string">' + secrets.kasPassword + '</KasPassword>' +
                        '<KasRequestParams xsi:type="xsd:string">' + params + '</KasRequestParams>' +
                    '</api:some_api_call>' +
                '</soapenv:Body>' +
            '</soapenv:Envelope>';

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);
                }
            }
        }
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(sr);
   }
   











