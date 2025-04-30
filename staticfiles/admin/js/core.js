'use strict';

// Функція для створення елементів з можливістю додавання атрибутів
function quickElement(tagType, parentReference, textInChildNode, ...attributes) {
    const obj = document.createElement(tagType);
    if (textInChildNode) {
        const textNode = document.createTextNode(textInChildNode);
        obj.appendChild(textNode);
    }

    // Додавання атрибутів
    for (let i = 0; i < attributes.length; i += 2) {
        obj.setAttribute(attributes[i], attributes[i + 1]);
    }
    
    parentReference.appendChild(obj);
    return obj;
}

// Функція для видалення всіх дочірніх елементів
function removeChildren(a) {
    while (a.firstChild) {
        a.removeChild(a.firstChild);
    }
}

// Функції для знаходження позиції елементів на сторінці
function findPosX(obj) {
    let curleft = 0;
    while (obj) {
        curleft += obj.offsetLeft - obj.scrollLeft;
        obj = obj.offsetParent;
    }
    return curleft;
}

function findPosY(obj) {
    let curtop = 0;
    while (obj) {
        curtop += obj.offsetTop - obj.scrollTop;
        obj = obj.offsetParent;
    }
    return curtop;
}

// Розширення для об'єкта Date
{
    Date.prototype.getTwelveHours = function() {
        return this.getHours() % 12 || 12;
    };

    Date.prototype.getTwoDigitMonth = function() {
        return String(this.getMonth() + 1).padStart(2, '0');
    };

    Date.prototype.getTwoDigitDate = function() {
        return String(this.getDate()).padStart(2, '0');
    };

    Date.prototype.getTwoDigitTwelveHour = function() {
        return String(this.getTwelveHours()).padStart(2, '0');
    };

    Date.prototype.getTwoDigitHour = function() {
        return String(this.getHours()).padStart(2, '0');
    };

    Date.prototype.getTwoDigitMinute = function() {
        return String(this.getMinutes()).padStart(2, '0');
    };

    Date.prototype.getTwoDigitSecond = function() {
        return String(this.getSeconds()).padStart(2, '0');
    };

    Date.prototype.getAbbrevDayName = function() {
        return typeof window.CalendarNamespace === 'undefined'
            ? `0${this.getDay()}`
            : window.CalendarNamespace.daysOfWeekAbbrev[this.getDay()];
    };

    Date.prototype.getFullDayName = function() {
        return typeof window.CalendarNamespace === 'undefined'
            ? `0${this.getDay()}`
            : window.CalendarNamespace.daysOfWeek[this.getDay()];
    };

    Date.prototype.getAbbrevMonthName = function() {
        return typeof window.CalendarNamespace === 'undefined'
            ? this.getTwoDigitMonth()
            : window.CalendarNamespace.monthsOfYearAbbrev[this.getMonth()];
    };

    Date.prototype.getFullMonthName = function() {
        return typeof window.CalendarNamespace === 'undefined'
            ? this.getTwoDigitMonth()
            : window.CalendarNamespace.monthsOfYear[this.getMonth()];
    };

    Date.prototype.strftime = function(format) {
        const fields = {
            a: this.getAbbrevDayName(),
            A: this.getFullDayName(),
            b: this.getAbbrevMonthName(),
            B: this.getFullMonthName(),
            c: this.toString(),
            d: this.getTwoDigitDate(),
            H: this.getTwoDigitHour(),
            I: this.getTwoDigitTwelveHour(),
            m: this.getTwoDigitMonth(),
            M: this.getTwoDigitMinute(),
            p: this.getHours() >= 12 ? 'PM' : 'AM',
            S: this.getTwoDigitSecond(),
            w: `0${this.getDay()}`,
            x: this.toLocaleDateString(),
            X: this.toLocaleTimeString(),
            y: String(this.getFullYear()).substr(2, 4),
            Y: this.getFullYear(),
            '%': '%'
        };

        return format.replace(/%([a-zA-Z%])/g, (match, p1) => fields[p1] || match);
    };
}

// Розширення для об'єкта String
String.prototype.strptime = function(format) {
    const split_format = format.split(/[.\-/]/);
    const date = this.split(/[.\-/]/);
    let i = 0, day, month, year;
    while (i < split_format.length) {
        switch (split_format[i]) {
            case "%d": day = date[i]; break;
            case "%m": month = date[i] - 1; break;
            case "%Y": year = date[i]; break;
            case "%y":
                year = parseInt(date[i], 10) >= 69 ? date[i] : (new Date(Date.UTC(date[i], 0))).getUTCFullYear() + 100;
                break;
        }
        ++i;
    }

    // Створюємо об'єкт Date в UTC
    return new Date(Date.UTC(year, month, day));
};
