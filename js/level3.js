'use struct'

// Текщий уровень
const currentLevel = 'level-3'

// Дополнительный параметр уровня
const levelAdditions = [
    ['динозавром', 'dinosaurus', "url('img/dinosaur.jpg')"],
    ['луной', 'moon', "url('img/moon.jpg')"],
    ['цветком', 'flower',"url('img/flower.jpg')"]
]

let levelProgress =  JSON.parse(localStorage.getItem('levelProgress')) || {}

// Начало перетаскивания фигуры
function onDragStart(event){
    event.dataTransfer.setData('text/plain', event.target.id)
}

// Перетаскивание над целью
function onDragOver(event){
    event.preventDefault()
}

// Фигура перенесена в цель
function onDrop(event){
    event.preventDefault()
    const id = event.dataTransfer.getData('text')
    const draggableElement = document.getElementById(id)
    const box = document.createElement('div')
    box.classList.add('big')
    box.append(draggableElement)
    event.target.appendChild(box)
    // event.dataTransfer.clearData()

    if (box.parentElement.id === 'dropzone'){
        selectedFigures[id] = [draggableElement.classList[0], draggableElement.classList[1]]

        // Добавление в хранилище выделенных фигур
        levelProgress[id] = {figure: selectedFigures[id][0], additional: selectedFigures[id][1]}
        localStorage.setItem('levelProgress', JSON.stringify(levelProgress))

        // Еффекты после перетаскивания
        draggableElement.style.filter = 'grayscale(100%)'
        draggableElement.style.setProperty('-webkit-animation', '1s 2')
        draggableElement.style.setProperty('-moz-animation', '1s 2')
        draggableElement.style.setProperty('animation', 'blinker 1s 2')
    } else {
        // Возврат фигур на игровое поле
        // Удаление из хранилища фигуры которую вернули на игровое поле
        let items = JSON.parse(localStorage.levelProgress)
        delete items[id]
        localStorage.setItem('levelProgress', JSON.stringify(items))

        // Удаление эффекта с фигуры которую вернули на игровое поле
        draggableElement.style.removeProperty('filter')
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

        // Делаем фигуру перетаскиваемой
        figure.setAttribute('draggable', 'true')
        figure.setAttribute('ondragstart', 'onDragStart(event)')

        // Выбираем дополнительный параметр уровня
        const additional = Math.floor((Math.random() * levelAdditions.length))
        figure.style.backgroundImage = levelAdditions[additional][2]
        figure.classList.add(levelAdditions[additional][1])
        const box = document.createElement('div')
        box.classList.add('big')
        box.append(figure)

        gameField.append(box)
        numberOfFigure--
        makeExercise(classOfFigure, additional)
    }

}

main(numberOfFigures)