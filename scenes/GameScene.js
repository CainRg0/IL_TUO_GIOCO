class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    create() {
        // Usa le dimensioni attuali della canvas, che si adatteranno
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        this.bgImage = this.add.image(gameWidth / 2, gameHeight / 2, 'game_bg').setDepth(-1).setDisplaySize(gameWidth, gameHeight);

        // Muri invisibili (questi ora si adattano alla dimensione dello schermo)
        const walls = this.physics.add.staticGroup();
        // Muro superiore
        walls.create(gameWidth / 2, gameHeight * 0.1).setSize(gameWidth, gameHeight * 0.2).setVisible(false); 
        // Muro sinistro
        walls.create(gameWidth * 0.1, gameHeight / 2).setSize(gameWidth * 0.2, gameHeight).setVisible(false); 
        // Muro destro
        walls.create(gameWidth * 0.9, gameHeight / 2).setSize(gameWidth * 0.2, gameHeight).setVisible(false); 
        // Muro inferiore
        walls.create(gameWidth / 2, gameHeight * 0.9).setSize(gameWidth, gameHeight * 0.2).setVisible(false); 

        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Posizioni iniziali adattate al centro della parte inferiore
        this.player = this.physics.add.sprite(gameWidth / 2, gameHeight * 0.8, 'player'); 
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.1);
        this.physics.add.collider(this.player, walls);

        this.philosophers = this.physics.add.group({
            collideWorldBounds: true,
        });

        // Posizioni dei filosofi (adattate per il formato verticale e mobile)
        const philosopherData = [ 
            { key: 'platone', x: gameWidth * 0.25, y: gameHeight * 0.25, scale: 0.2 },
            { key: 'aristotele', x: gameWidth * 0.75, y: gameHeight * 0.55, scale: 0.2 },
            { key: 'diogene', x: gameWidth * 0.5, y: gameHeight * 0.2, scale: 0.2 },
            { key: 'socrate', x: gameWidth * 0.2, y: gameHeight * 0.45, scale: 0.2 },
            { key: 'pitagora', x: gameWidth * 0.8, y: gameHeight * 0.4, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key).setScale(data.scale).setName(data.key);
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);
            this.physics.add.collider(philosopher, walls);
            const name = data.key.charAt(0).toUpperCase() + data.key.slice(1);
            const label = this.add.text(philosopher.x, philosopher.y - 45, name, { fontSize: '14px', fill: '#ffffff', fontFamily: '"Cinzel", serif', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5);
            philosopher.nameLabel = label;
        });
        
        this.physics.add.collider(this.player, this.philosophers);
        this.physics.add.collider(this.philosophers, this.philosophers);
        
        // --- CONTROLLI ADATTIVI ---
        this.cursors = null; // Inizializza a null per PC
        this.interactKey = null; // Inizializza a null per PC

        if (this.sys.game.isMobile) {
            // Se è mobile, creiamo il joystick
            // --- MODIFICATO: Usiamo this.plugins.get() ---
            this.joystick = this.plugins.get('rexVirtualJoystick').add(this, {
                x: gameWidth * 0.15,
                y: gameHeight * 0.85,
                radius: 60,
                base: this.add.circle(0, 0, 60, 0x888888, 0.5),
                thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.7),
                forceMin: 16 
            });
            this.cursorKeys = this.joystick.createCursorKeys();

            // Pulsante di interazione touch per mobile
            this.interactButton = this.add.text(gameWidth * 0.85, gameHeight * 0.85, 'E', {
                fontSize: '48px',
                fill: '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 20, y: 15 },
                borderRadius: 50 
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(100).setVisible(false); 
            
            this.interactButton.on('pointerdown', () => {
                if (this.canInteractWith && !this.dialogActive) {
                    this.dialogActive = true;
                    this.events.emit('startDialog', this.canInteractWith.name);
                }
            });
            this.interactButton.on('pointerover', () => this.interactButton.setStyle({ fill: '#ffff99' }));
            this.interactButton.on('pointerout', () => this.interactButton.setStyle({ fill: '#ffffff' }));

        } else {
            // Se è PC, usiamo la tastiera
            this.cursors = this.input.keyboard.createCursorKeys();
            this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        }

        if (!this.sound.get('bgm')) { this.sound.play('bgm', { loop: true, volume: 0.4 }); }
        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.3 });
        this.footstepsSound.play();
        this.footstepsSound.pause();
        this.time.addEvent({ delay: 3000, callback: this.movePhilosophers, callbackScope: this, loop: true });

        // Evento di resize per adattare gli elementi quando la finestra cambia dimensione
        this.scale.on('resize', this.resize, this);
        this.resize({ width: gameWidth, height: gameHeight }); 
    }

    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        this.cameras.main.setViewport(0, 0, width, height);

        if (this.bgImage) this.bgImage.destroy();
        this.bgImage = this.add.image(width / 2, height / 2, 'game_bg').setDepth(-1).setDisplaySize(width, height);

        this.physics.world.bounds.setTo(0, 0, width, height); 

        if (this.sys.game.isMobile && this.joystick) { // Assicurati che il joystick sia stato creato
            this.joystick.x = width * 0.15;
            this.joystick.y = height * 0.85;
            if (this.interactButton) {
                this.interactButton.setPosition(width * 0.85, height * 0.85);
            }
        }
    }

    movePhilosophers() { /* ... non cambia ... */ }

    update() {
        this.philosophers.getChildren().forEach(philosopher => { 
            if (philosopher.nameLabel) {
                philosopher.nameLabel.setPosition(philosopher.x, philosopher.y - 45);
            }
        });

        if (this.dialogActive) { 
            this.player.setVelocity(0); 
            this.philosophers.setVelocity(0, 0); 
            if (!this.footstepsSound.isPaused) this.footstepsSound.pause(); 
            if (this.sys.game.isMobile && this.interactButton) {
                this.interactButton.setVisible(false);
            }
            return; 
        }

        const playerSpeed = 200;
        this.player.setVelocity(0);

        let isMoving = false;
        if (this.sys.game.isMobile && this.cursorKeys) {
            if (this.cursorKeys.left.isDown) this.player.setVelocityX(-playerSpeed);
            else if (this.cursorKeys.right.isDown) this.player.setVelocityX(playerSpeed);
            if (this.cursorKeys.up.isDown) this.player.setVelocityY(-playerSpeed);
            else if (this.cursorKeys.down.isDown) this.player.setVelocityY(playerSpeed);
            isMoving = this.player.body.velocity.length() > 0;
        } else if (this.cursors) {
            if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
            else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
            if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
            else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);
            isMoving = this.player.body.velocity.length() > 0;
        }
        
        if (isMoving && this.footstepsSound.isPaused) this.footstepsSound.resume();
        else if (!isMoving && !this.footstepsSound.isPaused) this.footstepsSound.pause();

        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y) < 100) {
                canInteractWith = philosopher;
                break;
            }
        }
        this.canInteractWith = canInteractWith; 

        this.events.emit('interactionUpdate', canInteractWith);

        if (this.sys.game.isMobile && this.interactButton) {
            if (canInteractWith && !this.dialogActive) {
                this.interactButton.setVisible(true);
            } else {
                this.interactButton.setVisible(false);
            }
        } else if (canInteractWith && this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) { 
            this.dialogActive = true; 
            this.events.emit('startDialog', canInteractWith.name); 
        }
    }
}
