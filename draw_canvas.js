/* Draws the kanban board and articulates all its elements and objects. */
// Kanban object and subobjects the board will need multiple divisions
// events--need elements like title, time, description needs to be interactive,
// and each interaction should communicate a change to the server


// TODO: add interactive elements, so that it can drag events to new columns
// (change columns), and double-click to change attributes. Of course, each
// change is registered
//
// Red line or gradient to signal where to place event, red box for selection
//
// for dragging, redraw every 30 ms. Don't need to keep mouse offset (put it in
// the center), and compare which column to be in, then in between which events
// to put the gradient. Once chosen AND mouseup, need to move the event (put in
// new column array, delete from old one) before redraw. and then update.
//
// When changing the values, what to do?
//      simulate a text box? change in place?
//      make alerts, prompting text (good since can do checks. also good because
//      you can make changes to just one thing)
//
// How to add new events: hopefully same way as changing values BUT if using
// alerts, it's a pain in the ass to have three alerts. Maybe an alert that has
// three input slots? A dialog box?

// constant with a default value to be determined, should be able to be
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
    this.ctx.textAlign = "center";
    this.col_colors = {do_pool: "#99FF99",
                   longterm: "#FFFF80",
                   high_priority: "#FF8080",
                   doing: "#FFA366",
                   done: "#CCCCB2"};
    this.event_colors = {do_pool: "#80FF80",
                   longterm: "#FFFF66",
                   high_priority: "#FF6666",
                   doing: "#FF944D",
                   done: "#C2C2A3"};
    this.line_colors = {do_pool: "#00FF00",
                   longterm: "#CCCC52",
                   high_priority: "#FF0000",
                   doing: "#FF6600",
                   done: "#999966"};

    /* STATE VARIABLES FOR THE BOARD */

    this.valid = false;
    this.dragging = false;
    this.selected_event = null;
    this.in_dialog = false;

    /* EVENT LISTENERS */

    /* prevents selecting text when double-clicking. */
    this.canvas.addEventListener("selectstart", function(e) { e.preventDefault();
        return false; }, false);

    /* when doubleclick, will edit event if mouse is over an event, otherwise
     * nothing happens. */
    this.canvas.addEventListener("dblclick", function(e) {
        alert(e.pageX);
        // Use the sheet you drafted
    }, true);

    /* draws the board. calling this calls the draw functions for each event in
     * the relevant columns. */
    this.draw_board = function() {
        var col_heights = [];
        for (var col in this.columns) {
            var h = 0;
            var arr = this.columns[col];
            for (j = 0; j < arr.length; j++) {
                h += arr[j].height() + 10;
            }
            h += 10;
            col_heights.push(h);
        }
        var max_height = Math.max.apply(null, col_heights);
        if (max_height > this.canvas.height) {
            this.canvas.height = max_height + 2;
        }

        var col_num = 0;
        for (var col in this.col_colors) {
            this.ctx.fillStyle = this.col_colors[col];
            this.ctx.fillRect(this.columnwidth * col_num, 2, this.columnwidth, max_height);
            col_num++;
        }
        col_num = 0;
        for (var col in this.col_colors) {
            this.draw_rect(this.columnwidth * col_num + 1, 1, max_height, this.columnwidth - 2, this.line_colors[col], 2);
            col_num++;
        }

        col_num = 0;
        for (var col in this.columns) {
            var curr_height = 5;
            for (i = 0; i < this.columns[col].length; i++) {
                this.columns[col][i].draw_event(col_num * this.columnwidth, curr_height);
                curr_height += this.columns[col][i].height() + 5;
            }
            col_num++;
        }
    }

    /* change font size */
    this.change_font = function(font_size) {
        fontsize = font_size;
        this.ctx.font = fontsize + "px Times New Roman";
        this.draw_board();
    }

    /* pulls data from server to initiate columns */
    this.pull_data = function() {
    };

    /* post data to server when columns or events in columns change */
    this.push_data = function() {
    };

    /* draws a box with coords, color, and line width */
    this.draw_rect = function(x, y, height, width, color, line_w) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + height);
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = line_w;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.stroke();
        this.ctx.moveTo(x + width, y + height);
        this.ctx.lineTo(x + width, y);
        this.ctx.stroke();
        this.ctx.moveTo(x + width, y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    };
};

// MAY NEED TO MAKE EVENT CONSTRUCTOR INCLUDE COORDINATES
var Event = function(title, description, time, col, board) {
    this.title = title;
    this.description = description;
    this.time = time;
    this.col = col;
    this.board = board;
    this.board.columns[col].push(this);
    this.x = 0;
    this.y = 0;

    /* determines the height of this event rectangle. necessary to draw the
       correct height for the board and the event */
    this.height = function() {
        var height = 0;
        var pix = /[0-9]+/;
        var font_height = parseInt(this.board.ctx.font.match(pix)[0]);
        var desc_width = this.board.ctx.measureText(this.description).width;
        height += 2 * font_height + 10;
        height += (font_height + 5) * Math.ceil(desc_width / (this.board.columnwidth - 10));
        return height;
    }

    /* draws the square for this particular event. may need to pass
       arguments to it, like coordinates for where to draw it. color is
       dependent on place. */
    this.draw_event = function(x, y) {
        this.board.ctx.fillStyle = this.board.event_colors[this.col];
        this.board.ctx.fillRect(x + 5, y, this.board.columnwidth - 10, this.height());
        this.board.draw_rect(x + 5, y, this.height(), this.board.columnwidth - 10, "#000000", 1);
        var pix = /[0-9]+/;
        var old_font = this.board.ctx.font;
        var title_font_height = parseInt(old_font.match(pix)[0]) + 5;
        this.board.ctx.fillStyle = "#000000";
        this.board.ctx.font = "bold " + title_font_height + "px Times New Roman";
        this.board.ctx.fillText(this.title, x + this.board.columnwidth / 2, y + title_font_height);
        this.board.ctx.font = old_font;
        this.board.ctx.fillText(this.description, x + this.board.columnwidth / 2, y + title_font_height * 2);
        this.board.ctx.font = "bold " + old_font;
        this.board.ctx.fillText(this.time, x + this.board.columnwidth / 2, y + title_font_height * 3 - 5);
        this.board.ctx.font = old_font;
    }
}

var kanban = new Board();

new Event("what", "world", 10, "do_pool", kanban);
new Event("k", "j", 292, "do_pool", kanban);
kanban.draw_board();
