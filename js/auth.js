'use struct'

const divLoginForm = document.getElementById('login-form')
divLoginForm.innerHTML = `
    <div id="loginform-name">
        <b>Имя игрока:</b>
        <input type="text" id="player-name" maxlength="10" placeholder="Введите имя игрока"/>
        <input type="button" id="submit" value="Войти"/>
    </div>
    <div id="login-error"></div>
    <div id="div-level-of-difficulty">
        <p>Выберите уровень сложности:</p>
        <form>
            <input type="radio" id="easy-level"
                    name="level-of-difficulty" value="easy">
            <label for="easy-level">Легкий(25 секунд)</label>
            <input type="radio" id="normal-level"
                    name="level-of-difficulty" value="normal" checked>
            <label for="normal-level">Нормальный(15 секунд)</label>
            <input type="radio" id="normal-level"
                    name="level-of-difficulty" value="hard">
            <label for="normal-level">Сложный(5 секунд)</label>
        </form>
    </div>
    `
const enterBtn = document.getElementById('submit')
enterBtn.onclick = function(){auth()}

// Отправка имени по нажатию на клавишу Enter
document.getElementById('player-name').addEventListener('keydown',
function(event) {
   if (event.keyCode === 13){
      auth()
   }
})

endGame()

// Авторизация
function auth(){
    const playerName = document.getElementById('player-name').value
    document.getElementById('player-name').value = ''
    let divLoginError = document.getElementById('login-error')
    const formLevelOfDifficulty = document.querySelector('form')
    let levelOfDifficulty = new FormData(formLevelOfDifficulty) 

    for (const entry of levelOfDifficulty){
        localStorage.setItem('complexity', entry[1])
    }

    console.log(localStorage.getItem('complexity'))
    
    if (playerName.length > 0){
        localStorage.setItem('currentPlayer', playerName)
        divLoginError.innerHTML = ``
        document.location.href = 'level1.html'
    }else{
        divLoginError.innerHTML = `<h4>Укажите имя игрока!</4>`
    }
}
