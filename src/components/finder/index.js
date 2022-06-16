const fs = require("fs");
console.log("start");

function chunkString(str, length) {
    return str.match(new RegExp(".{1," + length + "}", "g"));
}

// Rows and columns in the given grid
// let R, C;

r = 70;

// For searching in all 8 direction
let x = [
// -1, -1, -1, 0, 0, 1, 1, 1,
-2,2 ,2 ,-2];
let y = [
// -1, 0, 1, -1, 1, -1, 0, 1,
-2 ,2,-2 ,2];



var directions = x.length

function search2D(grid, row, col, word, R, C) {
    // If first character of word
    // doesn't match with
    // given starting point in grid.
    if (grid[row][col] != word[0]) return false;

    let len = word.length;

    // Search word in all 8 directions
    // starting from (row, col)
    for (let dir = 0; dir < directions; dir++) {
        var progress = [];
        // Initialize starting point
        // for current direction
        let k,
            rd = row + x[dir],
            cd = col + y[dir];

        // First character is already checked,
        // match remaining characters
        for (k = 1; k < len; k++) {
            // console.log(k);
            // If out of bound break
            if (rd >= R || rd < 0 || cd >= C || cd < 0) {
                // console.log({
                //     row,
                //     col,
                //     rd,
                //     R,
                //     cd,
                //     C,
                // });
                break;
            }

            // If not matched, break
            if (grid[rd][cd] != word[k]) break;

            // console.log({
            //     row,col,
            //     dir,
            //     progress,
            //     x: rd,
            //     y: cd,
            // });
            progress.push({
                x: rd,
                y: cd,
            });

            // Moving in particular direction
            rd += x[dir];
            cd += y[dir];
        }

        // If all character matched,
        // then value of must
        // be equal to length of word
        if (k == len) return [{ x: row, y: col }, ...progress];
    }
    return false;
}

function patternSearch(grid, word) {
    // console.log(patternSearch, grid.length);

    var R = grid.length;
    var C = 70;

    // Consider every point as starting
    // point and search given word
    for (let row = 0; row < R; row++) {
        for (let col = 0; col < C; col++) {
            // console.log(row, col, word, R, C);
            var result = search2D(grid, row, col, word.toUpperCase(), R, C);
            if (result) {
                console.info(
                    "pattern found at " + row + ", " + col + "<br>",
                    result
                );

                return result;
            }
        }
    }
}

function bookSearch(pageArray, word) {
    console.log('starting book search')
    console.log('book length', pageArray.length)
    // var result = patternSearch(searchable, "hag");

    var results = [];

    pageArray.forEach((page, pageNo) => {
        var search = patternSearch(searchable, word);
        if (search) results.push({ page: pageNo + 1, search });
    });
    console.log('finished book search')

    return results;
}

const data = fs.readFileSync("./books/pages.txt", {
    encoding: "utf8",
    flag: "r",
});

var lines = data.split("\n");

// var book = data.split('Page |')

// 70 char per line
// ~1500 char per page

// format the pages
var pages = [];
var page = [];
lines.forEach((line) => {
    if (line.includes("Page |")) {
        pages.push(page);
        page = [];
    } else {
        page.push(
            line
                .toLowerCase()
                .replace(/[^a-z]/gi, "")
                .toUpperCase()
        );
    }
});

var grid = [];
var lineLength = 70;
pages.forEach((page, i) => {
    // if(i>0) return
    var p = chunkString(page.join(""), lineLength).map((x) => x.split(""));
    p = p.map((g) => {
        // here we check if this line is too short
        var z = 70 - g.length;
        if (z == 0) return g;
        // if it is, we add whitespace nothing
        // console.log([...g, ...Array.from({ length: z }).map(() => " ")])
        return [...g, ...Array.from({ length: z }).map(() => " ")];
    });
    grid.push(p);
});

// console.log(pages[0]);

var searchable = grid[0];

// var result = patternSearch(searchable, "lmao");

var result = bookSearch(grid, "jesus");
console.log(result);
// console.log(searchable);
// console.log(searchable.map((l) => l.join(",")).join("\n"));

// fs.writeFileSync("test.tsv", searchable.map((l) => l.join(",")).join("\n"));

// console.log(grid.length);
// console.log(book.length);
console.log("end");
