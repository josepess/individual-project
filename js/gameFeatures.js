'use strict'

// Количество фигур
const numberOfFigures = 30
// Классы фигур
const classesOfFigures = [
    ['треугольники', 'triangle'],
    ['круги', 'circle'], 
    ['квадраты', 'square']
]
// Массив с выделенными фигурами
let selectedFigures = []
// Параметры выбранного задания
let exercise = {figure:'', additional:''}
// Параметры сложности
const levelOfDifficultyArray = {
    'easy': 15,
    'normal': 10,
    'hard': 5
}
// Параметры игрового таймера
let timeout = 0
let levelTimeout = levelOfDifficultyArray[localStorage.getItem('complexity')]
let timer = document.getElementById("timer")


// Проверки безопасности
function securityChecks(){
    // Проверка авторизации
    if (!localStorage.getItem('currentPlayer')){
        alert('Пожалуйста введите имя игрока.')
        document.location.href = 'index.html'
    }

    // Если уровень пройден переключать на следующий
    try{
        if (JSON.parse(localStorage.getItem('currentGame'))[currentLevel]){
            alert('А-та-та!!! >:-(')
            nextLevel(currentLevel)
        }
    }catch{

    }
}

// Переход на следующий уровень
function nextLevel(currentLevel){

    const levelsList = {
        'level-1': 'level2.html',
        'level-2': 'level3.html',
        'level-3': 'final.html',
    }

    localStorage.removeItem('levelProgress')
    localStorage.removeItem('levelExercise')
    document.location.href = levelsList[currentLevel]
}

// Формирование задания
function makeExercise(figure, additional){
    // Названия параметров
    const figure_ = classesOfFigures[figure][0]
    const additional_ = levelAdditions[additional][0]

    // Значения параметров
    exercise['figure'] = classesOfFigures[figure][1]
    exercise['additional'] = levelAdditions[additional][1]

    let exerciseField = document.getElementById('exercise-field')

    let exerciesText = `Выберите все ${additional_} ${figure_}.`

    if (currentLevel === 'level-3'){
        exerciesText = `Выберите все ${figure_} с ${additional_}.`
    }
    
    exerciseField.innerHTML = `<p>${exerciesText}</p>
    <div>
        <input type="button" id="submit-break-game" value="Завершить игру"/>
        <input type="button" id="submit-done" value="Готово"/>
    </div>
    `
    // Закончить уровень и подсчитать очки
    let submitDone = document.getElementById('submit-done')
    submitDone.onclick = function(){checkResult()}

    // Закончить игру
    let submitBreakGame = document.getElementById('submit-break-game')
    submitBreakGame.onclick = function(){document.location.href = 'index.html'}

    let obj = {}
    obj[currentLevel] = {figure: exercise['figure'], additional: exercise['additional']}
    localStorage.setItem('levelExercise', JSON.stringify(obj))
}

function newGame(){
    document.location.href = 'index.html'
}

// Действия при завершении игры
function endGame(){
    // Получение данных для сохранения
    let players = JSON.parse(localStorage.getItem('players'))
    const currentPlayer = localStorage.getItem('currentPlayer')

    // Сохранение предедущих результатов
    if (players){
        players[currentPlayer] = localStorage.getItem('finalScore')
        localStorage.setItem('players', JSON.stringify(players))
    }else if (currentPlayer){
        let obj = {}
        obj[currentPlayer] = localStorage.getItem('finalScore')
        localStorage.setItem('players', JSON.stringify(obj))
    }

    // Завершение сессии текущего игрока
    localStorage.removeItem('currentPlayer')
    localStorage.removeItem('currentGame')
    localStorage.removeItem('levelProgress')
    localStorage.removeItem('levelExercise')
}

// Подсчет возможных верных ответов
function checkCorrectAnswers(){
    const figure = document.getElementsByClassName(exercise['figure'])
    let correct_answers = 0
    for (let i = 0; i < figure.length; i++) {
        if (figure[i].classList[1] == exercise['additional']){
            correct_answers++
        }
    }

    return(correct_answers)
}

