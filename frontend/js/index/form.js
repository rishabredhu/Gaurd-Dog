var addLabelBtn = document.getElementById("btn-add-label")
var newLabel = document.getElementById("new-label")
var labelSelect = document.getElementById("label");
var deleteLabelSelect = document.getElementById("delete-label");
var deleteLabelButton = document.getElementById("btn-delete-label");

addLabelBtn.addEventListener("click", addNewLabel);
deleteLabelButton.addEventListener("click", deleteLabel);

var apigClient = apigClientFactory.newClient();

// label
// userid
function addNewLabel() {

    newlabel = newLabel.value

    if (newLabel === null) {
        return;
    }

    var params = {
        'userid': 'eashankaushik',
        'label': newlabel
    };


    apigClient.knownfaceLabelPost(params, {}, {})
        .then(function (result) {
            console.log('labels add new', result["data"]);
        }).catch(function (result) {
            console.log('labels add new error', result);
        });

}

function getKnownLabels() {
    // get known labels
    var params = {
        'userid': 'eashankaushik',
    };

    apigClient.knownfaceLabelGet(params, {}, {})
        .then(function (result) {
            console.log('labels', result["data"]);

            labels = result["data"];
            min = 0;
            max = labels.length;
            for (var i = min; i < max; i++) {
                var opt = document.createElement('option');
                opt.value = labels[i];
                opt.innerHTML = labels[i];
                var optdel = document.createElement('option');
                optdel.value = labels[i];
                optdel.innerHTML = labels[i];

                labelSelect.appendChild(opt);
                deleteLabelSelect.appendChild(optdel);
            }
        }).catch(function (result) {
            console.log('labels error', result);
        });


    // add known labels to label input
}

getKnownLabels()

function deleteLabel() {

    var params = {
        'userid': 'eashankaushik',
        'label': deleteLabelSelect.value
    };

    // knownfaceLabelDeletePut

    apigClient.knownfaceLabelDeletePut(params, {}, {})
        .then(function (result) {
            console.log('labels delete', result["data"]);
        }).catch(function (result) {
            console.log('labels delte error', result);
        });
}
