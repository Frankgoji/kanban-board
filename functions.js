// Make functions that deal with communicating with the server

var is_editing = false;
/** Gets the table from the database */
function getTable(showAll) {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("board").innerHTML = xmlhttp.responseText;
        }
    };
    var show = (showAll) ? "showAll=True" : "";
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(show);
    is_editing = false;
}

function init() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("board").innerHTML = xmlhttp.responseText;
        }
    };
    var pass = prompt('Password:');
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send('password=' + pass);
    is_editing = false;
}
init();

/** Adds a single event to the database, then updates the table */
function addEvent() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("board").innerHTML = xmlhttp.responseText;
        }
    };
    var ids = ['date', 'column', 'title', 'description'];
    var vals = {'date': '', 'column': '', 'title': '', 'description': ''};
    for (var i = 0; i < ids.length; i++) {
        vals[ids[i]] = document.getElementById(ids[i]).value;
    }
    vals['description'] = escape(vals['description'].replace(/\n/g, '<br>'));
    // Check for Google Calendar
    var gcal = document.getElementById('googlecal');
    if (gcal.checked) {
        var gcalLink = "https://www.google.com/calendar/event?action=TEMPLATE&";
        if (mobilecheck()) {
            gcalLink = "https://calendar.google.com/calendar/gp#~calendar:view=e&bm=1&";
        }
        var d1 = new Date(vals['date']);
        var localOffset = d1.getTimezoneOffset() * 60000;
        d1 = new Date(d1.getTime() + localOffset);
        var d2 = new Date(d1);
        d2.setHours(d2.getHours() + 1);
        var dates = d1.toISOString().replace(/-|:|\.\d\d\d/g,"") + "/" + d2.toISOString().replace(/-|:|\.\d\d\d/g,"");
        gcalLink += "text=" + vals['title'] + "&dates=" + dates + "&details=" + vals['description'] + "&location=&trp=false&sprop=&sprop=name:";
        window.open(gcalLink);
    }
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(encodeURI("date="+vals['date']+"&column="+vals['column']+"&title=")+encodeURIComponent(vals['title'])+"&description="+encodeURIComponent(vals['description'])+"&addEvent=True");
	is_editing = false;
}

var orig = '';
/** Edits an entry, allowing for delete, column change, and canceling */
function edit(id) {
    if (is_editing) {
        return;
    }
    is_editing = true;
    var elem = document.getElementById(id);
    orig = elem.innerHTML;
    elem.removeAttribute('onclick');
    var data = elem.getAttribute('name');
    var old_data = data.split('|');
    var col = old_data[0];
	old_data[3] = unescape(old_data[3]).replace(/\<br\>/g, '\n');
    old_data[2] = unescape(old_data[2]);
    var cols = ['do_pool', 'longterm', 'high_priority', 'doing', 'done'];
    var col_names = ['Do Pool', 'Longterm', 'High Priority', 'Doing', 'Done'];
    // create the edit elements
    var right_x = createElem('div', '', [['style', 'text-align:right']]);
    right_x.appendChild(createElem('b', 'X', [['onclick', 'deleteEvent("' + data + '")']]));
    var form = createElem('form', '', [['style', 'text-align:center']]);
    var title = createElem('input', '', [['id', 'title'], ['type', 'text'], ['name', 'title'], ['value', old_data[2]], ['maxlength', '30']]);
    var date = createElem('input', '', [['id', 'date'], ['type', 'date'], ['name', 'date'], ['value', old_data[1]]]);
    var description = createElem('textarea', old_data[3], [['id', 'description'], ['name', 'description'], ['rows', '2'], ['cols', '30']]);
    var cancel = createElem('input', '', [['type', 'button'], ['value', 'Cancel'], ['onclick', 'getTable(false)']]);
    var select = createElem('select', '', [['id', 'column'], ['onchange', 'changeEvent("' + data + '")']]);
    select.appendChild(createElem('option', 'Current Column', [['value', col]]));
    for (var i = 0; i < cols.length; i++) {
        if (col != cols[i]) {
            select.appendChild(createElem('option', col_names[i], [['value', cols[i]]]));
        }
    }
    var submit = createElem('center', '', []);
    submit.appendChild(createElem('input', '', [['type', 'button'], ['value', 'Submit'], ['onclick', 'changeEvent("'+data+'")']]));
    var cancel = createElem('center', '', []);
    cancel.appendChild(createElem('input', '', [['type', 'button'], ['value', 'Cancel'], ['onclick', 'getTable(false)']]));
    var googlecal = createElem('input', '', [['id', 'googlecal'], ['type', 'checkbox'], ['name', 'gcal'], ['value', 'true']]);
    // add the elements to the cell
    elem.innerHTML = '';
    elem.appendChild(right_x);
    elem.appendChild(form);
    form.appendChild(document.createTextNode('Title:'));
    form.appendChild(title);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createTextNode('Date:'));
    form.appendChild(date);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createTextNode('Description:'));
    form.appendChild(description);
    form.appendChild(document.createElement('br'));
    form.innerHTML += 'Move:';
    form.appendChild(select);
    form.appendChild(document.createElement('br'));
    form.appendChild(googlecal);
    form.appendChild(document.createTextNode('Create Google Calendar?'));
    form.appendChild(submit);
    form.appendChild(cancel);
}

