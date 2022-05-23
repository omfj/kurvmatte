const btnStart = document.getElementById("btnStart");
const divGameBoard = document.getElementById("divGameBoard");
const parQuestion = document.getElementById("parQuestion");
const divBall = document.getElementById("divBall");
const parHealthBar = document.getElementById("parHealthBar");
const parPoints = document.getElementById("parPoints");
const parLevel = document.getElementById("parLevel");
const parMessage = document.getElementById("parMessage");
const parAnswer0 = document.getElementById("parAnswer0");
const parAnswer1 = document.getElementById("parAnswer1");
const parAnswer2 = document.getElementById("parAnswer2");
const box0 = document.getElementById("box0");
const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");

const divPlatform = document.getElementsByClassName("divPlatform");
const divSpeechBubble = document.getElementsByClassName("divSpeechBubble");

const aniBallMove = [
    {top: "15%"}, // Start posisjon
    {top: "80%"}, // Slutt posisjon
];

let tid = 5000;

const aniBallTiming = {
    duration: tid,
    iterations: 1,
    fill: "forwards",
}

const position = [
    {place: 10, value: 10, box: "parAnswer0"},
    {place: 50, value: 10, box: "parAnswer1"},
    {place: 90, value: 10, box: "parAnswer2"},
];

let index = 1;
let health = 3;
let points = 0;
let level = 0;

function start() {
    btnStart.remove();

    divBall.style.visibility = "visible";
    parQuestion.style.visibility = "visible";
    parHealthBar.style.visibility = "visible";
    parPoints.style.visibility = "visible";
    parLevel.style.visibility = "visible";

    parMessage.style.visibility = "hidden";

    for(var i = 0; i < divPlatform.length; i++) {
        divPlatform[i].style.visibility = "visible";
    }
    for(var i = 0; i < divSpeechBubble.length; i++) {
        divSpeechBubble[i].style.visibility = "visible";
    }

    parHealthBar.innerHTML = "Liv: " + health;
    parPoints.innerHTML = "Poeng: " + points;
    parLevel.innerHTML = "Level: " + level;

    newCalculation();
}

function place(id, x_pos) {
    const element = document.getElementById(id);
    element.style.position = "absolute";
    element.style.left = x_pos + "%";
}

function update() {
    document.addEventListener('keydown', keyPress);
}

function keyPress(e) {
    const x = e.key;

    if (x == "ArrowRight" || x == "d") {
        index++;

        if(index > 2) {
            index = 2;
        }

        place("divBall", position[index].place);
    } else if (x == "ArrowLeft" || x == "a") {
        index--;

        if(index < 1) {
            index = 0;
        }

        place('divBall', position[index].place);
    }
}
update();


function randomNumber() {
    return Math.floor(Math.random() * 40) + 10;
}

function randomAnswer() {
    return randomNumber() + randomNumber();
}

function newCalculation() {
    const aniBall = divBall.animate(aniBallMove, aniBallTiming);

    const boxNumber = Math.floor(Math.random() * 3);
    const correctBox = String(position[boxNumber].box);

    const number1 = randomNumber();
    const number2 = randomNumber();
    const answer =  number1 + number2;

    let extra1 = randomAnswer();
    let extra2 = randomAnswer();

    while (extra1 === answer || extra2 === answer) {
        extra1 = randomAnswer();
        extra2 = randomAnswer();
    }

    eval(correctBox).innerHTML = answer;

    position[boxNumber].value = answer;

    if (correctBox == "parAnswer0") {
        parAnswer1.innerHTML = extra1;
        position[1].value = extra1;

        parAnswer2.innerHTML = extra2;
        position[2].innerHTML = extra2;
    } else if (correctBox == "parAnswer1") {
        parAnswer0.innerHTML = extra1;
        position[0].value = extra1;

        parAnswer2.innerHTML = extra2;
        position[2].innerHTML = extra2;
    } else if (correctBox == "parAnswer2") {
        parAnswer0.innerHTML = extra1;
        position[0].value = extra1;

        parAnswer1.innerHTML = extra2;
        position[1].innerHTML = extra2;
    }

    parQuestion.innerHTML = number1 + " + " + number2;

    aniBall.onfinish = function() {
        lastPos = position[index].box;
        console.log(lastPos);
        if(lastPos == correctBox) {
            points++;

            const levelUp = Number(points/10);
            if(Number.isInteger(levelUp)){
                level++;
                tid = tid*0.9;
                parLevel.innerHTML = "Level: " + level;
            }

            parPoints.innerHTML = "Poeng: " + points;

        } else if (lastPos != correctBox) {
            health--;

            if (health < 1) {
                divBall.style.visibility = "hidden";
                parQuestion.style.visibility = "hidden";
                parHealthBar.style.visibility = "hidden";
                parPoints.style.visibility = "hidden";
                parLevel.style.visibility = "hidden";

                for(var i = 0; i < divPlatform.length; i++) {
                    divPlatform[i].style.visibility = "hidden";
                }
                for(var i = 0; i < divSpeechBubble.length; i++) {
                    divSpeechBubble[i].style.visibility = "hidden";
                }

                parMessage.style.visibility = "visible";

                parMessage.innerHTML = "Du har tapt. Du fikk " + points + " poeng!";
            }
            parHealthBar.innerHTML = "Liv: " + health;
        }

        newCalculation();
    }
}
