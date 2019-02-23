let obj = {
    name: 'name',
    beginDate: new Date(2019, 11, 11),
    endDate: new Date(2019, 11, 11, 23)
}

const hourOffset = 4;

let timersTable = document.getElementById("timers_01");

let tbody = timersTable.getElementsByTagName("tbody");
tbody[0].lastElementChild.insertAdjacentHTML("beforeBegin", createTableRowHTML(obj));
//console.dir(tbody[0].lastChild);
let addingBtn = timersTable.getElementsByTagName("button");

addingBtn[0].onclick = (e) => {

    // let dateEl = document.getElementById("modalDate");
    // dateEl.value = "2012-02-02";
    let dateEl = document.getElementById("modalDate");
    let nowDate = new Date();
    nowDate.setHours(nowDate.getHours() + hourOffset);
    dateEl.value = nowDate.toISOString().slice(0, -8);
    document.getElementById("modal").classList.remove("hidden");
    
    //alert(new Date().toISOString().slice(0, -8));
    let modalBtn = document.getElementById("modalAddingBtn");
    modalBtn.onclick = addRow.bind(this, tbody[0].lastElementChild);
}

function addRow(elem, e) {
    let modal = document.getElementById('modal');
    let nameEl = document.getElementById("modalText");
    let dateEl = document.getElementById("modalDate");
    let timeEl = document.getElementById("modalTime");

    let startDate = new Date(dateEl.value + "Z");
    let finishDate = new Date(startDate.getTime());
    let time = timeEl.value;
    if (time) {
        finishDate.setHours(finishDate.getHours() + (+time.slice(0,2)));
        finishDate.setMinutes(finishDate.getMinutes() + (+time.slice(3)));
    }

    let rowItem = {
        name: nameEl.value,
        beginDate: startDate,
        endDate: finishDate
    }
    elem.insertAdjacentHTML("beforeBegin", createTableRowHTML(rowItem));
    
    modal.classList.add('hidden');
    e.target.onclick = null;
}


function createTableRowHTML (item) {
    let result = "<tr><td>" + item.name + "</td><td>";
    result += formatDate(item.beginDate) + "</td><td>";
    let options = {
        timeZone: "UTC"
    }
    result += item.beginDate.toLocaleTimeString("ru", options) + "</td><td>";
    result += item.endDate.toLocaleTimeString("ru", options) + "</td><td>";

    result += "--:--:--</td></tr>";
    return result;
}

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
  
    return dd + '.' + mm + '.' + yy;
  }