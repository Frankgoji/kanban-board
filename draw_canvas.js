/* Draws the kanban board and articulates all its elements and objects. */
// Kanban object and subobjects the board will need multiple divisions
// events--need elements like title, time, description needs to be interactive,
// and each interaction should communicate a change to the server

// constants with a default value to be determined, should be able to be
// adjusted and rewritten
var fontsize = 20;

var Board = function() {
    this.columns = {do_pool: [],
                   longterm: [],
                   high_priority: [],
                   doing: [],
                   done: []};

    this.canvas = document.getElementById("kanban_canvas");
    this.ctx = this.canvas.getContext("2d");
    this.columnwidth = this.canvas.width / 5;
    this.ctx.font = fontsize + "px Times New Roman";

    /* draws the board, given a list of which columns to draw or redraw.
       calling this calls the draw functions for each event in the relevant
       columns. */
    this.draw_board = function(which_columns) {
    }

    /* change font size */
    this.change_font = function(font_size) {
        fontsize = font_size;
        this.ctx.font = fontsize + "px Times New Roman";
        this.draw_board();
    }

    this.pull_data = function() {
    };

    /* post data to server when columns or events in columns change */
    this.push_data = function() {
    };
};

var Event = function(title, description, time, col, board) {
    this.title = title;
    this.description = description;
    this.time = time;
    this.col = col;
    this.board = board;

    /* determines the height of this event rectangle. necessary to draw the
       correct height for the board and the event */
    this.height = function() {
        var height = 0;
        var pix = /[0-9]+/;
        var font_height = parseInt(this.board.ctx.font.match(pix)[0]);
        var desc_width = this.board.ctx.measureText(this.description).width;
        height += font_height + 5;
        height += font_height * Math.ceil(desc_width / this.board.columnwidth);
        return height;
    }

    /* draws the square for this particular event. may need to pass
       arguments to it, like coordinates for where to draw it. color is
       dependent on place. */
    this.draw_event = function(x, y) {
        // make sure to bold the title and make it 5 px bigger than normal
        var pix = /[0-9]+/;
        var old_font = this.board.ctx.font;
        var title_font_height = parseInt(old_font.match(pix)[0]) + 5;
        this.board.ctx.font = "bold " + title_font_height + "px Times New Roman";
        this.board.ctx.fillText(this.title, x, y);
    }
}

var kanban = new Board();

var test = new Event("what", "world", 10, 1, kanban);
test.draw_event(10, 50);
kanban.ctx.font = "25px Times New Roman";
kanban.ctx.fillText("ord", 10, 80);
