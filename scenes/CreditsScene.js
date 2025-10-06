class CreditsScene extends Phaser.Scene {
    constructor() { super('CreditsScene'); }

    create() {
        this.sound.stopAll();
        this.sound.play('credits_music', { loop: true, volume: 0.5 });
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(0.4);

        const creditsText = [
            'Paideia', '(Alla scuola di atene)', '', '',
            'Un Progetto Realizzato Da:', '', '',
            'Christian Rongo', '[ Game Developer ]', '',
            'Francesco Maffettone', '[ Concept Creator ]', '',
            'Pasquale Muriello', '[ Art Designer ]', '', '', '',
            'Un Ringraziamento Speciale ai Pensatori:', '',
            'Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora', '', '', '',
            'Hanno partecipato al progetto anche:', '',
            'Panico Christian', 'Valerio D\'Alconzo', 'Palladino Gabriele', 'Daniele Napolitano',
            'Fusaro Mario', 'Zito Giovanni', 'Luca Lombardi', 'Manila Signore',
            'Adriano Gabriele', 'Alessandro de Falco', 'Testa Daniele',
            'Davide Sorrentino', 'Giuseppe Di Mauro', 'Marco Aprea', '', '', '',
            'ITI E. BARSANTI - POMIGLIANO D\'ARCO', 'Classe 4B', '', '',
            'Grazie per aver giocato!',
        ];

        const textObject = this.add.text(400, 800, creditsText, {
            fontSize: '28px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif',
            align: 'center', lineSpacing: 15
        }).setOrigin(0.5);

        this.tweens.add({
            targets: textObject,
            y: - (textObject.height / 2),
            duration: 60000, 
            ease: 'Linear',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.sound.stopAll();
                    this.scene.start('TitleScene');
                });
            }
        });
    }
}
