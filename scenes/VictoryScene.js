class VictoryScene extends Phaser.Scene {
    constructor() { super('VictoryScene'); }
    create() {
        // Ferma tutti i suoni del gioco
        this.sound.stopAll();
        this.sound.play('victory_sound', { volume: 0.8 });

        // Aggiunge un rettangolo nero che copre l'intero schermo.
        // I valori 0, 0 sono le coordinate x e y di partenza.
        // I valori 800, 600 sono la larghezza e l'altezza, che dovrebbero corrispondere
        // alle dimensioni del tuo gioco.
        // 0x000000 è il colore nero in esadecimale.
        this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0, 0);

        // Aggiunge l'immagine e gli altri elementi della scena di vittoria
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setTint(0xFFD700).setAlpha(0.6);
        const title = this.add.text(400, 250, 'CONGRATULAZIONI!', { fontSize: '52px', fill: '#FFFFFF', fontFamily: '"Cinzel", serif', stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5);
        this.add.text(400, 320, 'Hai dimostrato la tua saggezza superando le prove di tutti i pensatori.', { fontSize: '18px', fill: '#FFFFFF', fontFamily: '"Cinzel", serif', align: 'center', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5);

        // Aggiunge il tween al titolo
        this.tweens.add({ targets: title, scale: 1.05, duration: 800, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });

        // Aggiunge il testo per continuare
        this.add.text(400, 550, '(Clicca per continuare ai titoli di coda)', { fontSize: '20px', fill: '#E0D6B3' }).setOrigin(0.5);

        // Gestisce l'input del mouse per passare alla scena successiva
        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CreditsScene');
            });
        });
    }
}
