$(() => {
    $.ajax({
        url: "/properties",
        success: data => {
            console.log(data);
            const optionsHtml = data.map(d => `<option>${d}</option>`).join("");
            $("#prop_selection").html(optionsHtml);
        }
    });

    $("#country_add").submit((event) => {
        alert("submitted");
        event.preventDefault();
    });
});