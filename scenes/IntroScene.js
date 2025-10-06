class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500);

        const dialogBox = this.add.graphics();
        dialogBox.fillStyle(0x000000, 0.8).fillRoundedRect(50, 400, 700, 180, 16);
        this.dialogText = this.add.text(80, 420, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 640 } });

        const introText = 'Benvenuto, giovane pensatore.\n\nIl tuo viaggio nella conoscenza sta per iniziare. Esplora questo luogo e parla con i grandi maestri del passato. Supera le loro prove per dimostrare la tua saggezza.\n\n(Clicca per continuare)';

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
