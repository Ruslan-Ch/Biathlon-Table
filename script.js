
// search-name

let phrase = document.querySelector('.search-text');

function tableSearch() {
    let table = document.querySelector('.table_sort');
    let regPhrase = new RegExp(phrase.value, 'i');
    let flag = false;
    for (let i = 1; i < table.rows.length; i++) {
        flag = false;
        for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }
    }
}
phrase.addEventListener('keyup', tableSearch, false);


// Get JSON

let xhr = new XMLHttpRequest();
xhr.open('GET', 'users.json', true);
xhr.send();

xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === 4) {
        if (xhr.status <= 400) {
            biathlonResult(JSON.parse(xhr.responseText));
        } else {
            console.log(xhr.status, xhr.statusText);
        }
    }
});

function biathlonResult(data) {
    const biatlonists = data.biatlonists;

    for (let key in biatlonists) {

        biatlonists.sort((a, b) => b.score - a.score);

        const tableBiatlonists = document.querySelector('tbody');
        const trBiatlonists = document.createElement("tr");
        const biatlonistsKey = biatlonists[key];

        for (let key in biatlonistsKey) {
            let td = document.createElement("td");
            td.innerHTML = biatlonistsKey[key];
            trBiatlonists.append(td);
            tableBiatlonists.append(trBiatlonists);
        }
    }
}


// table_sort

document.addEventListener('DOMContentLoaded', () => {

    const getSort = ({target}) => {
        const order = (target.dataset.order = -(target.dataset.order || -1));
        const index = [...target.parentNode.cells].indexOf(target);
        const collator = new Intl.Collator(['en', 'ru'], {numeric: true});
        const comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );

        for (const tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));

        for (const cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target);
    };

    document.querySelectorAll('.table_sort thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));

});

