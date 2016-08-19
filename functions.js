// Make functions that deal with communicating with the server

/** Gets the table from the database */
function getTable() {
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
    xmlhttp.open("GET", "cgi-bin/event_data.py", true);
    xmlhttp.send();
}
getTable();

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
    vals['description'] = vals['description'].replace(/\n/g, '<br>');
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(encodeURI("date="+vals['date']+"&column="+vals['column']+"&title="+vals['title']+"&description="+vals['description']+"&addEvent=True"));
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').setAttribute('value', new Date().toJSON().slice(0, 10));
}

var orig = '';
/** Edits an entry, allowing for delete, column change, and canceling */
function edit(id) {
    var elem = document.getElementById(id);
    orig = elem.innerHTML;
    elem.removeAttribute('onclick');
    var data = unescape(elem.getAttribute('name')).replace(/'/g, '%27');
    var col = data.split('|')[0]
    var cols = ['do_pool', 'longterm', 'high_priority', 'doing', 'done'];
    var col_names = ['Do Pool', 'Longterm', 'High Priority', 'Doing', 'Done'];
    var modifier = '<div style="text-align:right"><b onclick="deleteEvent(\'' + data + '\')">X</b></div>';
    modifier += 'Move:<select id=\'change_select\' onchange="changeColumn(\'' + data + '\')">';
    modifier += '<option value="'+col+'">Current Column</option>';
    for (var i = 0; i < cols.length; i++) {
        if (col != cols[i]) {
            modifier += '<option value="'+cols[i]+'">'+col_names[i]+'</option>';
        }
    }
    modifier += '</select>';
    modifier += '<br>';
    modifier += '<center><input type="button" value="Cancel" onclick="getTable()"></center>';
    elem.innerHTML = modifier;
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
    data = decodeURI(data);
    data = data.split('|');
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("date="+data[1]+"&column="+data[0]+"&title="+data[2]+"&description="+data[3]+"&deleteEvent=True");
}

/** Changes the column of an event */
function changeColumn(data) {
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
    var newCol = document.getElementById('change_select').value;
    data = decodeURI(data);
    data = data.split('|');
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("date="+data[1]+"&column="+data[0]+"&title="+data[2]+"&description="+data[3]+"&deleteEvent=True");

    setTimeout(function(){xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("date="+data[1]+"&column="+newCol+"&title="+data[2]+"&description="+data[3]+"&addEvent=True");}, 550);
}

/** Creates the format to add a cell */
function addCell(id) {
    var cell = document.getElementById(id);
    var col = id.substring(0, id.length - 'button'.length);
    cell.innerHTML = '';
    var h3 = createElem('h3', 'Create Event', [['style', 'text-align:center']]);
    var form = createElem('form', '', [['style', 'text-align:center']]);
    var title = createElem('input', '', [['id', 'title'], ['type', 'text'], ['name', 'title'], ['value', ''], ['maxlength', '30']]);
    var date = createElem('input', '', [['id', 'date'], ['type', 'date'], ['name', 'date'], ['value', '']]);
    var script = createElem('script', 'document.getElementById("date").setAttribute("value", new Date().toJSON().slice(0,10))', []);
    var description = createElem('textarea', '', [['id', 'description'], ['name', 'description'], ['value', ''], ['rows', '2'], ['cols', '30']]);
    var submit = createElem('input', '', [['type', 'button'], ['value', 'Submit'], ['onclick', 'addEvent()']]);
    var cancel = createElem('input', '', [['type', 'button'], ['value', 'Cancel'], ['onclick', 'getTable()']]);
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
