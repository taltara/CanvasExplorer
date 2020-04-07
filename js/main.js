'use strict';


var gCanvas;
var gCtx;
var gCurrShape = 'triangle';
var gCurrColorLine = '#000';
var gCurrColorFill = '#ffffff', gCurrColorWhich = 'line';

var gDrawState = false;
var gDrawLatencyCount = 1;
var gDrawLatencyCountLimit = 1;
var gDrawText = 'Nemo';
var gDrawSpeed;
var timestamp = 0;
var mY = 0;
var clearing = false;
var set, thread = null, x1 = window.width/2, y1 = 0, x2, y2;
var gDrawAngle, isAngleSet = false;

var hammertime = new Hammer(document.querySelector('#my-canvas'));



function setAngleUse() {

    isAngleSet = !isAngleSet;
    
}

function setColorType(type) {

    gCurrColorWhich = type;
    var otherType = (gCurrColorWhich === 'line') ? 'fill' : 'line';
    document.querySelector(`.current-${gCurrColorWhich}-color`).classList.add('selected-color-type');
    document.querySelector(`.current-${otherType}-color`).classList.remove('selected-color-type');
}

function determineMouseAngle(e) {

    if (!set) {
        x1 = e.pageX, //set starting mouse x
        y1 = e.pageY, //set starting mouse y
        set = true;
    }   
    if(thread) clearTimeout(thread);
    thread = setTimeout(callback.bind(this, e), 10);
}


function getAngle (x1, y1, x2, y2) {
    var distY = Math.abs(y2-y1); //opposite
    var distX = Math.abs(x2-x1); //adjacent
    var dist = Math.sqrt((distY*distY)+(distX*distX)); //hypotenuse, 
       //don't know if there is a built in JS function to do the square of a number
    var val = distY/dist;
    var aSine = Math.asin(val)*(180);
    // var aSine = Math.asin(val);
    return aSine; //return angle in degrees
}

function callback(e) {
    x2 = e.pageX; //new X
    y2 = e.pageY; //new Y

    gDrawAngle = getAngle(x1, y1, x2, y2);
    if(!isAngleSet) gDrawAngle = 0;
    console.log("ANGLE: " + gDrawAngle);
    console.log("mouse has stopped");   
    set = false;
}



function init() {

    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');

    gCanvas.addEventListener('mousedown', function(event) { 

        gDrawState = true;
        draw(event);
    });

    gCanvas.addEventListener('ontouchstart', function(event) { 

        gDrawState = true;
        draw(event);
    });

    gCanvas.addEventListener('mousemove', function(event) {

        if(!gDrawState) return;
        determineMouseAngle(event);
        getDrawSpeed(event);
        pointerMoveHandler(event);
    });

    hammertime.on('swipe', function(ev) {
        console.log(ev);
        if(!gDrawState) return;
        pointerMoveHandler(event);
    });


    gCanvas.addEventListener('mouseup', function(event) {
        gDrawState = false;
        gDrawLatencyCount = gDrawLatencyCountLimit;
    });

    gCanvas.addEventListener('ontouchend', function(event) {
        gDrawState = false;
        gDrawLatencyCount = gDrawLatencyCountLimit;
    });

    let elRandomColorPicker = document.querySelector('.color-picker-random');
    
    elRandomColorPicker.value = getRandomColor();
   
    resizeCanvas()
}

function getDrawSpeed(e) {

    var now = Date.now();
    var currentmY = e.screenY;
    
      var dt = now - timestamp;
    var distance = Math.abs(currentmY - mY);
    gDrawSpeed = Math.round(distance / dt * 1000);
    
    mY = currentmY;
    timestamp = now;

}


function pointerMoveHandler(event) {

    gDrawLatencyCount -= 1;
    // console.log(gDrawLatencyCount);
    
    if(gDrawLatencyCount) return;
    else {

        gDrawLatencyCount = gDrawLatencyCountLimit;
    }

    draw(event);
}


function drawLine(x, y, xEnd = 250, yEnd = 250) {

    var tempSize = Math.round(gDrawSpeed / 10) + 50;
    gCtx.rotate(0);
    gCtx.lineWidth = `${2}`;
    gCtx.beginPath();
    gCtx.moveTo(x, y - tempSize/2);
    gCtx.lineTo(x, y + tempSize/2);
    gCtx.closePath();
    gCtx.strokeStyle = gCurrColorLine;
    gCtx.rotate(gDrawAngle);
    gCtx.stroke();
    gCtx.closePath();
}

function drawTriangle(x, y) {

    var tempSize = Math.round(gDrawSpeed / 50) + 50;
    gCtx.lineWidth = '2';
    gCtx.beginPath();
    gCtx.rotate(0);
    gCtx.moveTo(x, y - tempSize/2);
    gCtx.lineTo(x - tempSize/2, y + tempSize);
    gCtx.lineTo(x + tempSize/2, y + tempSize);
    // gCtx.lineTo(x, y)
    gCtx.closePath() //insted of lineTo(x,y) 
    gCtx.strokeStyle = gCurrColorLine;
    gCtx.rotate(gDrawAngle);
    gCtx.stroke();
    gCtx.fillStyle = gCurrColorFill;
    gCtx.fill();
}

