class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        this.add.image(400, 300, 'platone').setScale(0.8).setAlpha(0.3);

        this.add.text(400, 200, 'La Scuola di Atene', {
            fontSize: '52px',
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setShadow(2, 2, '#000', 4);

        // --- BOTTONI DEL MENU ---
        this.startButton = this.add.text(400, 350, 'Inizia il Viaggio', {
            fontSize: '32px', fill: '#c5a65a', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        this.loreButton = this.add.text(400, 420, 'Lore', {
            fontSize: '24px', fill: '#c5a65a', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // --- NUOVO: PULSANTE CREDITI ---
        this.creditsButton = this.add.text(750, 560, 'Crediti', { // Posizionato in basso a destra
            fontSize: '18px', fill: '#c5a65a', fontFamily: '"Cinzel", serif'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });


        // Eventi per i pulsanti
        this.startButton.on('pointerover', () => this.startButton.setStyle({ fill: '#fff' }));
        this.startButton.on('pointerout', () => this.startButton.setStyle({ fill: '#c5a65a' }));
        this.startButton.on('pointerdown', () => this.startGame());

        this.loreButton.on('pointerover', () => this.loreButton.setStyle({ fill: '#fff' }));
        this.loreButton.on('pointerout', () => this.loreButton.setStyle({ fill: '#c5a65a' }));
        this.loreButton.on('pointerdown', () => this.showLore());

        // Eventi per il nuovo pulsante Crediti
        this.creditsButton.on('pointerover', () => this.creditsButton.setStyle({ fill: '#fff' }));
        this.creditsButton.on('pointerout', () => this.creditsButton.setStyle({ fill: '#c5a65a' }));
        this.creditsButton.on('pointerdown', () => {
            this.sound.stopAll(); // Ferma la musica del menu o il narratore
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CreditsScene');
            });
        });


        this.narratorSound = this.sound.add('narrator');
        this.createLoreScreen();

        this.konamiCode = ['ARROWUP', 'ARROWUP', 'ARROWDOWN', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWLEFT', 'ARROWRIGHT', 'B', 'A'];
        this.inputKeys = [];
        this.input.keyboard.on('keydown', this.handleKonamiCode, this);
    }

    startGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('GameScene');
            this.scene.launch('UIScene');
        });
    }

    createLoreScreen() {
        this.loreGroup = this.add.group();
        const bg = this.add.graphics().fillStyle(0xE0D6B3, 1).fillRect(0, 0, 800, 600);
        const image = this.add.image(240, 300, 'scuola_di_atene').setScale(0.4);
        const loreTextContent = [
            'L\'Affresco: La Scuola di Atene',
            '',
            'Opera di Raffaello Sanzio (1509-1511) situata nelle Stanze Vaticane, celebra la conoscenza e la filosofia classica, riunendo i più grandi pensatori dell\'antichità.',
            '',
            'Significato e Personaggi',
            'Al centro, Platone punta verso l\'alto (il mondo delle idee), mentre Aristotele indica il basso (il mondo terreno). Nel gioco incontri anche:',
            '• Socrate',
            '• Pitagora',
            '• Diogene'
        ];
        const text = this.add.text(570, 100, loreTextContent, {
            fontSize: '18px', fill: '#000000', fontStyle: 'bold', align: 'center', 
            wordWrap: { width: 380 }, lineSpacing: 10
        }).setOrigin(0.5, 0);
        const closeButton = this.add.text(400, 560, '[ Chiudi ]', {
            fontSize: '24px', fill: '#333', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeButton.on('pointerover', () => closeButton.setStyle({ fill: '#000' }));
        closeButton.on('pointerout', () => closeButton.setStyle({ fill: '#333' }));
        closeButton.on('pointerdown', () => this.hideLore());
        this.loreGroup.addMultiple([bg, image, text, closeButton]);
        this.loreGroup.setVisible(false);
    }
    
    showLore() {
        this.startButton.setVisible(false);
        this.loreButton.setVisible(false);
        this.creditsButton.setVisible(false); // Nascondiamo anche il nuovo pulsante
        this.loreGroup.setVisible(true);
        this.narratorSound.play();
    }

    hideLore() {
        this.loreGroup.setVisible(false);
        this.startButton.setVisible(true);
        this.loreButton.setVisible(true);
        this.creditsButton.setVisible(true); // Rimostriamo anche il nuovo pulsante
        if (this.narratorSound.isPlaying) {
            this.narratorSound.stop();
        }
    }

    handleKonamiCode(event) {
        this.inputKeys.push(event.key.toUpperCase());
        if (this.inputKeys.length > this.konamiCode.length) {
            this.inputKeys.shift();
        }

        if (this.inputKeys.join('') === this.konamiCode.join('')) {
            console.log('Codice Segreto Attivato!');
            this.sound.stopAll();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CreditsScene');
            });
        }
    }
}

