/** stores whether requestAll or requestFiltered was called last, so the post/delete requests can refresh the table */
let lastRequestFunction = null;


function giveRequestFeedback(requestType) {
    return (arg1, arg2, arg3) => {
        const requestObj = (typeof arg3).toLowerCase() === "string" ? arg1 : arg3;
        const statusMessage = requestObj.status === 200 ? "success" : requestObj.responseText;
        console.log(requestType, requestObj);
        giveRequestFeedbackSaneArguments(requestObj.status, statusMessage, requestType);
    }

}

function giveRequestFeedbackSaneArguments(statusCode, statusMessage, requestType) {
    const statusClass = statusCode === 200 ? "success" : "failure";
    const tr = `<tr class="${statusClass}">
        <td>${new Date()}</td>
        <td>${requestType}</td>
        <td>${statusCode}</td>
        <td>${statusMessage}</td>
    </tr>`;
    $("#request_status_table tbody").append(tr);

}

function populateTable(array) {
    if (!Array.isArray(array)) {
        array = [array];
    }
    const rows = array.map(country => {
        return `
        <tr>
            <td>${country.id}</td>
            <td>${country.name}</td>
            <td>${country.birth_rate_per_1000}</td>
            <td>${country.cell_phones_per_100}</td>
            <td>${country.children_per_woman}</td>
            <td>${country.electricity_consumption_per_capita}</td>
            <td>${country.internet_user_per_100}</td>
        </tr>`;
    });
    const tbody = rows.join("");
    $("#table_body").html(tbody);

}

function requestAll() {
    $.ajax({
        url: "/items",
        success: populateTable
    }).always(giveRequestFeedback("GET"));
    lastRequestFunction = requestAll;
}

function requestFiltered() {
    const id = $("#country_filter_id").val().replace(/\s+/g, "");
    const idRange = $("#country_filter_range").val().replace(/\s+/g, "");
    let url = "/items/";
    if (idRange) {
        const range = idRange.match(/(\w+)-(\w+)/);
        const lower = range[1];
        const upper = range[2];
        url += `${lower}/${upper}`;
    } else {
        url += `${id}`;

    }

    console.log(url);
    $.ajax({
        url: url,
        success: populateTable
    }).always(giveRequestFeedback("GET"));

    lastRequestFunction = requestFiltered;
}

$(() => {
    $.ajax({
        url: "/properties",
        success: data => {
            const optionsHtml = data.map(d => `<option>${d}</option>`).join("");
            $("#prop_selection").html(optionsHtml);
        },
    }).always(giveRequestFeedback("GET"));

    requestAll();

    $("#delete_request_history").click(() => {
        $("#request_status_table tbody").html("");
    });

    $("#hide_request_history").click(event => {
        $("#request_status_container").toggle(500, () => {
            const visible = $("#request_status_container").is(":visible");
            $("#hide_request_history").text(visible ? "(hide request history)" : "(show request history)");
        });
    });

    $("#country_filter").submit(event => {
        event.preventDefault();
        requestFiltered();
    });

    $("#country_add").submit(event => {
        event.preventDefault();
        const data = {
            name: $("#country_name").val(),
            birth_rate_per_1000: $("#country_birth").val(),
            cell_phones_per_100: $("#country_cellphone").val()
        };
        $.ajax({
            url: "/items",
            type: "POST",
            contentType: "application/json",
            processData: true,
            data: JSON.stringify(data),
            success: lastRequestFunction()
        }).always(giveRequestFeedback("POST"));
    });

    $("#country_delete").submit(event => {
        event.preventDefault();
        const id = $("#country_delete_id").val();
        $.ajax({
            url: `/items/${id}`,
            type: "DELETE",
            success: lastRequestFunction()
        }).always(giveRequestFeedback("DELETE"));
    });
});