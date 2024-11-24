// console.log("helo world")

let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX;
let startY
function setGame(){
    //creates backend board
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ];
    //frontend board
    for(let r=0; r<rows; r++){
        for(let c=0; c < columns; c++){
            //create div
            let tile = document.createElement("div");

            //tile id based on row and column
            tile.id = r.toString() + "-" + c.toString();
            //get value of tile
            let num = board[r][c];
            //num to update tile appearance
            updateTile(tile, num);
            //adds tile to the board
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

//changes appearance of tile
function updateTile(tile,num){
    tile.innerText = "";
    tile.classList.value = "";

    //add class="tile"
    tile.classList.add("tile");

    if (num > 0){

        //displayed tile number on actual tile
        tile.innerText = num.toString();

        //adds class and changes based on css
        if (num<=4096){
            //adds the class the x2, x4, x8
            tile.classList.add("x"+num)
        }
        else
            tile.classList.add("x8192");
    }
}

window.onload = function(){
    setGame();
}

function handleSlide(e){
    //display to console e.code
    // e.code - key weve pressed
    console.log(e.code);
    e.preventDefault();

    if(["ArrowLeft", "ArrowRight", "ArrowUp","ArrowDown"].includes(e.code)){
        if(e.code=="ArrowLeft"){
            slideLeft();
            setTwo();
        }
        else if (e.code=="ArrowRight"){
            slideRight();
            setTwo();
        }
        else if (e.code=="ArrowUp"){
            slideUp();
            setTwo();
        }
        else if (e.code=="ArrowDown"){
            slideDown();
            setTwo();
        }
        document.getElementById("score").innerText = score;
    }

    setTimeout(() => {
        if(hasLost()==true){
            alert("Game Over");
            alert("Any arrow to restart");
            restartGame();
        }
        else{
            checkWin();
        }
    }, 100)
}

//reads keydown from keyboard then exec handleSlide
document.addEventListener("keydown", handleSlide);

function slideUp(){
    for(let c=0; c<columns; c++){
        let columns = [board[0][c],board[1][c],board[2][c],board[3][c]];
        let originalColumn = columns.slice();
        //uses slide to merge tiles
        columns = slide(columns);

        
        for(let r=0;r<rows;r++){
            board[r][c] = columns[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(originalColumn[r] !== num && num !== 0){
                tile.style.animation = "slide-from-bottom 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile,num);
        }
    }
}
function slideDown(){
    for(let c=0; c<columns; c++){
        let columns = [board[0][c],board[1][c],board[2][c],board[3][c]];
        
        let originalColumn = columns.slice();

        columns.reverse();
        //uses slide to merge tiles
        columns = slide(columns);
        columns.reverse();

        for(let r=0;r<rows;r++){
            board[r][c] = columns[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            if(originalColumn[r] !== num && num !== 0){
                tile.style.animation = "slide-from-top 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile,num);
        }
    }
}
function slideLeft(){
    for(let r=0; r<rows; r++){
        let rows = board[r];

        //take all orignal tiles
        let originalRow = rows.slice();

        //uses slide to merge tiles
        rows = slide(rows);
        
        for(let c=0;c<columns;c++){
            board[r]=rows;
        
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            //number of tile tile after merging
            let num = board[r][c];
            
            //line for animation; the !== if wala namang nagbago pero
            //magmomove parin tile
            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-right 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile,num);
        }
    }
}
function slideRight(){
    for(let r=0; r<rows; r++){
        let rows = board[r];

        let originalRow = rows.slice();

        rows.reverse() //[0,2,0,2]->[2,0,2,0]
        rows = slide(rows); //uses slide to merge tiles
        rows.reverse(); //so [4,0,0,0]->[0,0,0,4]
        board[r] = rows;
        //update tile id
        for(let c=0;c<columns;c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            
            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-left 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile,num);
        }
    }
}

//function for merging
function slide(tiles){
    //remove zeo/empty
    tiles = filterZero(tiles); //[0,0,2,2]->[2,2]

    for(let i=0; i<tiles.length;i++){ //[2,2] length is 2
        //if [2,2,2] 2+2 will b merged first so magiging [4,0,2]
        if(tiles[i]==tiles[i+1]){
            tiles[i]*=2; // adds the numbers
            tiles[i+1]=0; //replaces the value w 0
            score+=tiles[i];
        }
    }

    tiles = filterZero(tiles); //if 0 empty tile so [4,0,2]->[4,2]

    while(tiles.length < columns){
        tiles.push(0);//push adds items to end of array
        //so it pushes 0 to the ends until the length of the
        //column reaches 3 since 0 1 2 3 length=3 of array
    }

    return tiles;
}

//so no 0+0 cases
function filterZero(tiles){
    return tiles.filter(num => num !=0);
}

function hasEmptyTile(){
    for(let r=0; r<rows; r++){
        for(let c=0; c < columns; c++){

            if((board[r][c])==0)
                return true;
        }
    }
    return false;
}

function setTwo(){
    if(hasEmptyTile==false){
        return;
    }

    let found=false;

    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c]==0){
            board[r][c]=2;

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText="2";
            tile.classList.add("x2");

            found = true;
        }

    }
}

function checkWin(){
    for(let r=0; r <rows; r++){
        for(let c=0; c < columns; c++){
            if(board[r][c]==2048 && is2048Exist == false){
                alert("2048 nice")
                is2048Exist = true;
            }
            else if(board[r][c]==4096 && is4096Exist == false){
                alert("4096 nice")
                is4096Exist = true;
            }
            else if(board[r][c]==8192 && is8192Exist == false){
                alert("8192 nice")
                is8192Exist = true;
            }
        }
    }
}

function hasLost(){
    for(let r=0; r <rows; r++){
        for(let c=0; c < columns; c++){

            //check for empty tile
            if(board[r][c]==0){
                return false;
            }

            const currentTile = board[r][c];

            if(
                //check if there is match in upper tile
                r>0 && board[r-1][c] === currentTile ||
                //check if there is match in lower tile
                r<rows-1 && board[r+1][c] === currentTile ||
                //check if there is match in left tile
                c>0 && currentTile === board[r][c-1] ||
                //check if there is match in right tile
                c<columns-1 && board[r][c+1]===currentTile
            ){
                    return false;
            }
        }
    }
    return true;
}

function restartGame(){
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ];

    setTwo();
    score = 0;
}

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
})

document.addEventListener("touchend", (e) => {
    if(!e.target.className.includes("tile")){
        return;
    }

    diffX = startX - e.changedTouches[0].clientX;
    diffY = startY - e.changedTouches[0].clientY;

    if(diffX != 0 && diffY != 0){
        if(Math.abs(diffX) > Math.abs(diffY)){
            if(diffX>0){
                slideLeft();
                setTwo();
            }
            else{
                slideRight();
                setTwo();
            }
        }
        else{
            if(diffY>0){
                slideUp();
                setTwo();
            }
            else{
                slideDown();
                setTwo();
            }
        }
    }

    document.getElementById("score").innerText = score;

    setTimeout(() => {
        if(hasLost()==true){
            alert("Game Over");
            alert("Any arrow to restart");
            restartGame();
        }
        else{
            checkWin();
        }
    }, 100)
});

document.addEventListener("touchmove", (e) => {
    if(!e.target.className.includes("tile")){
        return;
    }
    else{
        e.preventDefault();
    }
}, {passive: false})
