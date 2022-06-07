
/****************************************************************************
 * Get data from CREATE and UPDATE test case form. Save data in object
 ****************************************************************************/

function getTestCaseDataFromForm() {
    let testCase = {};

    testCase.id = $("#tce_case_id").val()
    testCase.title = $("#tce_title_input").val();
    testCase.suite_id = $("#tce_test_suite_select").val();
    testCase.automated = $("#tce_automated_select").val();

    testCase.data = {};
    testCase.data['preconditions'] = $("#tce_preconditions_input").val();
    testCase.data.steps = [];

    $( $(".step") ).each( function(index) {

        if($(this).find(".step_action").val() || $(this).find(".step_result").val())
        {
            testCase.data.steps[index] =
                {
                    action: $(this).find(".step_action").val(),
                    result: $(this).find(".step_result").val()
                };
        }
    });
    return testCase;
}

/****************************************************************************
 * CREATE TEST CASE - server returns:
 *      test case tree html element
 *      json of created test case
 ****************************************************************************/

function createTestCase(addAnother=false) {
    let newTestCase = getTestCaseDataFromForm();

    if(!newTestCase.title) {
        alert('Title is required');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/test-case/create",
        data: {
            'title': newTestCase.title,
            'suite_id': newTestCase.suite_id,
            'automated': newTestCase.automated,
            'data': JSON.stringify(newTestCase.data)
        },

        success: function (data) {  // response is case html and json
            let testCase = $.parseJSON(data.json);

            if(addAnother) {
                loadTestCaseCreateForm();
            } else {
                renderTestCase(testCase.id)
            }

            loadCasesList(testCase.suite_id);
        }
    });
}

/****************************************************************************
 * UPDATE TEST CASE
 ****************************************************************************/

function updateTestCase() {
    let updatingTestCase = getTestCaseDataFromForm();

    if(!updatingTestCase.title) {
        alert('Title is required');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/test-case/update",
        data: {
            'id': updatingTestCase.id,
            'title': updatingTestCase.title,
            'suite_id': updatingTestCase.suite_id,
            'automated': updatingTestCase.automated,
            'data': JSON.stringify(updatingTestCase.data)
        },
        success: function (data) {  // response is case html and json
            let testCase = $.parseJSON(data.json);
            renderTestCase(testCase.id)
            loadCasesList(testCase.suite_id);
        }
    });
}

/****************************************************************************
 * DELETE TEST CASE - delete from list
 ****************************************************************************/
function deleteTestCase(id) {
    $.ajax({
        url: "/test-case/delete",
        method: "POST",
        data: {
            "id": id,
        },
        success: function (data) {
            $("[data-case_id=" + id +"]").remove();

            if($('#tce_case_id').val() == id || $('#tce_case_id').text() == id) {
                closeTestCaseEditor();
            }
        }
    });
}
