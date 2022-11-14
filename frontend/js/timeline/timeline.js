knowFaceDiv = document.getElementById("known-face")
unknowFaceDiv = document.getElementById("unknown-face")
noAlertDiv = document.getElementById("no-alerts")

knowAlertBtn = null;
unknownAlertBtn = null;

var apigClient = apigClientFactory.newClient();


function getAlerts() {
    var params = {
        'userid': 'eashankaushik',
    };
    apigClient.alertsGet(params, {}, {})
        .then(function (result) {
            // console.log('alerts', result["data"]);
            displayAlerts(result["data"]);
        }).catch(function (result) {
            console.log('alerts error', result);
        });
}

function displayAlerts(alerts) {

    if (alerts["knownFaces"].length === 0 && alerts["unkownFaces"].length === 0) {
        noAlerts();
    }

    if (alerts["knownFaces"].length != 0) {
        knownFacesAlerts(alerts["knownFaces"]);
    }
    if (alerts["unkownFaces"].length != 0) {
        unkownFacesAlerts(alerts["unkownFaces"]);
    }

}
getAlerts()

function noAlerts() {
    noAlertDiv.hidden = false;
    noAlertDiv.innerHTML = "<h1> No Alerts! </h1>"

}

function knownFacesAlerts(alerts) {
    knowFaceDiv.hidden = false;
    var content = '<h1 class="text-center"> Known Face </h1>';
    content += '<form><button type="button" id="delete-known-alerts" class="btn btn-outline-warning"><i class="bi bi-trash3-fill"></i></button></form>'

    content += '<div class="row"><ol class="list-group m-2">';

    for (let alert of alerts) {
        content += '<li class="list-group-item d-flex justify-content-between align-items-start">';
        content += '<div class="ms-2 me-auto"><div class="fw-bold">';
        content += alert.label + '</div><table class="table table-bordered fw-bold"><tbody><tr>';

        for (let timestamp of alert.detect_timestamp) {
            content += '<td>' + timestamp + '</td>';
        }
        content += '</tr></tbody></table></div>';
        total_alerts = alert.detect_timestamp.length;
        content += '<span class="badge bg-primary rounded-pill">' + total_alerts.toString() + '</span></li>';
    };

    content += "</ol></div>";

    knowFaceDiv.innerHTML = content;

    knowAlertBtn = document.getElementById("delete-known-alerts");

    knowAlertBtn.addEventListener("click", function () {
        deleteAlert(alerts);
    });
}

function unkownFacesAlerts(alerts) {
    unknowFaceDiv.hidden = false;
    // console.log(alerts[0])

    var content = '<h1 class="text-center"> Un-Known Face </h1>';
    content += '<form><button type="button" id="delete-unknown-alerts" class="btn btn-outline-danger"><i class="bi bi-trash3-fill"></i></button></form>'
    content += '<div class="row"><h3 class="text-center"> Detected Face </h3><ol class="list-group m-2">';

    for (let alert of alerts[0]["detect_timestamp"]) {
        content += '<li class="list-group-item d-flex justify-content-between align-items-start">';
        content += '<div class="ms-2 me-auto"><div class="fw-bold">';
        content += alert + '</div><table class="table table-bordered text-warning fw-bold"><tbody><tr>';

        // for (let timestamp of alert.detect_timestamp) {
        //     content += '<td>' + timestamp + '</td>';
        // }
        content += '</tr></tbody></table></div>';
        // total_alerts = alerts[0]["detect_timestamp"].length;
        content += '<span class="badge bg-primary rounded-pill"></span></li>';
    };

    content += "</ol>";

    content += '<h3 class="text-center"> Alarms Generated </h3><ol class="list-group m-2">';

    for (let alert of alerts[0]["alarm_timestamp"]) {
        content += '<li class="list-group-item d-flex justify-content-between align-items-start">';
        content += '<div class="ms-2 me-auto"><div class="fw-bold">';
        content += alert + '</div><table class="table table-bordered text-warning fw-bold"><tbody><tr>';

        content += '</tr></tbody></table></div>';
        content += '<span class="badge bg-primary rounded-pill"></span></li>';
    };

    content += "</ol></div>";

    unknowFaceDiv.innerHTML = content;
    unknownAlertBtn = document.getElementById("delete-unknown-alerts");
    unknownAlertBtn.addEventListener("click", function () {
        deleteAlert();
    });
}

function deleteAlert(alerts = null) {


    if (alerts != null) {
        // console.log(alerts);
        for (let alert of alerts) {
            label = alert.label
            var params = {
                'userid': 'eashankaushik',
                'label': label
            };

            apiDeleteFunc(params)

        }

    } else {
        var params = {
            'userid': 'eashankaushik',
            'label': 'null'
        };
        apiDeleteFunc(params)
        console.log(params);
    }

}

function apiDeleteFunc(params) {
    apigClient.alertsPut(params, {}, {})
        .then(function (result) {
            displayAlerts(result["data"]);
        }).catch(function (result) {
            console.log('alerts error', result);
        });
}

