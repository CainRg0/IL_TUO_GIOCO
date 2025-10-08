class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        // Avvia la musica dell'introduzione
        this.sound.play('intro_music', { loop: true, volume: 0.6 });

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500);

        const dialogBox = this.add.graphics();
        dialogBox.fillStyle(0x000000, 0.8).fillRoundedRect(50, 380, 700, 200, 16); // Leggermente più grande
        this.dialogText = this.add.text(80, 400, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 640 } });

        // --- TESTO AGGIORNATO CON I COMANDI ---
        const introText = 'Benvenuto, giovane pensatore.\n\n' +
                          'Il tuo viaggio nella conoscenza sta per iniziare. Supera le prove dei grandi maestri del passato per dimostrare la tua saggezza.\n\n' +
                          'COMANDI:\n' +
                          '- Usa le FRECCE DIREZIONALI per muoverti.\n' +
                          '- Avvicinati a un filosofo e premi [E] per interagire.\n\n' +
                          '(Clicca per iniziare)';

        this.typewriteText(introText);
    }

    typewriteText(text) {
        const length = text.length;
        let i = 0;
        this.dialogText.setText('');
        
        this.time.addEvent({
            callback: () => {
                this.dialogText.text += text[i];
                i++;
                if (i === length) {
                    this.input.once('pointerdown', () => {
                        this.sound.stopAll(); // Ferma la musica dell'intro
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                            this.scene.start('GameScene');
                            this.scene.launch('UIScene');
                        });
                    });
                }
            },
            repeat: length - 1,
            delay: 40,
        });
    }
}
