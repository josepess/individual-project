'use struct'

// Текщий уровень
const currentLevel = 'final'


let exerciseField = document.getElementById('exercise-field')
exerciseField.innerHTML = `
<div>
    <input type="button" id="submit-new-game" value="Новая игра"/>
</div>
`
let submitNewGame = document.getElementById('submit-new-game')
submitNewGame.onclick = function(){newGame()}

function main(){
    securityChecks()
    showScore()
}

main()
