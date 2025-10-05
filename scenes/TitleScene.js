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
        
        // --- NUOVO: Pulsante LORE ---
        this.loreButton = this.add.text(400, 420, 'Lore', { // Posizionato sotto il pulsante Start
            fontSize: '24px', fill: '#c5a65a', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Eventi per il pulsante Start
        this.startButton.on('pointerover', () => this.startButton.setStyle({ fill: '#fff' }));
        this.startButton.on('pointerout', () => this.startButton.setStyle({ fill: '#c5a65a' }));
        this.startButton.on('pointerdown', () => this.startGame());

        // Eventi per il pulsante Lore
        this.loreButton.on('pointerover', () => this.loreButton.setStyle({ fill: '#fff' }));
        this.loreButton.on('pointerout', () => this.loreButton.setStyle({ fill: '#c5a65a' }));
        this.loreButton.on('pointerdown', () => this.showLore());

        // --- NUOVO: Elementi per la schermata LORE (inizialmente invisibili) ---
        this.createLoreScreen();

        // --- CODICE SEGRETO (KONAMI CODE) ---
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

    // --- NUOVA FUNZIONE: Crea la schermata Lore ---
    createLoreScreen() {
        // Un gruppo per contenere tutti gli elementi della schermata Lore
        this.loreGroup = this.add.group();

        // Sfondo scuro semi-trasparente
        const bg = this.add.graphics().fillStyle(0x000000, 0.9).fillRect(0, 0, 800, 600);
        
        // Immagine del quadro
        const image = this.add.image(400, 150, 'scuola_di_atene').setScale(0.35);

        // Testo descrittivo
        const loreTextContent = [
            'L\'Affresco: La Scuola di Atene',
            '',
            'La Scuola di Atene è un celebre affresco dipinto da Raffaello Sanzio tra il 1509 e il 1511. Si trova in una delle Stanze Vaticane e rappresenta la celebrazione della conoscenza e della filosofia classica, riunendo i più grandi pensatori dell\'antichità in un unico, maestoso edificio.',
            '',
            'Significato e Personaggi',
            'Al centro, Platone punta il dito verso l\'alto, indicando il mondo delle idee, mentre Aristotele tiene il palmo verso il basso, rappresentando la conoscenza basata sull\'osservazione del mondo terreno. Nel gioco incontri:',
            '• Socrate: il maestro di Platone, riconoscibile per il suo profilo schiacciato.',
            '• Pitagora: in primo piano, intento a scrivere su un libro le sue teorie sui numeri.',
            '• Diogene: il cinico, sdraiato con indifferenza sugli scalini.'
        ];
        const text = this.add.text(400, 330, loreTextContent, {
            fontSize: '16px', fill: '#ddd', align: 'center', wordWrap: { width: 700 }, lineSpacing: 5
        }).setOrigin(0.5, 0);

        // Pulsante per chiudere
        const closeButton = this.add.text(400, 560, '[ Chiudi ]', {
            fontSize: '24px', fill: '#c5a65a', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeButton.on('pointerover', () => closeButton.setStyle({ fill: '#fff' }));
        closeButton.on('pointerout', () => closeButton.setStyle({ fill: '#c5a65a' }));
        closeButton.on('pointerdown', () => this.hideLore());

        // Aggiungiamo tutti gli elementi al gruppo
        this.loreGroup.addMultiple([bg, image, text, closeButton]);

        // Nascondiamo il gruppo
        this.loreGroup.setVisible(false);
    }
    
    // --- NUOVA FUNZIONE: Mostra la schermata Lore ---
    showLore() {
        this.startButton.setVisible(false);
        this.loreButton.setVisible(false);
        this.loreGroup.setVisible(true);
    }

    // --- NUOVA FUNZIONE: Nasconde la schermata Lore ---
    hideLore() {
        this.loreGroup.setVisible(false);
        this.startButton.setVisible(true);
        this.loreButton.setVisible(true);
    }

    // --- Funzione per il codice segreto ---
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
