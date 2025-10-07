class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isPlayerBlocked = false; // Manteniamo la variabile di blocco dialogo
    }

    create() {
        this.add.image(400, 300, 'game_bg').setDepth(-1);
        
        // --- LA SOLUZIONE DEFINITIVA PER LE BARRIERE ---
        // Impostiamo i limiti del mondo fisico per coincidere con l'area calpestabile della tua foto.
        // Questi limiti bloccheranno sia il player che i filosofi.
        // Dallo screenshot, l'area calpestabile interna sembra iniziare circa a x=170 e finire a x=630.
        // L'area superiore sembra iniziare a y=180 e finire a y=530.
        const worldBoundsX = 170; // Inizio X dell'area giocabile
        const worldBoundsY = 180; // Inizio Y dell'area giocabile
        const worldBoundsWidth = 630 - 170; // Larghezza dell'area giocabile (630 è il limite destro)
        const worldBoundsHeight = 530 - 180; // Altezza dell'area giocabile (530 è il limite inferiore)

        this.physics.world.setBounds(worldBoundsX, worldBoundsY, worldBoundsWidth, worldBoundsHeight);

        // Rimuoviamo completamente la creazione di 'walls' statiche:
        // const walls = this.physics.add.staticGroup();
        // ... e tutti i walls.create(...)

        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Posizione iniziale del player leggermente più al centro dell'area giocabile
        this.player = this.physics.add.sprite(400, 400, 'player'); 
        this.player.setScale(0.1);
        
        // --- IL PLAYER ORA COLLIDE CON I world.bounds ---
        this.player.setCollideWorldBounds(true); 

        this.philosophers = this.physics.add.group({
            // --- ANCHE I FILOSOFI ORA COLLIDONO CON I world.bounds ---
            collideWorldBounds: true,
        });

        const philosopherData = [
            // Posizioni iniziali leggermente riadattate per stare all'interno dei nuovi bounds
            { key: 'platone', x: 250, y: 250, scale: 0.2 },
            { key: 'aristotele', x: 550, y: 250, scale: 0.2 },
            { key: 'diogene', x: 400, y: 280, scale: 0.2 },
            { key: 'socrate', x: 200, y: 450, scale: 0.2 },
            { key: 'pitagora', x: 600, y: 450, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale)
                .setName(data.key);
            
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);
            // Non c'è più bisogno di collisioni con 'walls' o altri gruppi statici.
            // La collisione con i world.bounds è già gestita dal gruppo.

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
        this.interactKey = this.input.keyboard.add.key(Phaser.Input.Keyboard.KeyCodes.E);

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

        // Evento per la fine del dialogo, per sbloccare il player e riprendere il movimento
        this.events.on('endDialog', () => {
            this.isPlayerBlocked = false; 
            this.philosophers.getChildren().forEach(p => p.setVelocity(0)); 
            this.movePhilosophers(); 
        });
    }

    movePhilosophers() {
        if (this.isPlayerBlocked) return; // Se il dialogo è attivo, i filosofi si fermano
        const speed = 30;
        this.philosophers.getChildren().forEach(philosopher => {
            // Se il filosofo è in dialogo, deve rimanere fermo
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

        if (!this.isPlayerBlocked) { // Muovi il player solo se non è bloccato dal dialogo
            if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
            else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
            if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
            else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);
        } else {
             this.player.setVelocity(0); // Ferma il player se bloccato dal dialogo
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
                // Le etichette dei nomi sono ora contenute nei world.bounds perché i filosofi lo sono.
                // Non c'è più bisogno di logica complessa per agganciare le etichette ai bordi.
                philosopher.nameLabel.setPosition(philosopher.x, philosopher.y - 45);
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
            this.isPlayerBlocked = true; // Blocca il player e i filosofi
            this.events.emit('startDialog', canInteractWith.name);
        }
    }
}
