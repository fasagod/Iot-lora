 var webSocket = new WebSocket("ws://192.168.100.120:8002");

 function authU() {
    var auth = {
        login: 'root',
        password: '123',
        cmd: 'auth_req'
    };
    if (!webSocket.readyState) {
        setTimeout(n => (webSocket.send(JSON.stringify(auth))), 10);
    }
    else {
        webSocket.send(JSON.stringify(auth))
    }

}   
var statuses={
    "inaccessible_command":"Неизвестная комманда",
    "invalidDevEui":"Некорректный размер EUI индефикатора устройства(DevEui)",
    "invalidAbpParamList":"Некорректные параметры ABP",
    "invalidDevAddrValue":"Неизвестная комманда",
    "invalidSessionKeyValue":"Неизвестная комманда",
    "invalidOtaaParamList":"Неизвестная комманда",
    "frequencyPlanIsAbsant":"Неизвестная комманда",
    "invalidFrequencyPlan":"Неизвестная комманда",
    "invalidAppKeyValue":"Неизвестная комманда",
    "invalidChannelMaskParamList":"Неизвестная комманда",
    "invalidClass":"Неизвестная комманда",
    "unsupportClass":"Неизвестная комманда",
    "invalidRxWindow":"Неизвестная комманда",
    "invalidDataRate":"Неизвестная комманда",
    "invalidPower":"Неизвестная комманда",
    "invalidDelay":"Неизвестная комманда",
    "noRegisterKeys":"Неизвестная комманда",
    "repetitionDevAddr":"Неизвестная комманда",
    "abpReginfoAlreadyExist":"Неизвестная комманда",
    "otaaReginfoAlreadyExist":"Неизвестная комманда",
    "reginfoAlreadyExist":"Неизвестная комманда",
    "maxDevCountReached":"Неизвестная комманда",
    "added":"Устройство добавлено",
    "updated":"Неизвестная комманда",
    "nothingToUpdate":"Неизвестная комманда",
    "updateViaMacBuffer":"Неизвестная комманда"
}

function saveDevice() {
    var form = document.getElementById("deviceForm");
    var myDevice = new device();
    myDevice.devEui = form.elements["devEui"].value;
    myDevice.devName = form.elements["devName"].value;
    if (!(form.elements["devAddress"].value === '' && form.elements["appsKey"].value === '' && form.elements["nwksKey"].value === '')) {
        myDevice.ABP =
        {
            devAddress: form.elements["devAddress"].value,
            appsKey: form.elements["appsKey"].value,
            nwksKey: form.elements["nwksKey"].value
        };
    }
    else{
        delete myDevice.ABP;
    }
    if (!(form.elements["appEui"].value === '' && form.elements["appKey"].value === '')) {
        myDevice.OTAA =
        {
            appEui: form.elements["appEui"].value,
            appKey: form.elements["appKey"].value
        };
    }
    else{
        delete myDevice.OTAA;
    }
    myDevice.position =
    {
        longitude: form.elements["longitude"].value,
        latitude: form.elements["latitude"].value,
        altitude: form.elements["altitude"].value
    };
    myDevice.rxWindow = parseInt(form.elements["rxWindow"].value,2);
    myDevice.delayRx1 = parseInt(form.elements["delayRx1"].value,2);
    myDevice.drRx2 = parseInt(form.elements["drRx2"].value,2);
    myDevice.preferDr = parseInt(form.elements["preferDr"].value,2);
    myDevice.preferPower = parseFloat(form.elements["preferPower"].value);
    myDevice.serverAdrEnable = form.elements["serverAdrEnable"].value;
    // myDevice.valid_data();
    var jsonMess =
    {
        cmd: "manage_devices_req",
        devices_list: [myDevice]
    };
    console.log(myDevice);

    console.log(JSON.stringify(jsonMess));
    
    webSocket.send(JSON.stringify(jsonMess));
}
  webSocket.onmessage = function (event) {
    var note = document.getElementById("noty");
    var errorText="";
    var status=false;
    var data = JSON.parse(event.data);
    if (data.status) {
        if (data.device_add_status && data.device_add_status.lenght>0) {
            for (let index = 0; index < array.length; index++) {
                const element = data.device_add_status[index];
                if (element.status=="added"||element.status=="updated") {
                    status=true;
                }
                errorText=statuses[element.status];
            }
        }
        else {
            errorText = statuses.inaccessible_command;
        }
    }
    else{
        errorText = statuses[data.err_string];
    }
    note.style.display="block";
    note.querySelector(".message-header p").innerText = status ? "Успешная операция" : "Неуспешная операция";
    note.querySelector(".message-body").innerText = errorText;
    note.className = status ? "message is-success" : "message is-danger";

    console.log(event.data);
} 
