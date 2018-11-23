function giveRequestFeedback(arg1, arg2, arg3) {
    const requestObj = (typeof arg3).toLowerCase() === "string" ? arg1 : arg3;
    const statusMessage = requestObj.status === 200 ? "success" : requestObj.responseText;
    giveRequestFeedbackSaneArguments(requestObj.status, statusMessage);
}

function giveRequestFeedbackSaneArguments(statusCode, statusMessage) {
    const statusClass = statusCode === 200 ? "success" : "failure";
    const tr = `<tr class="${statusClass}">
        <td>${new Date()}</td>
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

$(() => {
    $.ajax({
        url: "/properties",
        success: data => {
            const optionsHtml = data.map(d => `<option>${d}</option>`).join("");
            $("#prop_selection").html(optionsHtml);
        },
    }).always(giveRequestFeedback);

    $.ajax({
        url: "/items",
        success: populateTable
    }).always(giveRequestFeedback);

    $("#delete_request_history").click(() => {
        $("#request_status_table tbody").html("");
    });

    $("#country_filter").submit(event => {
        event.preventDefault();
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
        }).always(giveRequestFeedback);
    });
});