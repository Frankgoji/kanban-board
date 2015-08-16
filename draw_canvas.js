/* Draws the kanban board and articulates all its elements and objects. */
// Kanban object and subobjects the board will need multiple divisions
// events--need elements like title, time, description needs to be interactive,
// and each interaction should communicate a change to the server

// constants with a default value to be determined, should be able to be
// adjusted and rewritten
var fontsize;
var columnwidth;

var Board = function() {
    this.columns = {do_pool: [],
                   longterm: [],
                   high_priority: [],
                   doing: [],
                   done: []};

    /* draws the board, given a list of which columns to draw or redraw.
       calling this calls the draw functions for each event in the relevant
       columns. */
    this.draw_board = function(which_columns) {
    }

    /* change font size */
    this.change_font = function(font_size) {
        fontsize = font_size;
        this.draw_board();
    }

    /* get data from server and populate columns */
    this.pull_data = function() {
    };

    /* post data to server when columns or events in columns change */
    this.push_data = function() {
    };
};

var Event = function(title, description, time, col) {
    this.title = title;
    this.description = description;
    this.time = time;
    this.col = col;

    /* determines the height of this event rectangle. necessary to draw the
       correct height for the board and the event */
    this.height = function() {
    }

    /* draws the square for this particular event. may need to pass
       arguments to it, like coordinates for where to draw it. color is
       dependent on place. */
    this.draw_event = function() {
    }
}

var kanban = new Board();
