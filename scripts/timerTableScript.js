function addTimersTableAction(timersTable) {
const HOUR_OFFSET = 4;
const MINUTE_COST = 1.6667;
let timeOptions = {
    timeZone: "UTC"
}

timersTable.onclick = function(event) {
    var target = event.target;

    if(target.dataset.action == "addRow") {
        
        doAddingBtnAction(event);
    }

    if(target.dataset.action == "deleteRow") {
        doDeletingBtnAction(event);
    }
}


let rowItems = [];

// Load from localStorage
if (text = localStorage.getItem(timersTable.id)) {
    rowItems = JSON.parse(text, function(key, value) {
        if (key == 'beginDate' || key == 'endDate') return new Date(value);
        return value;
      });
}

// Save in localStorage
window.addEventListener("beforeunload", function () {
    localStorage.setItem(timersTable.id, JSON.stringify(rowItems));
});

for (let i = 0; i < rowItems.length; i++)
{
    addRow(timersTable.tBodies[0].lastElementChild, rowItems[i]);
}

function doAddingBtnAction (e) {
    let dateEl = document.getElementById("modalDate");
    let nowDate = new Date();
    let modalBtn = document.getElementById("modalAddingBtn");

    nowDate.setHours(nowDate.getHours() + HOUR_OFFSET);
    dateEl.value = nowDate.toISOString().slice(0, -8);
    document.getElementById("modal").classList.remove("hidden");

    modalBtn.onclick = createAndAddRow.bind(this, timersTable.tBodies[0].lastElementChild);
}

function doDeletingBtnAction (e) {
    let targetRow = e.target.closest('tr');
    let indexRowItem = targetRow.rowIndex - 1;
    let rowItem = rowItems[indexRowItem];

    rowItem.beginDate = null;
    rowItem.endDate = null;
    rowItems.splice(indexRowItem, 1);

    targetRow.remove();
}

function createAndAddRow(elem, e){
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
        //finishDate.setSeconds(new Date().getSeconds());
    }

    let rowItem = {
        name: nameEl.value,
        beginDate: startDate,
        endDate: finishDate,
        gameTime: time
    }

    addRow(elem, rowItem);
    rowItems.push(rowItem);
    modal.classList.add('hidden');
    e.target.onclick = null;
}

function addRow(elem, item) {
    elem.insertAdjacentHTML("beforeBegin", createTableRowHTML(item));
    addTimerInElem(elem.previousElementSibling.querySelector(".timer"), item.beginDate, item.endDate);
}

function createTableRowHTML (item) {
    let result = "<tr><td>" + item.name + "</td><td>";
    result += formatDate(item.beginDate) + "</td><td>";
    result += item.beginDate.toLocaleTimeString("ru", timeOptions) + "</td><td>";
    result += item.endDate.toLocaleTimeString("ru", timeOptions) + "</td><td>";
    let differenceDate = (item.endDate - item.beginDate) / 1000 / 60;
    let cost = Math.round(differenceDate * MINUTE_COST)
    result += item.gameTime + " / " + cost +" р.</td>";

    result += "<td class = \"timer\">--:--:--</td><td><button class=\"btn btn-delete\" data-action=\"deleteRow\">x</button></td></tr>";
    return result;
}

function addTimerInElem(elem, startDate, endDate)
{
    let timerId = setTimeout(function go() {
        let nowDate = new Date();
        nowDate.setHours(nowDate.getHours() + HOUR_OFFSET);
        if (startDate > nowDate) {
            setTimeout(go, 2000);
        }
        else if (endDate > nowDate) {
            let restOfTime = new Date(endDate - nowDate);
            elem.textContent = restOfTime.toLocaleTimeString("ru", timeOptions);
            setTimeout(go, 1000);
        }

        if (endDate < nowDate)
        {
            elem.textContent = "Закончен";
        }
      }, 10);
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
}