// Подсчет результатов
function checkResult(timerOff = 0){
    
    let items = JSON.parse(localStorage.getItem('levelProgress'))

    // Если не выбрано ни одной фигуры
    if (!items && timerOff === 0){
        alert('Выберите хотябы одну фигуру!')
        return 0
    }

    clearTimeout(timeout)

    let levelExercies = JSON.parse(localStorage.getItem('levelExercise'))[currentLevel]
    let currentGame = JSON.parse(localStorage.getItem('currentGame')) || {}

    // Результат за уровень
    let score = 0
    let badScore = 0

    for (let key in items){
        // Подсчет баллов за фигуры
        if ((items[key]['figure'] === levelExercies['figure']) && (items[key]['additional'] === levelExercies['additional'])){
            score++
        }else{
            badScore++
        }
    }

    // Подсчет баллов за оставшиеся фигуры
    const correctAnswer = checkCorrectAnswers()
    badScore = badScore + (correctAnswer - score)

    currentGame[currentLevel] = {score: score, badScore: badScore}
    localStorage.setItem('currentGame', JSON.stringify(currentGame))

    // Результат за игру
    let finalScore = 0
    let finalBadscore = 0

    for (let level in currentGame){
        finalScore = finalScore + currentGame[level]['score']
        finalBadscore = finalBadscore + currentGame[level]['badScore']
    }

    finalScore = finalScore - finalBadscore

    if (finalScore < 0){
        finalScore = 0
    }

    localStorage.setItem('finalScore', finalScore)

    // Переход на слежующий уровень после подсчета результатов
    alert('Вы перешли на новый уровень!')
    nextLevel(currentLevel)
}

// Отобразить результаты
function showScore(){
    let scoreField = document.getElementById("score-field")
    
    if(!scoreField){
        scoreField = document.getElementById("finalplayersScores-score-field")
    }

    let gameScore = JSON.parse(localStorage.getItem('currentGame'))

    scoreField.innerHTML = `
        <div id="scores">
            <div id="playerScore"></div>
            <div id="playersScores"><div>
        </div> 
    `
    
    // Вывод очков всех игроков
    let divPlayersScores = document.getElementById('playersScores')
    let listOfScores = document.createElement('ul')
    let players = JSON.parse(localStorage.getItem('players'))
    for (let player in players){
        let liScore = document.createElement('li')
        liScore.id = 'listOfScores'
        liScore.innerHTML = `${player} : ${players[player]}`
        listOfScores.appendChild(liScore)
    }
    divPlayersScores.appendChild(listOfScores)

    // Вывод очков текущего игрока
    let divPlayerScore = document.getElementById('playerScore')
    let listPlayerScore = document.createElement('ul')
    const currentGame = JSON.parse(localStorage.getItem('currentGame'))
    for (let level in currentGame){
        // console.log(currentGame[level])
        let liScore = document.createElement('li')
        liScore.id = 'listPlayerScore'
        liScore.innerHTML = `${level}<br/>
            score: ${currentGame[level]['score']} 
            badscore: ${currentGame[level]['badScore']}
        `
        listPlayerScore.appendChild(liScore)
    }
    
    let currentPlayerName = document.createElement('h4')
    currentPlayerName.id = 'current-player'
    currentPlayerName.innerHTML = `${localStorage.getItem('currentPlayer')}`
    divPlayerScore.appendChild(currentPlayerName)
    divPlayerScore.appendChild(listPlayerScore)

    if (currentLevel === 'final'){
        let line = document.createElement('hr')
        divPlayerScore.appendChild(line)
        let playerFinalScore = document.createElement('b')
        playerFinalScore.innerHTML = `Ваш результат: ${localStorage.getItem('finalScore')}` 
        divPlayerScore.appendChild(playerFinalScore)
    }

}

// Игровой таймер
function levelTimer(){

    timer.innerHTML = `${levelTimeout}`
    levelTimeout--
    timeout = setTimeout(levelTimer, 1000);

    if (levelTimeout < 0){
        alert("Время вышло!")
        clearTimeout(timeout)
        checkResult(1)
    }
}

// Выбор цветовой темы
function themeSelector(){
    let divThemeSelector = document.getElementById('theme-selector')
    let body = document.getElementById('body')
    let themeName = 'Светлая тема'
    let toTheme = 'bodyclass-light'

    // Первоначальная установка темы
    if (!localStorage.getItem('colorTheme')){
        localStorage.setItem('colorTheme', body.classList[0])
    } else {
        body.classList.remove(body.classList[0])
        body.classList.add(localStorage.getItem('colorTheme'))
    }

    if (localStorage.getItem('colorTheme') === 'bodyclass-light'){
        themeName = 'Темная тема'
        toTheme = 'bodyclass-dark'
    }
    
    divThemeSelector.innerHTML = `<input type="button" id="btn-theme-selector" value="${themeName}"/>`
    const btnThemeSelector = document.getElementById('btn-theme-selector') 
    btnThemeSelector.onclick = function(){changeTheme(toTheme)}
}

// Установка выбранной темы
function changeTheme(theme){
    localStorage.setItem('colorTheme', theme)
    themeSelector()
}

themeSelector()