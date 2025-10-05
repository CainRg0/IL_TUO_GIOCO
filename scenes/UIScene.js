// VERSIONE CORRETTA: Questa versione non causerà l'errore 'toLowerCase'.
class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }
    create() { /* ... tutto il codice che abbiamo già verificato ... */ }
    typewriteText(text, onCompleteCallback) { /* ... non cambia ... */ }
    startDialog(philosopherName) { /* ... non cambia ... */ }
    showQuestion() { /* ... non cambia ... */ }
    createButton(x, y, text, answer) { /* ... non cambia ... */ }
    handleAnswer(playerAnswer) { /* ... non cambia ... */ }
    endQuiz() { /* ... non cambia ... */ }
    closeDialog() { /* ... non cambia ... */ }
    winGame() { /* ... non cambia ... */ }

    updateStatusText() {
        // Questa è la funzione che causava l'errore. Ora è corretta.
        const text = ['Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora']
            .map(p => {
                const philosopherName = p.toLowerCase();
                const completed = this.gameState.completed.includes(philosopherName);
                return `${p}: ${completed ? '✓' : '✗'}`;
            })
            .join('\n');
        this.statusText.setText(text);
    }
}
