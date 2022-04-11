'use struct'

// Текщий уровень
const currentLevel = 'level-2'

// Цвета фигур
const levelAdditions = [
    ['желтые', 'yellow'],
    ['зеленые', 'green'], 
    ['оранжевые', 'orange']
]

// Выделить фигуру или снять выделение
function selectFigure(id){
    let figure = document.getElementById(id)
    let levelProgress =  JSON.parse(localStorage.getItem('levelProgress')) || {}

    if(window.getComputedStyle(figure, null).getPropertyValue('filter') === 'none'){
        figure.style.setProperty('filter', 'grayscale(100%)')
        figure.style.setProperty('-webkit-animation', '1s 3')
        figure.style.setProperty('-moz-animation', '1s 3')
        figure.style.setProperty('animation', 'blinker 1s 3')

        selectedFigures[id] = [figure.classList[0], figure.classList[1]]

        // Добавление в хранилище выделенных фигур
        levelProgress[id] = {figure: selectedFigures[id][0], additional: selectedFigures[id][1]}
        localStorage.setItem('levelProgress', JSON.stringify(levelProgress))

    }else{
        figure.style.removeProperty('filter')
        figure.style.removeProperty('-webkit-animation')
        figure.style.removeProperty('-moz-animation')
        figure.style.removeProperty('animation')
        delete selectedFigures[id]
        
        // Удаление из хранилища фигуры с которой снято выделение
        let items = JSON.parse(localStorage.levelProgress)
        delete items[id]
        localStorage.setItem('levelProgress', JSON.stringify(items))
    }
}

function main(numberOfFigure){
    securityChecks()
    showScore()
    levelTimer()

    const gameField = document.getElementById('game-field')

    while(numberOfFigure > 0){
        // Выбираем класс фигуры
        const classOfFigure = Math.floor((Math.random() * classesOfFigures.length)) 
        const figure = document.createElement('div')
        figure.id = numberOfFigure
        figure.classList.add(classesOfFigures[classOfFigure][1])

        // Действие при клике по фигуре
        figure.ondblclick = function(){selectFigure(figure.id)}
        
        // Выбираем дополнительный параметр уровня
        const additional = Math.floor((Math.random() * levelAdditions.length))
        // figure.style.background = levelAdditions[additional][1]
        figure.classList.add(levelAdditions[additional][1])
        const box = document.createElement('div')
        box.classList.add('big')
        box.append(figure)

        gameField.append(box)
        numberOfFigure--
        makeExercise(classOfFigure, additional)
    }
}
let exerciseFild = document.getElementById('exercise-field')
exerciseFild.innerHTML = `<p>На данном уровне необходимо двойным кликом выбрать фигуры определенного цвета<br> На прохождение уровня дается ${levelTimeout} секунд</p>
    <div>
        <input type="button" id="submit-start" value="Начать"/>
    </div>
    `
    let submitDone = document.getElementById('submit-start')
    submitDone.onclick = function(){main(numberOfFigures)}
//main(numberOfFigures)