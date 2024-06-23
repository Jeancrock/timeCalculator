document.getElementById("heure").value = "";
document.getElementById("jour").value = "";
document.getElementById("doneToday").checked = false;

let doneToday = document.getElementById("doneToday").checked;
let doneMinutes;
let HPDTxt;
let MPDTxt;

// Elmt recuperes
let ignoredDays = 0;

// Elmt de reponse
let totalMonth = document.getElementById("totalMonth");
let totalToday = document.getElementById("totalToday");

// variables de reponse
let totalDaysInMonth = 0;
let remainingDays = 0;
let workingDaysPast = 0;
let waitedTimeForTonight = 0;
let totalHoursInMonth = 0;

// Elmt de date
const now = new Date();
const openDay = now.getDay() != 0 && now.getDay() != 6;
const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

// Calcul des valeurs
for (let date = new Date(firstOfMonth);
    date < firstOfNextMonth;
    date.setDate(date.getDate() + 1)) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
        if (date.getDate() < now.getDate()) {
            workingDaysPast++;
        } else {
            remainingDays++;
        }
        totalDaysInMonth++;
    }
}

let buff = remainingDays;

totalHoursInMonth = totalDaysInMonth * 7;
totalMonth.innerHTML = totalHoursInMonth + "h";

async function Start() {

    if (typeof (document.getElementById("jour").value) != null &&
        typeof (Number(document.getElementById("jour").value)) == "number") {
        ignoredDays = Number(document.getElementById("jour").value);
    } else {
        ignoredDays = 0;
    }

    waitedTimeForTonight = workingDaysPast * 7 - ignoredDays * 7;

    if (openDay) {
        waitedTimeForTonight += 7;
    }

    // Retour des valeurs
    totalToday.innerHTML = waitedTimeForTonight + "h";
    calculate()

}

async function DoneTime(arg) {
    let hoursTxt = "";
    let minutesTxt = "";
    let hoursParsed = false;

    for (let k of arg) {
        if (k === '.' ||
            k === ',' ||
            k === ':' ||
            k === 'h') {
            hoursParsed = true;
            continue;
        }
        if (hoursParsed) {
            minutesTxt += k;
        } else {
            hoursTxt += k;
        }
    }
    return [hoursTxt, minutesTxt];
}

async function calculate() {

    doneToday = document.getElementById("doneToday").checked;
    let difference = document.getElementById("difference");
    let nature = document.getElementById("nature");

    // Calcul du retard/avance
    // Elmt recuperes
    let doneTime = "";
    if (typeof (document.getElementById("heure").value) != null &&
        typeof (Number(document.getElementById("heure").value)) == "number") {
        doneTime = document.getElementById("heure").value;
    }

    let timeTxt = await DoneTime(doneTime);
    let doneHours = Number(timeTxt[0]);

    doneMinutes = Number(timeTxt[1]) + doneHours * 60;

    let diffValue = waitedTimeForTonight * 60 - doneMinutes - 420;

    if (doneToday
        || !openDay) {
        diffValue += 420;
    }

    let diffNature = "de retard.";

    if (diffValue < 0) {
        diffValue = - diffValue;
        diffNature = "d'avance .";
    }
    nature.innerHTML = diffNature;
    let diffHour;
    diffHour = Math.floor(diffValue / 60);
    let diffMn = (diffValue % 60);
    if (now.getDate())
        if (diffHour > 0) {
            diffHour = diffHour + "h";
        } else {
            diffHour = "";
        }
    if (diffMn > 0) {
        if (diffMn < 10) {
            diffMn = "0" + diffMn;
        }
        diffMn = diffMn + "mn";

    } else {
        diffMn = "";
    }
    if (doneTime != "") {
        difference.innerHTML = "J'ai " + diffHour + diffMn;
    } else {
        difference.innerHTML = "";
        nature.innerHTML = "";
    }
    if (diffMn == "" && diffHour == "") {
        difference.innerHTML = "Je suis à jour.";
        nature.innerHTML = "";
    }
    let rythme = document.getElementById("rythme");

    timePerDay()
    let finish = HPDTxt + MPDTxt;
    rythme.innerHTML = "Je dois faire " + finish + "/j.";
    if (totalHoursInMonth <= doneMinutes / 60) {
        rythme.innerHTML = "Je suis à jour.";
    }
    if (document.getElementById("heure").value == ""
        && document.getElementById("jour").value == "") {
        difference.innerHTML = "";
        nature.innerHTML = "";
        rythme.innerHTML = "";
    }
}

async function timePerDay() {

    let tmp = doneMinutes;
    if (tmp == undefined) {
        tmp = 0;
    }
    tmp += ignoredDays * 7 * 60
    let remainingMn = totalHoursInMonth * 60 - tmp;

    console.log(doneToday)
    if (doneToday
        && openDay) {
        buff = remainingDays - 1;
    } else if (!doneToday
        && openDay) {
        buff = remainingDays;
    }
    remainingMn /= buff

    let tmpHr = Math.floor(remainingMn / 60);
    console.log("tmpHr", tmpHr)

    let tmpMn = Math.ceil(remainingMn - tmpHr * 60);
    console.log("tmpMn", tmpMn)

    let hourPerD = Math.floor(tmpHr);
    // let hourPerD = Math.floor((remainingMn / 60) / remainingDays);
    HPDTxt = hourPerD + "h";

    MPDTxt = tmpMn + "mn";
}

Start()

document.getElementById("heure").addEventListener('input', Start);
document.getElementById("jour").addEventListener('input', Start);
document.getElementById("doneToday").addEventListener('click', Start)