function drawRect(x, y) {

    var tempSize = Math.round(gDrawSpeed / 50) + 50;
    gCtx.lineWidth = '2';
    gCtx.rotate(0);
    gCtx.beginPath();
    gCtx.strokeStyle = gCurrColorLine;
    gCtx.rect(x - tempSize/2, y - tempSize/2, tempSize, tempSize);
    gCtx.rotate(gDrawAngle);
    gCtx.stroke();
    gCtx.fillStyle = gCurrColorFill;
    gCtx.fillRect(x - tempSize/2, y - tempSize/2, tempSize, tempSize);
    gCtx.closePath();
}

function drawArc(x, y) {

    var tempSize = Math.round(gDrawSpeed / 10) + 50;
    gCtx.lineWidth = '2';
    gCtx.beginPath();
    gCtx.strokeStyle = gCurrColorLine;
    gCtx.lineWidth = '6';
    gCtx.arc(x, y, tempSize/10, 0, (gDrawAngle === 0) ? 2 * Math.PI : gDrawAngle); // x,y,r
    gCtx.stroke();
    gCtx.fillStyle = gCurrColorFill;
    gCtx.fill();
    gCtx.closePath();
}

function drawText(text, x, y) {
    // gCtx.lineWidth = '2'
    gCtx.rotate(0);
    gCtx.strokeStyle = gCurrColorLine;
    gCtx.fillStyle = gCurrColorFill;
    gCtx.font = `${Math.floor(Math.random() * 100 + 10)}px Ariel`
    // gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y);
    gCtx.rotate(gDrawAngle);
    gCtx.strokeText(text, x, y);
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gCanvas.style.backgroundColor = 'black';
    clearing = true;

    setTimeout(() => {
        gCanvas.style.backgroundColor = 'unset';
        
        setTimeout(() => {
            clearing = false;
        }, 300);
    }, 300);
    // You may clear part of the canvas
    // gCtx.clearRect(50, 50, 250, 250)
}


function saveAndRestoreExample() {
    gCtx.strokeStyle = 'red'
    gCtx.fillStyle = 'white'
    drawText('befor save', 100, 60)
    gCtx.save() // push the current state to the stack
    drawText('after save', 100, 160)
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'red'
    drawText('after save and style change ', 20, 260)
    gCtx.restore() // pop the top state on the stack
    drawText('after restore', 100, 360)
}


// draw img from local
function drawImg2() {
    var img = new Image()
    console.log(img)
    img.src = './img/dog.jpg';
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,width,height
    }
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}


function setShape(shape) {

    gCurrShape = shape;
    var elNameInput = document.querySelector('.text-input');
    var elAfterInserter = document.querySelector('.draw-management');
    var htmlNameInput = '<input type="text" class="text-input" placeholder="Anything"></input>';

    if(shape === 'text') {

        if(!elNameInput) {

            elAfterInserter.insertAdjacentHTML('afterend', htmlNameInput);
            setTimeout(() => {
                
                document.querySelector('.text-input').classList.add('show-input');
            }, 10);
        }
        
    } else {

        if(elNameInput) {

            elNameInput.classList.remove('show-input');
            setTimeout(() => {
                elNameInput.remove();
            }, 300);
        }
    }
}

function setColor(color, event) {

    let elToolsSection = document.querySelector('.tools-section');
    if(!color)  {
        event.preventDefault();
        let colorPicker = document.querySelector('.color-picker-random');
        colorPicker.value = getRandomColor();

        if(gCurrColorWhich === 'line') {

            gCurrColorLine = colorPicker.value;
            document.querySelector('.current-line-color').style.backgroundColor = colorPicker.value;
        }
        else {
            
            gCurrColorFill = colorPicker.value;
            document.querySelector('.current-fill-color').style.backgroundColor = colorPicker.value;
        }

        elToolsSection.style.backgroundColor = colorPicker.value;
        
    } else {
        
        if(gCurrColorWhich === 'line') {
            
            gCurrColorLine = color;
            document.querySelector('.current-line-color').style.backgroundColor = color;
        } else {

            gCurrColorFill = color;
            document.querySelector('.current-fill-color').style.backgroundColor = color;
        }

        elToolsSection.style.backgroundColor = color;
    }
    
    
}

function adjustDrawLatency(newLatency){

    gDrawLatencyCountLimit = newLatency;
    gDrawLatencyCount = gDrawLatencyCountLimit;
    document.querySelector('.slider-input').value = newLatency;
    document.querySelector('.slider').value = newLatency;
}


function draw(ev) {

    if(clearing) return;
    // console.log('offsetX', ev.offsetX)
    // console.log('clientX', ev.clientX)
    const offsetX = ev.offsetX
    const offsetY = ev.offsetY
    // if(isNaN(gDrawAngle)) gDrawAngle = 0;
    // const { offsetX, offsetY } = ev
    switch (gCurrShape) {
        case 'triangle':
            drawTriangle(offsetX, offsetY);
            break;
        case 'rect':
            drawRect(offsetX, offsetY);
            break;
        case 'circle':
            drawArc(offsetX, offsetY);
            break;
        case 'text':

            let elNameInput = document.querySelector('.text-input').value;
            gDrawText = (elNameInput) ? elNameInput : 'NEMO';

            drawText(gDrawText, offsetX, offsetY);
            break;
        case 'line':
            drawLine(offsetX, offsetY);
            break;
    }
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    console.log('data', data)
    elLink.href = data
    elLink.download = 'my-img.jpg'
}


