window.onload = function () {
    console.log("hello world");
    const generatedLinks = populateShowHideMenu();
    hideLastColumns(generatedLinks, 7);
    addSortingFeature();

    document.getElementById("navbutton").onclick = toggleNavigation;
    window.onresize = () => {
        toggleNavigation(true)
    };
};

function hideLastColumns(showHideLinks, howManyToShow) {
    for (let i = howManyToShow; i < showHideLinks.length; i++) {
        showHideLinks[i].click();
    }
}

/** creates show/hide <a> tags for every table column*/
function populateShowHideMenu() {
    const menu = document.getElementById("showhide");
    const menu_ul = menu.getElementsByTagName("ul")[0];
    const table = document.getElementById("table");

    const generatedLinks = [];

    let count = 0;

    for (const h of table.getElementsByTagName("th")) {
        count++;

        const separator_li = document.createElement("li");
        separator_li.innerText = "|";
        menu_ul.appendChild(separator_li);

        const link_li = document.createElement("li");
        const a = document.createElement("a");
        a.innerText = h.innerText;
        const colclass = "col_" + count;
        a.onclick = () => {
            hideColumn(a, table, colclass)
        };
        generatedLinks.push(a);
        link_li.appendChild(a);
        menu_ul.appendChild(link_li);
    }

    return generatedLinks;
}

function hideColumn(callee, table, column) {
    console.log("hide column " + column);
    for (const element of table.getElementsByClassName(column)) {
        element.style.display = "none";
    }
    callee.classList.add("hidden");
    callee.onclick = () => {
        showColumn(callee, table, column)
    };
}

function showColumn(callee, table, column) {
    console.log("show column " + column);
    for (const element of table.getElementsByClassName(column)) {
        element.style.display = "table-cell";
    }
    callee.classList.remove("hidden");
    callee.onclick = () => {
        hideColumn(callee, table, column)
    };
}

function addSortingFeature() {
    const table = document.getElementById("table");
    const tbody = table.getElementsByTagName("tbody")[0];
    for (const th of table.getElementsByTagName("th")) {
        console.log(th);
        th.innerHTML += '<i class="fa fa-angle-down"></i>';
        th.innerHTML += '<i class="fa fa-angle-up"></i>';
    }
    for (const fa of table.getElementsByClassName("fa-angle-down")) {
        fa.onclick = () => {
            sortClick(fa, "asc", table)
        };
    }
    for (const fa of table.getElementsByClassName("fa-angle-up")) {
        fa.onclick = () => {
            sortClick(fa, "desc", table)
        };
    }
}

function sortClick(callee, order, table) {
    const old_tbody = table.getElementsByTagName("tbody")[0];
    const rows = old_tbody.getElementsByTagName("tr");
    const new_tbody = document.createElement("tbody");

    const index = callee.parentElement.cellIndex;
    if (!(index >= 0)) {
        throw "failed to resolve column index";
    }

    const sorted_rows = Array.from(rows);
    sorted_rows.sort((a, b) => {
        let x = a.children[index].innerText;
        let y = b.children[index].innerText;

        const intX = parseFloat(x);
        const intY = parseFloat(y);

        if (!isNaN(intX) && !isNaN(intY)) {
            x = intX;
            y = intY;
        }

        if (x === y) {
            return 0;
        } else {
            return (x < y) ? -1 : 1;
        }
    });
    if (order === "desc") {
        sorted_rows.reverse();
    }
    for (const row of sorted_rows) {
        new_tbody.appendChild(row);
    }
    table.replaceChild(new_tbody, old_tbody);

    // now it's time to fix the arrow colors
    for (const fa of table.getElementsByClassName("fa")) {
        fa.classList.remove("active");
    }
    callee.classList.add("active");
}

function toggleNavigation(forceHide) {
    for (const item of document.getElementsByClassName("navitem")) {
        if (forceHide === true) {
            item.classList.add("hidden");
        } else {
            item.classList.toggle("hidden");
        }
    }
}