/** stores whether requestAll or requestFiltered was called last, so the post/delete requests can refresh the table */
let lastRequestFunction = null;
let csvProperties = {};


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
    const header = csvProperties.map(property => `<th>${property.prettyName}</th>`);
    const rows = array.map(country => {
        const tds = csvProperties.map(property => `<td>${formatTableCell(country[property.name], 2)}</td>`).join("");
        return `<tr>${tds}</tr>`;
    });
    const thead = header.join("");
    const tbody = rows.join("");
    $("#table_head").html(thead);
    $("#table_body").html(tbody);
    applyShowHide();
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
        url +=
            `${lower}/${upper}`
        ;
    } else {
        url +=
            `${id}`
        ;

    }

    console.log(url);
    $.ajax({
        url: url,
        success: populateTable
    }).always(giveRequestFeedback("GET"));

    lastRequestFunction = requestFiltered;
}

function prettifyCsvHeader(name) {
    const withoutWs = name.replace(/_/g, " ");
    return withoutWs.replace("per", "/");
}

function formatTableCell(content, digits) {
    const x = Math.pow(10, digits);
    return isNaN(content) ? content : Math.round(content * x) / x;
}

function applyShowHide() {
    for (let i = 0; i < csvProperties.length; i++) {
        const targetState = csvProperties[i].shown;
        const cells = $(`#table tr :nth-child(${i + 1})`);
        console.log(targetState, cells);
        cells.toggle(targetState);
    }
}

$(() => {
    $.ajax({
        url: "/properties",
        success: data => {
            csvProperties = data.map(d => {
                return {
                    name: d,
                    shown: false,
                    prettyName: prettifyCsvHeader(d)
                }
            });
            // on initial page load, only show first 7 columns
            for (let i = 0; i < 7; i++) {
                csvProperties[i].shown = true;
            }
            const optionsHtml = data.map(d =>
                `<option>${d}</option>`).join("");
            $("#prop_selection").html(optionsHtml);
        },
    }).always(giveRequestFeedback("GET"));

    requestAll();

    $("#delete_request_history").click(() => {
        $("#request_status_table tbody").html("");
    });

    $("#hide_request_history").click(() => {
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

    $("#show_selected_prop").click(event => {
        event.preventDefault();
        const prop = $("#prop_selection").val();
        csvProperties.find(x => x.name === prop)["shown"] = true;
        console.log(csvProperties);
        applyShowHide();
    });

    $("#hide_selected_prop").click(event => {
        event.preventDefault();
        const prop = $("#prop_selection").val();
        csvProperties.find(x => x.name === prop)["shown"] = false;
        console.log(csvProperties);
        applyShowHide();
    });
});