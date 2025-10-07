class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        this.gameScene = this.scene.get('GameScene'); // Ottieni un riferimento alla GameScene

        // Testo per lo stato del gioco (es. "Filosofi trovati: 0/5")
        this.statusText = this.add.text(20, 20, '', { 
            fontSize: '18px', 
            fill: '#000000', 
            fontStyle: 'bold', 
            fontFamily: '"Cinzel", serif' 
        });

        // Testo per l'interazione ([E] Parla)
        this.interactionText = this.add.text(400, 450, '[E] Parla', { 
            fontSize: '20px', 
            fill: '#fff', 
            backgroundColor: '#000', 
            padding: { x: 10, y: 5 },
            fontFamily: '"Cinzel", serif' 
        }).setOrigin(0.5).setVisible(false);
        
        // Pannello del dialogo (più scuro e grande)
        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(0x000000, 0.8)
                      .fillRect(50, 400, 700, 180) // x, y, width, height
                      .setVisible(false);

        // Testo del dialogo
        this.dialogText = this.add.text(70, 420, '', { 
            fontSize: '20px', 
            fill: '#fff', 
            wordWrap: { width: 660 },
            fontFamily: '"Cinzel", serif' 
        }).setVisible(false);

        // Pulsante per chiudere il dialogo o per la risposta
        this.dialogButton = this.add.text(680, 550, 'Continua', { 
            fontSize: '20px', 
            fill: '#fff', 
            backgroundColor: '#333333', 
            padding: { x: 10, y: 5 },
            fontFamily: '"Cinzel", serif' 
        }).setOrigin(1, 1).setInteractive({ useHandCursor: true }).setVisible(false);

        this.dialogButton.on('pointerover', () => this.dialogButton.setStyle({ fill: '#ffff99
