// ==========================================================
// =================== Rendering Grid 📅📏 =================
// ==========================================================

const board = document.querySelector('#board');
let matrix;
let row;
let col;
let width = 22;
var cells = [];

const pixels = document.querySelectorAll('#pixel .drop-menu a');
pixels.forEach((pixel) => {
    // we can select a font size from 14 to 26
    pixel.addEventListener('click', () => {
        width = parseInt(pixel.innerText); // conveting the string to int
        // for each column making it size to the selected font size
        const cells = document.querySelectorAll('.col');
        cells.forEach(cell => {
            document.documentElement.style.setProperty('--cell-width', `${width}px`);
        })

        renderBoard();
        source = set('source');
        target = set('target');
    });
});

function renderBoard() {
    matrix = [];
    // finding number of column
    col = parseInt(board.clientWidth / width);
    // finding number of rows
    row = parseInt(board.clientHeight / width);
    if(window.innerWidth <= 662){
        row -= 1;
    }
    // Refreshing the board
    board.innerHTML = '';
    for (let i = 0; i < row; i++) {
        const rowElement = document.createElement('div');
        rowElement.setAttribute('id', `row-${i}`);
        rowElement.classList.add('row');
        let colList = [];
        for (let j = 0; j < col; j++) {
            const colElement = document.createElement('div');
            colElement.classList.add('col', 'unvisited');
            colElement.setAttribute('id', `${i}-${j}`);
            rowElement.appendChild(colElement);
            colList.push(colElement);
        }
        board.appendChild(rowElement);
        matrix.push(colList);
    }
    cells = document.querySelectorAll('.col');
    boardInteraction(cells);
}







// ==========================================================
// ================= BOARD INTERATION 🎨🖌️ =================
// ==========================================================

// The boardInteraction function adds interactivity to each cell in the grid, 
// enabling the user to perform various operations like 
// dragging the source or target points, drawing walls, and toggling wall states with clicks


function boardInteraction(cells) {
    let draging = false;
    let drawing = false;
    let dragStart = null;
    
    // State Variables:
    // draging: Tracks whether the user is dragging either the "source" or "target" cell.
    // drawing: Tracks whether the user is currently drawing walls (click and hold to create walls).
    // dragStart: Stores whether the drag operation started from the "source" or "target" cell.
    cells.forEach((cell) => {
        // pointDown:
        // Triggered when the user presses down on a cell (pointerdown event).
        // If the cell is either the "source" or "target", dragging begins.
        // Otherwise, it starts the drawing process to create walls. 
        const pointDown = (e) => {
            if (e.target.classList.contains('source')) {
                dragStart = 'source';
                draging = true;
            }
            else if (e.target.classList.contains('target')) {
                dragStart = 'target';
                draging = true;
            }
            else {
                drawing = true;
            }
        }
        // pointUp:

        // Triggered when the user releases the mouse button (pointerup event).
        // This ends the drawing or dragging operation, resetting the state variables (drawing, draging, dragStart).
        // The function also removes the "wall" class from the current "source" and "target" 
        // cells to prevent them from being treated as walls during the process.
        const pointUp = () => {
            drawing = false;
            draging = false;
            dragStart = null;
            matrix[source.x][source.y].classList.remove('wall');
            matrix[target.x][target.y].classList.remove('wall');
        }
        
        // pointMove:
        // Triggered when the user moves the mouse over cells (pointermove event).
        // The cell that the mouse is currently hovering over is identified by document.elementFromPoint(e.clientX, e.clientY).
        // If the user is dragging the "source" or "target", the respective cell is moved, and the new position is updated in the source or target variables.
        // If the user is drawing, the cell is turned into a wall by adding the wall class unless it is a "source" or "target" cell.
        const pointMove = (e) => {
            const triggerElement = document.elementFromPoint(e.clientX, e.clientY);
            if (triggerElement == null || !triggerElement.classList.contains('col')) return;
            cordinate = { ...triggerElement.id.split('-') };

            if (draging && dragStart) {

                cells.forEach(cell => {
                    cell.classList.remove(dragStart);
                })
                triggerElement.classList.add(dragStart);

                if (dragStart === 'source') {
                    source.x = Number(cordinate[0]);
                    source.y = Number(cordinate[1]);
                }
                else {
                    target.x = Number(cordinate[0]);
                    target.y = Number(cordinate[1]);
                }
            }


            else if (drawing) {
                if (triggerElement.classList.contains('source') || triggerElement.classList.contains('target'))
                    return;

                const x = Number(cordinate[0]);
                const y = Number(cordinate[1]);

                matrix[x][y].setAttribute('class', 'col wall');
            }
        }

        cell.addEventListener('pointerdown', pointDown);
        cell.addEventListener('pointermove', pointMove);
        cell.addEventListener('pointerup', pointUp);

        cell.addEventListener('click', () => {
            if (cell.classList.contains('source') || cell.classList.contains('target'))
                return;

            cell.classList.remove('visited', 'path');
            cell.classList.toggle('wall');
        })
    })

}
