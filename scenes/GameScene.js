class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isPlayerBlocked = false;
    }

    create() {
        this.add.image(400, 300, 'game_bg').setDepth(-1);
        
        const walls = this.physics.add.staticGroup();

        // --- BARRIERE INVISIBILI AGGIORNATE (Meno restrittive) ---
        // Queste barriere mirano a coprire solo i bordi esterni della stanza visibile,
        // lasciando il più spazio possibile al centro.
        
        // Barriera SUPERIORE: Lungo il bordo superiore del pavimento, sotto le teste dei filosofi
        // Un po' più in basso per permettere di camminare più su.
        walls.create(400, 160).setSize(800, 20).setVisible(false); 
        
        // Barriera INFERIORE: Lungo il bordo inferiore del pavimento
        walls.create(400, 560).setSize(800, 20).setVisible(false); 
        
        // Barriera SINISTRA: Copre le colonne di sinistra
        walls.create(100, 360).setSize(20, 400).setVisible(false); 
        
        // Barriera DESTRA: Copre le colonne di destra
        walls.create(700, 360).setSize(20, 400).setVisible(false); 
        
        // Ho rimosso le barriere centrali che causavano il blocco.
        // Se ci sono altre colonne centrali che devono bloccare, dovremo aggiungerle con precisione,
        // ma per ora concentriamoci sulla libertà di movimento.

        // --- FINE BARRIERE INVISIBILI AGGIORNATE ---

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(400, 550, 'player'); 
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
        });
        
        this.physics.add.collider(this.player, this.philosophers);
        this.physics.add.collider(this.philosophers, this.philosophers);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

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

        this.events.on('endDialog', () => {
            this.isPlayerBlocked = false; 
            this.philosophers.getChildren().forEach(p => p.setVelocity(0)); 
            this.movePhilosophers(); 
        });
    }

    movePhilosophers() {
        const speed = 30;
        this.philosophers.getChildren().forEach(philosopher => {
            if (this.scene.get('UIScene').currentPhilosopher === philosopher.name) {
                philosopher.setVelocity(0, 0); 
                return; 
            }
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
        const playerSpeed = 200;
        this.player.setVelocity(0);

        if (!this.isPlayerBlocked) {
            if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
            else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
            if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
            else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);
        }

        const isMoving = this.player.body.velocity.length() > 0 && !this.isPlayerBlocked;
        if (isMoving && this.footstepsSound.isPaused) {
            this.footstepsSound.resume();
        } 
        else if (!isMoving && !this.footstepsSound.isPaused) {
            this.footstepsSound.pause();
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
                philosopher.nameLabel.setPosition(labelX, philosopher.y - 45);
            }
        });

        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
            if (distance < 100) {
                canInteractWith = philosopher;
                break;
            }
        }
        
        this.events.emit('interactionUpdate', canInteractWith);

        if (canInteractWith && Phaser.Input.Keyboard.JustDown(this.interactKey) && !this.isPlayerBlocked) {
            this.isPlayerBlocked = true; 
            this.events.emit('startDialog', canInteractWith.name);
        }
    }
}
