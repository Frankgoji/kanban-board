#! /usr/bin/python3
# Communicates with Sqlite3 database

import cgi, cgitb, sqlite3, datetime
from urllib.parse import quote

def fill_table():
    """ prints html to fill in the rest of the table """
    cols = {'do_pool': [], 'longterm': [], 'high_priority': [], 'doing': [],
            'done': []}
    col_list = ['do_pool', 'longterm', 'high_priority', 'doing', 'done']
    for col in cols:
        cols[col] = [row for row in c.execute('select * from events where column=? order by -date', (col,))]
        cols[col].append(col+'button')
    i = 0
    while not all((len(stack) == 0 for stack in cols.values())):
        events_rows = []
        for col in col_list:
            events_rows.append(cols[col].pop(0) if len(cols[col]) > 0 else None)
        create_row(events_rows, i)
        i += 1

def create_row(event_list, row_num):
    """ html for row """
    print('<tr style="height:auto">')
    for event in event_list:
        create_event(event, row_num)
    print('</tr>')

def create_event(event, row_num):
    """ html for an individual event """
    if not event:
        print('<td>')
    elif 'button' in event:
        cell_id = event
        print('<td id="{0}" style="vertical-align:middle">'.format(cell_id))
        print('<center><h1 onclick="addCell(\'{0}\')">+</h1></center>'.format(cell_id))
    else:
        date, col, title, desc = event
        name = "{0}|{1}|{2}|{3}".format(quote(col),
                                        quote(date),
                                        quote(title),
                                        quote(desc))
        cell_id = 'id="{0}{1}" onclick="edit(\'{0}{1}\')" name="{2}"'.format(col, row_num, name)
        print('<td {0}>'.format(cell_id))
        print('<b style="font-size:1.2em">{0}</b>'.format(title))
        print(date)
        print('<br>')
        print(desc)
    print('</td>')

conn = sqlite3.connect('events.db')
c = conn.cursor()

try:
    c.execute('select * from events')
except sqlite3.OperationalError as oe:
    c.execute('create table events (date date, column text, title text, description text)')
    c.execute('select * from events')

print("Content-type: text/html\n")

base_table = """
<table style='width:100%;border-collapse:collapse' border=1>
    <col style='width:20%;background-color:#80FF80'>
    <col style='width:20%;background-color:#FFFF66'>
    <col style='width:20%;background-color:#FF6666'>
    <col style='width:20%;background-color:#FF944D'>
    <col style='width:20%;background-color:#C2C2A3'>
    <tr>
        <th style='background-color:#99FF99'>Do Pool</th>
        <th style='background-color:#FFFF80'>Longterm</th>
        <th style='background-color:#FF8080'>High Priority</th>
        <th style='background-color:#FFA366'>Doing</th>
        <th style='background-color:#CCCCB2'>Done</th>
    </tr>
"""

# TODO: execute necessary functions
# process cgi information
form = cgi.FieldStorage()
if 'addEvent' in form:
    c.execute('insert into events (date, column, title, description) values \
            (?, ?, ?, ?)', (form.getvalue('date', ''),
                            form.getvalue('column', ''),
                            form.getvalue('title', ''),
                            form.getvalue('description', '')))
elif 'deleteEvent' in form:
    c.execute('delete from events where date=? and column=? and title=? and description=?',
            (form.getvalue('date', ''),
             form.getvalue('column', ''),
             form.getvalue('title', ''),
             form.getvalue('description', '')))

print(base_table)
# TODO
fill_table()
print('</table>')

conn.commit()
conn.close()

