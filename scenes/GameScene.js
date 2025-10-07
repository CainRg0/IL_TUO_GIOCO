class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isPlayerBlocked = false; // Controlla se il player è bloccato dal dialogo
    }

    create() {
        this.add.image(400, 300, 'game_bg').setDepth(-1);
        
        // --- Barriere del mondo fisico per Player e Filosofi ---
        const worldBoundsX = 170; 
        const worldBoundsY = 180; 
        const worldBoundsWidth = 630 - 170; 
        const worldBoundsHeight = 530 - 180; 

        this.physics.world.setBounds(worldBoundsX, worldBoundsY, worldBoundsWidth, worldBoundsHeight);

        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Player setup
        this.player = this.physics.add.sprite(400, 400, 'player'); 
        this.player.setScale(0.1);
        this.player.setCollideWorldBounds(true); // Il player collide con i world.bounds

        // Filosofi setup
        this.philosophers = this.physics.add.group({
            collideWorldBounds: true, // I filosofi collidono anche con i world.bounds
        });

        const philosopherData = [
            { key: 'platone', x: 250, y: 250, scale: 0.2 },
            { key: 'aristotele', x: 550, y: 250, scale: 0.2 },
            { key: 'diogene', x: 400, y: 280, scale: 0.2 },
            { key: 'socrate', x: 200, y: 450, scale: 0.2 },
            { key: 'pitagora', x: 600, y: 450, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale)
                .setName(data.key); // Assicurati che il nome sia impostato correttamente
            
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);

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
        
        // Collisioni tra player e filosofi, e tra filosofi
        this.physics.add.collider(this.player, this.philosophers);
        this.physics.add.collider(this.philosophers, this.philosophers); 
        
        // Controlli da tastiera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Musica di sottofondo
        if (!this.sound.get('bgm')) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        // Suoni passi
        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.3 });
        this.footstepsSound.play();
        this.footstepsSound.pause();

        // Evento per il movimento dei filosofi
        this.time.addEvent({
            delay: 3000,
            callback: this.movePhilosophers,
            callbackScope: this,
            loop: true
        });

        // Evento per la fine del dialogo, sblocca il player e riprende il movimento
        this.events.on('endDialog', () => {
            this.isPlayerBlocked = false; 
            this.philosophers.getChildren().forEach(p => p.setVelocity(0)); 
            this.movePhilosophers(); 
        });
    }

    movePhilosophers() {
        // I filosofi si muovono solo se il player non è in dialogo
        if (this.isPlayerBlocked) return; 

        const speed = 30;
        this.philosophers.getChildren().forEach(philosopher => {
            // Controlla se il filosofo corrente è quello con cui il player sta parlando
            // per evitare che si muova durante il dialogo.
            // Questo ora usa this.scene.get('UIScene').currentPhilosopher
            if (this.scene.isActive('UIScene') && this.scene.get('UIScene').currentPhilosopher === philosopher.name) {
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

        // Muovi il player solo se non è bloccato dal dialogo
        if (!this.isPlayerBlocked) { 
            if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
            else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
            if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
            else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);
        } else {
             this.player.setVelocity(0); // Ferma il player se bloccato dal dialogo
        }

        // Gestione suoni passi
        const isMoving = this.player.body.velocity.length() > 0 && !this.isPlayerBlocked;
        if (isMoving && this.footstepsSound.isPaused) {
            this.footstepsSound.resume();
        } 
        else if (!isMoving && !this.footstepsSound.isPaused) {
            this.footstepsSound.pause();
        }

        // Aggiorna posizione etichette nomi filosofi
        this.philosophers.getChildren().forEach(philosopher => {
            if (philosopher.nameLabel) {
                philosopher.nameLabel.setPosition(philosopher.x, philosopher.y - 45);
            }
        });

        // Logica di interazione con i filosofi
        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
            if (distance < 100) {
                canInteractWith = philosopher;
                break;
            }
        }
        
        this.events.emit('interactionUpdate', canInteractWith);

        // Avvia il dialogo se si preme 'E' e c'è un filosofo vicino
        if (canInteractWith && Phaser.Input.Keyboard.JustDown(this.interactKey) && !this.isPlayerBlocked) {
            this.isPlayerBlocked = true; // Blocca il player e i filosofi
            this.events.emit('startDialog', canInteractWith.name);
        }
    }
}
