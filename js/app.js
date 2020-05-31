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
    if (!(form.elements["appEui"].value === '' && form.elements["appKey"].value === '')) {
        myDevice.OTAA =
        {
            appEui: form.elements["appEui"].value,
            appKey: form.elements["appKey"].value
        };
    }
    myDevice.position =
    {
        longitude: form.elements["longitude"].value,
        latitude: form.elements["latitude"].value,
        altitude: form.elements["altitude"].value
    };
    myDevice.rxWindow = form.elements["rxWindow"].value;
    myDevice.delayRx1 = form.elements["delayRx1"].value;
    myDevice.drRx2 = form.elements["drRx2"].value;
    myDevice.preferDr = form.elements["preferDr"].value;
    myDevice.preferPower = form.elements["preferPower"].value;
    myDevice.serverAdrEnable = form.elements["serverAdrEnable"].value;
    myDevice.valid_data();
    var jsonMess =
    {
        cmd: "manage_devices_req",
        devices_list: [myDevice]
    };
    webSocket.send(JSON.stringify(jsonMess));
}
webSocket.onmessage = function (event) {
    console.log(event.data);
}