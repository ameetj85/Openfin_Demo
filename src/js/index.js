var _mainWin,
  apps = [],
  winId = 0;

document.addEventListener("DOMContentLoaded", function () {
  init();
});

function init() {
  try {
    fin.desktop.main(function () {
      initWithOpenFin();
    });
  } catch (err) {
    initNoOpenFin();
  }
}

function initWithOpenFin() {
  var draggableElement = document.getElementById("openFinVer");
  draggableElement.style.webkitAppRegion = "drag";

  _mainWin = fin.desktop.Window.getCurrent();

  _mainWin.updateOptions({
    frame: false,
    cornerRounding: {
      width: 10,
      height: 10,
    },
  });

  var version = fin.desktop.System.getVersion();

  fin.desktop.System.getVersion(function (version) {
    try {
      document.querySelector("#openFinVer").innerText =
        "OpenFin version installed on this machine is " + version;
    } catch (err) {
      console.log(err);
    }
  });

  document
    .querySelector("#createChild")
    .addEventListener("click", function (e) {
      initNewApp("CHILD_" + winId).then(function (value) {
        winId++;
        apps.push(value);
      });
    });

  _messageButton = document
    .querySelector("#executeOp")
    .addEventListener("click", function () {
      doArithmetic();
    });

  _mainWin.addEventListener("close-requested", function (e) {
    var challenge = confirm("Closing this app will close all child apps.");
    if (challenge == true) {
      terminateAllApps();
      _mainWin.close(true);
    } else {
      console.log("Close app canceled.");
    }
  });

  setListener();
}

function initNoOpenFin() {
  document.getElementById("openFinVer").innerHTML =
    "OpenFin is not available - you are probably running in a browser.";
}

function terminateAllApps() {
  for (var app in apps) {
    apps[app].close();
  }
}

function initNewApp(uuid) {
  return new Promise(function (resolve, reject) {
    var SpawnedApplication = new fin.desktop.Application(
      {
        name: "A New Child Window",
        uuid: uuid,
        url: "http://localhost:5000/child.html",
        mainWindowOptions: {
          name: "A New Child Window",
          autoShow: true,
          defaultCentered: false,
          alwaysOnTop: false,
          saveWindowState: true,
          icon: "favicon.ico",
        },
      },
      function () {
        console.log("running");
        SpawnedApplication.run();
        resolve(SpawnedApplication);
      }
    );
  });
}

function doArithmetic() {
  var _num1 = document.getElementById("firstNumber").value;
  var _num2 = document.getElementById("secondNumber").value;

  var _result = Number(_num1) + Number(_num2);

  document.getElementById("addValue").innerHTML = _result;
  fin.desktop.InterApplicationBus.publish("arithmetic_op_add", {
    num: _result,
    text: "The result of addition is: ",
  });

  _result = Number(_num1) - Number(_num2);

  document.getElementById("subValue").innerHTML = _result;
  fin.desktop.InterApplicationBus.publish("arithmetic_op_subtract", {
    num: _result,
    text: "The result of subtraction is: ",
  });

  _result = Number(_num1) * Number(_num2);

  document.getElementById("multValue").innerHTML = _result;
  fin.desktop.InterApplicationBus.publish("arithmetic_op_multiply", {
    num: _result,
    text: "The result of multiplication is: ",
  });

  _result = Number(_num1) / Number(_num2);

  document.getElementById("divValue").innerHTML = _result;
  fin.desktop.InterApplicationBus.publish("arithmetic_op_divide", {
    num: _result,
    text: "The result of division is: ",
  });
}

function closeApp() {
  fin.desktop.Application.getCurrent().close();
}

function setListener() {
  fin.desktop.InterApplicationBus.subscribe(
    "*",
    "ack_op_add",
    function (message, uuid) {
      document.getElementById("addVerify").innerHTML = message.child;
      console.log("Received: " + message.text + message.num);
    }
  );

  fin.desktop.InterApplicationBus.subscribe(
    "*",
    "ack_op_subtract",
    function (message, uuid) {
      document.getElementById("subVerify").innerHTML = message.child;
      console.log("Received: " + message.text + message.num);
    }
  );

  fin.desktop.InterApplicationBus.subscribe(
    "*",
    "ack_op_multiply",
    function (message, uuid) {
      document.getElementById("multVerify").innerHTML = message.child;
      console.log("Received: " + message.text + message.num);
    }
  );

  fin.desktop.InterApplicationBus.subscribe(
    "*",
    "ack_op_divide",
    function (message, uuid) {
      document.getElementById("divVerify").innerHTML = message.child;
      console.log("Received: " + message.text + message.num);
    }
  );
}
