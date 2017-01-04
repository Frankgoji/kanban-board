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
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(encodeURI("date="+vals['date']+"&column="+vals['column']+"&title="+vals['title']+"&description="+vals['description']+"&addEvent=True"));
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
    INFO = encodeURI("deldate="+data[1]+"&delcolumn="+data[0]+"&deltitle="+data[2]+"&deldescription="+escape(data[3]));
    var ids = ['date', 'column', 'title', 'description'];
    var vals = {'date': '', 'column': '', 'title': '', 'description': ''};
    for (var i = 0; i < ids.length; i++) {
        vals[ids[i]] = document.getElementById(ids[i]).value;
    }
    vals['description'] = escape(vals['description'].replace(/\n/g, '<br>'));
    INFO += encodeURI("&adddate="+vals['date']+"&addcolumn="+vals['column']+"&addtitle="+vals['title']+"&adddescription="+vals['description']+"&editEvent=True");
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
    xmlhttp.send(encodeURI("date="+data[1]+"&column="+data[0]+"&title="+data[2]+"&description="+escape(data[3])+"&deleteEvent=True"));
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
