// File: scenes/TitleScene.js

class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        // Aggiungiamo uno sfondo per il menu
        this.add.image(400, 300, 'platone').setScale(0.8).setAlpha(0.3); // Usiamo l'immagine di Platone come sfondo scuro

        // Titolo del gioco
        this.add.text(400, 200, 'La Scuola di Atene', {
            fontSize: '52px',
            fill: '#E0D6B3', // Stesso colore oro usato prima
            fontFamily: '"Cinzel", serif' // Usiamo lo stesso font del menu HTML
        }).setOrigin(0.5).setShadow(2, 2, '#000', 4);

        // Pulsante di avvio
        const startButton = this.add.text(400, 350, 'Inizia il Viaggio', {
            fontSize: '32px',
            fill: '#c5a65a',
            fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Effetto hover sul pulsante
        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#fff' });
        });
        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#c5a65a' });
        });

        // Azione al click sul pulsante
        startButton.on('pointerdown', () => {
            // Aggiungiamo una transizione in dissolvenza per un effetto più pulito
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('GameScene');
                this.scene.launch('UIScene');
            });
        });
    }
}