class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }
    create() { /* ... codice corretto ... */ }
    typewriteText(text, onCompleteCallback) { /* ... codice corretto ... */ }
    startDialog(philosopherName) { /* ... codice corretto ... */ }
    showQuestion() { /* ... codice corretto ... */ }
    createButton(x, y, text, answer) { /* ... codice corretto ... */ }
    handleAnswer(playerAnswer) { /* ... codice corretto ... */ }
    endQuiz() { /* ... codice corretto ... */ }
    closeDialog() { /* ... codice corretto ... */ }
    winGame() { /* ... codice corretto ... */ }
    updateStatusText() {
        const text = ['Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora']
            .map(p => `${p.charAt(0).toUpperCase() + p.slice(1)}: ${this.gameState.completed.includes(p.toLowerCase()) ? '✓' : '✗'}`)
            .join('\n');
        this.statusText.setText(text);
    }
}
