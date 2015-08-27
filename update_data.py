#! /usr/bin/python3
# given data from the website, updates the data on the server

# probably use a simple text file to store the data rather than a complicated
# data structure. json or something.

import cgi, cgitb

form = cgi.FieldStorage()
