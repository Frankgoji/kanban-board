// Make functions that deal with communicating with the server
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
    xmlhttp.send("date="+vals['date']+"&column="+vals['column']+"&title="+vals['title']+"&description="+vals['description']+"&addEvent=True");
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').setAttribute('value', new Date().toJSON().slice(0, 10));
}

var orig = '';
function edit(id) {
    var elem = document.getElementById(id);
    orig = elem.innerHTML;
    elem.removeAttribute('onclick');
    var data = elem.getAttribute('name');
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
    data = data.split('|');
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("date="+data[1]+"&column="+data[0]+"&title="+data[2]+"&description="+data[3]+"&deleteEvent=True");
}

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
    data = data.split('|');
    xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("date="+data[1]+"&column="+data[0]+"&title="+data[2]+"&description="+data[3]+"&deleteEvent=True");

    setTimeout(function(){xmlhttp.open("POST", "cgi-bin/event_data.py", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("date="+data[1]+"&column="+newCol+"&title="+data[2]+"&description="+data[3]+"&addEvent=True");}, 550);
}
