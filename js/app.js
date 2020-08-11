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
var statuses = {
    "inaccessible_command": "Неизвестная комманда",
    "invalidDevEui": "Некорректный размер EUI индефикатора устройства(DevEui)",
    "invalidAbpParamList": "Некорректные параметры ABP",
    "invalidDevAddrValue": "Некорректный адрес устройства в сети",
    "invalidSessionKeyValue": "Некорректный сессионый ключ устройства",
    "invalidOtaaParamList": "Некорректные параметры OTAA",
    "frequencyPlanIsAbsant": "Частоты не указываются при OTTA подключении",
    "invalidFrequencyPlan": "Невозможные параметры частот",
    "invalidAppKeyValue": "Некорректная длинная параметра",
    "invalidChannelMaskParamList": "Некорректные параметры каналов",
    "invalidClass": "Некорректный класс",
    "unsupportClass": "Неподдерживаемый класс",
    "invalidRxWindow": "Некорректное окно",
    "invalidDataRate": "Некорректное значение скорости(Preferred data rate) и/или скорости приема второго окна(RX2 date rate)",
    "invalidPower": "Некорректное значение мощности",
    "invalidDelay": "Некорректное значение задержки открытия окна",
    "noRegisterKeys": "Устройство не существует, либо запрос не содержит регистрационной информации",
    "repetitionDevAddr": "Устройство с данныи адресом в сети уже существует",
    "abpReginfoAlreadyExist": "Регистрационные данные ABP уже зарегистрированы в сети",
    "otaaReginfoAlreadyExist": "Регистрационные данные OTAA уже зарегистрированы в сети",
    "reginfoAlreadyExist": "Регистрационная информация для соответствующего устройства уже существует на сервере",
    "maxDevCountReached": "Достигнуто максимальное количество устройств в сети",
    "added": "Устройство успешно добавлено",
    "updated": "Настройки устройства успешно обновлены",
    "nothingToUpdate": "Изменений для существующих параметров устройства не обнаружено",
    "updateViaMacBuffer": "Полученные параметры должны быть обновлены с помощью команд MAC, и они не могут быть применены сейчас.",
    "deleted": "Устройство удалено из сети",
    "notFound": "Устройство не найдено"
}

function deleteDevice(){
    var form = document.getElementById("deviceForm");
    var myDev = new device();
    myDev.devEui = form.elements["devEui"].value;
    var jsonDelMess =
    {
        cmd: "delete_devices_req",
        devices_list: [form.elements["devEui"].value]
    };
    webSocket.send(JSON.stringify(jsonDelMess));
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
    else {
        delete myDevice.ABP;
    }
    if (!(form.elements["appEui"].value === '' && form.elements["appKey"].value === '')) {
        myDevice.OTAA =
        {
            appEui: form.elements["appEui"].value,
            appKey: form.elements["appKey"].value
        };
    }
    else {
        delete myDevice.OTAA;
    }
    myDevice.position =
    {
        longitude: form.elements["longitude"].value,
        latitude: form.elements["latitude"].value,
        altitude: form.elements["altitude"].value
    };
    myDevice.rxWindow = parseInt(form.elements["rxWindow"].value, 2);
    myDevice.delayRx1 = parseInt(form.elements["delayRx1"].value, 2);
    myDevice.drRx2 = parseInt(form.elements["drRx2"].value, 2);
    myDevice.preferDr = parseInt(form.elements["preferDr"].value, 2);
    myDevice.preferPower = parseFloat(form.elements["preferPower"].value);
    myDevice.serverAdrEnable = form.elements["serverAdrEnable"].value;
    
    var jsonMess =
    {
        cmd: "manage_devices_req",
        devices_list: [myDevice]
    };
    

    webSocket.send(JSON.stringify(jsonMess));
}
webSocket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    if (data.cmd == "manage_devices_resp" || data.cmd == "delete_devices_resp") {
        var note = document.getElementById("noty");
        var errorText = "";
        var status = false;
        if (data.status) {
            if (data.device_add_status && data.device_add_status.length > 0) {
                for (let index = 0; index < data.device_add_status.length; index++) {
                    const element = data.device_add_status[index];
                    if (element.status == "added" || element.status == "updated") {
                        status = true;
                    }
                    errorText = statuses[element.status];
                }
            }
            if (data.device_delete_status && data.device_delete_status.length > 0) {
                for (let index = 0; index < data.device_delete_status.length; index++) {
                    const element = data.device_delete_status[index];
                    if (element.status == "deleted") {
                        status = true;
                    }
                    errorText = statuses[element.status];
                }
            }
            else {
                errorText = statuses.inaccessible_command;
            }
        }
        else {
            errorText = statuses[data.err_string];
        }
        note.style.display = "block";
        note.querySelector(".message-header p").innerText = status ? "Успешная операция" : "Неуспешная операция";
        note.querySelector(".message-body").innerText = errorText;
        note.className = status ? "message is-success" : "message is-danger";
    }
    
} 