/** Edits an event by deleting the old one and adding the new one */
function changeEvent(data) {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("board").innerHTML = xmlhttp.responseText;
        }
    };
    data = decodeURI(unescape(data));
    data = data.split('|');
    INFO = encodeURI("deldate="+data[1]+"&delcolumn="+data[0]+"&deltitle=")+encodeURIComponent(data[2])+"&deldescription="+encodeURIComponent(data[3]);
    var ids = ['date', 'column', 'title', 'description'];
    var vals = {'date': '', 'column': '', 'title': '', 'description': ''};
    for (var i = 0; i < ids.length; i++) {
        vals[ids[i]] = document.getElementById(ids[i]).value;
    }
    vals['description'] = escape(vals['description'].replace(/\n/g, '<br>'));
    INFO += encodeURI("&adddate="+vals['date']+"&addcolumn="+vals['column']+"&addtitle=")+encodeURIComponent(vals['title'])+"&adddescription="+encodeURIComponent(vals['description'])+"&editEvent=True";
    // Check for Google Calendar
    var gcal = document.getElementById('googlecal');
    if (gcal.checked) {
        var gcalLink = "https://www.google.com/calendar/event?action=TEMPLATE&";
        if (mobilecheck()) {
            gcalLink = "https://calendar.google.com/calendar/gp#~calendar:view=e&bm=1&";
        }
        var d1 = new Date(vals['date']);
        var localOffset = d1.getTimezoneOffset() * 60000;
        d1 = new Date(d1.getTime() + localOffset);
        var d2 = new Date(d1);
        d2.setHours(d2.getHours() + 1);
        var dates = d1.toISOString().replace(/-|:|\.\d\d\d/g,"") + "/" + d2.toISOString().replace(/-|:|\.\d\d\d/g,"");
        gcalLink += "text=" + vals['title'] + "&dates=" + dates + "&details=" + vals['description'] + "&location=&trp=false&sprop=&sprop=name:";
        window.open(gcalLink);
    }
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(INFO);
    is_editing = false;
}

/** Deletes an event */
function deleteEvent(data) {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("board").innerHTML = xmlhttp.responseText;
        }
    };
    data = decodeURI(unescape(data));
    data = data.split('|');
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(encodeURI("date="+data[1]+"&column="+data[0]+"&title=")+encodeURIComponent(data[2])+"&description="+encodeURIComponent(data[3])+"&deleteEvent=True");
    is_editing = false;
}

/** Creates the format to add a cell */
function addCell(id) {
    if (is_editing) {
        return;
    }
	is_editing = true;
    var cell = document.getElementById(id);
    var col = id.substring(0, id.length - 'button'.length);
    cell.innerHTML = '';
    var h3 = createElem('h3', 'Create Event', [['style', 'text-align:center']]);
    var form = createElem('form', '', [['style', 'text-align:center']]);
    var title = createElem('input', '', [['id', 'title'], ['type', 'text'], ['name', 'title'], ['value', ''], ['maxlength', '30']]);
    var date = createElem('input', '', [['id', 'date'], ['type', 'date'], ['name', 'date'], ['value', '']]);
    var script = createElem('script', 'document.getElementById("date").setAttribute("value", parseDate(new Date()))', []);
    var description = createElem('textarea', '', [['id', 'description'], ['name', 'description'], ['value', ''], ['rows', '2'], ['cols', '30']]);
    var submit = createElem('input', '', [['type', 'button'], ['value', 'Submit'], ['onclick', 'addEvent()']]);
    var cancel = createElem('input', '', [['type', 'button'], ['value', 'Cancel'], ['onclick', 'getTable(false)']]);
    var col = createElem('input', '', [['type', 'button'], ['id', 'column'], ['value', col], ['style', 'display:none']]);
    var googlecal = createElem('input', '', [['id', 'googlecal'], ['type', 'checkbox'], ['name', 'gcal'], ['value', 'true']]);
    cell.appendChild(h3);
    cell.appendChild(form);
    form.appendChild(document.createTextNode('Title:'));
    form.appendChild(title);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createTextNode('Date:'));
    form.appendChild(date);
    form.appendChild(script);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createTextNode('Description:'));
    form.appendChild(description);
    form.appendChild(document.createElement('br'));
    form.appendChild(col);
    form.appendChild(googlecal);
    form.appendChild(document.createTextNode('Create Google Calendar?'));
    form.appendChild(document.createElement('br'));
    form.appendChild(submit);
    form.appendChild(cancel);
}

/** Parses a date object to a string that can be used in SQLite */
function parseDate(date) {
    var d = date.getFullYear().toString() + '-';
    var month = (date.getMonth() + 1).toString();
    if (month.length == 1) {
        month = '0' + month;
    }
    var day = date.getDate().toString();
    if (day.length == 1) {
        day = '0' + day;
    }
    return d + month + '-' + day;
}

/** Creates a given element with a given text element and attributes */
function createElem(name, text, attributes) {
    var elem = document.createElement(name);
    if (text != '') {
        elem.innerHTML = text;
    }
    for (var i = 0; i < attributes.length; i++) {
        var pair = attributes[i];
        elem.setAttribute(pair[0], pair[1]);
    }
    return elem;
}

/** Detects if the browser is mobile or not
 *  Found on stack overflow */
function mobilecheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}
