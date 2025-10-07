class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.add.image(400, 300, 'game_bg').setDepth(-1);
        
        // --- INVISIBLE WALLS --- (Per contenere player e filosofi)
        const walls = this.physics.add.staticGroup();
        walls.create(400, 80).setSize(800, 160).setVisible(false);
        walls.create(80, 300).setSize(160, 600).setVisible(false);
        walls.create(720, 300).setSize(160, 600).setVisible(false);
        walls.create(400, 580).setSize(800, 40).setVisible(false);
        
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(400, 550, 'player'); // Giocatore al centro in basso
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.1);
        this.physics.add.collider(this.player, walls);

        this.philosophers = this.physics.add.group({
            collideWorldBounds: true,
        });

        const philosopherData = [
            { key: 'platone', x: 200, y: 180, scale: 0.2 },
            { key: 'aristotele', x: 600, y: 180, scale: 0.2 },
            { key: 'diogene', x: 400, y: 200, scale: 0.2 },
            { key: 'socrate', x: 150, y: 400, scale: 0.2 },
            { key: 'pitagora', x: 650, y: 400, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale)
                .setName(data.key);
            
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);
            this.physics.add.collider(philosopher, walls);

            const name = data.key.charAt(0).toUpperCase() + data.key.slice(1);
            const label = this.add.text(philosopher.x, philosopher.y - 45, name, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: '"Cinzel", serif',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            
            philosopher.nameLabel = label;

            // --- FUNZIONE DI INTERAZIONE TRAMITE CLIC SUL FILOSOFO ---
            philosopher.setInteractive({ useHandCursor: true }); 
            philosopher.on('pointerdown', () => {
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
                // Avvia il dialogo solo se il giocatore è vicino E nessun dialogo è attivo
                if (distance < 100 && !this.dialogActive) {
                    this.dialogActive = true; // Blocca il movimento del gioco
                    this.events.emit('startDialog', philosopher.name);
                }
            });
        });
        
        this.physics.add.collider(this.player, this.philosophers);
        this.physics.add.collider(this.philosophers, this.philosophers);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // --- Variabile di stato per il dialogo, gestita tra GameScene e UIScene ---
        this.dialogActive = false; 

        if (!this.sound.get('bgm')) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.3 });
        this.footstepsSound.play();
        this.footstepsSound.pause();

        this.time.addEvent({
            delay: 3000,
            callback: this.movePhilosophers,
            callbackScope: this,
            loop: true
        });

        // --- ASCOLTA L'EVENTO DI FINE DIALOGO DALLA UISCENE ---
        // Questo sblocca il movimento del giocatore e dei filosofi
        this.events.on('endDialog', () => {
            this.dialogActive = false; 
        });
    }

    movePhilosophers() {
        if (this.dialogActive) return; // I filosofi si fermano se il dialogo è attivo
        const speed = 30;
        this.philosophers.getChildren().forEach(philosopher => {
            const randNumber = Phaser.Math.Between(0, 5);
            switch (randNumber) {
                case 0: philosopher.setVelocity(0, -speed); break;
                case 1: philosopher.setVelocity(speed, 0); break;
                case 2: philosopher.setVelocity(0, speed); break;
                case 3: philosopher.setVelocity(-speed, 0); break;
                default: philosopher.setVelocity(0, 0); break;
            }
        });
    }

    update() {
        // --- BLOCCO DEL GIOCO SE IL DIALOGO E' ATTIVO ---
        if (this.dialogActive) {
            this.player.setVelocity(0); 
            this.philosophers.setVelocity(0, 0); 
            if (!this.footstepsSound.isPaused) this.footstepsSound.pause(); 
            return; // Interrompe l'update per non muovere nulla
        }

        this.philosophers.getChildren().forEach(philosopher => {
            if (philosopher.nameLabel) {
                let labelX = philosopher.x;
                const labelWidth = philosopher.nameLabel.width / 2;
                if (labelX - labelWidth < 0) {
                    labelX = labelWidth;
                } else if (labelX + labelWidth > this.physics.world.bounds.width) {
                    labelX = this.physics.world.bounds.width - labelWidth;
                }
                philosopher.nameLabel.setPosition(labelX
