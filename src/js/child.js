var _childApp, _messageButton;
var _uuid;

document.addEventListener("DOMContentLoaded", function () {
  initChild();
});

function initChild() {
  fin.desktop.main(function () {
    initChildWithOpenFin();

    _messageButton = document
      .querySelector("#sendAck")
      .addEventListener("click", function () {
        sendAck();
      });
  });
}

initChildWithOpenFin = function () {
  _childApp = fin.desktop.Window.getCurrent();
  _childApp.show();
};

function setListener() {
  _interAppMessageField = document.querySelector("#inter-app-message");

  var selectedVal = document.getElementById("selectOp").selectedIndex;

  if (selectedVal == 1) {
    fin.desktop.InterApplicationBus.subscribe(
      "*",
      "arithmetic_op_add",
      function (message, uuid) {
        var _message =
          "The application " + uuid + " send this message " + message;
        _interAppMessageField.innerHTML = message.text + message.num;
        _uuid = uuid;
        console.log(_message);
      }
    );

    fin.desktop.InterApplicationBus.addSubscribeListener(function (
      uuid,
      topic
    ) {
      // document.getElementById("childWindow").innerHTML =
      //   "The application " + uuid + " has subscribed to " + topic;
      console.log("The application " + uuid + " has subscribed to " + topic);
    });
  } else if (selectedVal == 2) {
    fin.desktop.InterApplicationBus.subscribe(
      "*",
      "arithmetic_op_subtract",
      function (message, uuid) {
        var _message =
          "The application " + uuid + " send this message " + message;
        _interAppMessageField.innerHTML = message.text + message.num;
        _uuid = uuid;
        console.log(_message);
      }
    );

    fin.desktop.InterApplicationBus.addSubscribeListener(function (
      uuid,
      topic
    ) {
      // document.getElementById("childWindow").innerHTML =
      //   "The application " + uuid + " has subscribed to " + topic;
      console.log("The application " + uuid + " has subscribed to " + topic);
    });
  } else if (selectedVal == 3) {
    fin.desktop.InterApplicationBus.subscribe(
      "*",
      "arithmetic_op_multiply",
      function (message, uuid) {
        var _message =
          "The application " + uuid + " send this message " + message;
        _interAppMessageField.innerHTML = message.text + message.num;
        _uuid = uuid;
        console.log(_message);
      }
    );

    fin.desktop.InterApplicationBus.addSubscribeListener(function (
      uuid,
      topic
    ) {
      // document.getElementById("childWindow").innerHTML =
      //   "The application " + uuid + " has subscribed to " + topic;
      console.log("The application " + uuid + " has subscribed to " + topic);
    });
  } else if (selectedVal == 4) {
    fin.desktop.InterApplicationBus.subscribe(
      "*",
      "arithmetic_op_divide",
      function (message, uuid) {
        var _message =
          "The application " + uuid + " send this message " + message;
        _interAppMessageField.innerHTML = message.text + message.num;
        _uuid = uuid;
        console.log(_message);
      }
    );

    fin.desktop.InterApplicationBus.addSubscribeListener(function (
      uuid,
      topic
    ) {
      // document.getElementById("childWindow").innerHTML =
      //   "The application " + uuid + " has subscribed to " + topic;
      console.log("The application " + uuid + " has subscribed to " + topic);
    });
  }
}

function sendAck() {
  var operation = document.getElementById("selectOp").value;

  fin.desktop.InterApplicationBus.publish("ack_op_" + operation, {
    child: _childApp.uuid,
    op: operation,
  });

  console.log(
    "The child " + _childApp.uuid + " acks operation " + "ack_op_" + operation
  );
}
