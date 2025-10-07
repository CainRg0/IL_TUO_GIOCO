class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    create() {
        // --- CREAZIONE DELLA MAPPA ---
        const map = this.make.tilemap({ key: 'map' });
        // Il primo nome ('boh') deve corrispondere a quello nel file JSON, il secondo ('tiles') alla chiave usata nel Preloader.
        const tileset = map.addTilesetImage('boh', 'tiles'); 

        // Creiamo i "layer" (strati) della mappa, dal basso verso l'alto
        const pavimentoLayer = map.createLayer('pavimento', tileset, 0, 0);
        const varieLayer = map.createLayer('varie', tileset, 0, 0);
        const muriLayer = map.createLayer('muri', tileset, 0, 0);

        // --- FISICA E COLLISIONI DELLA MAPPA ---
        // Diciamo a Phaser che il layer "muri" è solido e ci si può scontrare
        muriLayer.setCollisionByProperty({ collides: true });

        // Creiamo il giocatore in una posizione di partenza adatta alla nuova mappa
        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setScale(0.1);
        this.player.setCollideWorldBounds(true); // Per sicurezza, non esce comunque dalla mappa totale
        this.physics.add.collider(this.player, muriLayer); // Il giocatore si scontra con i muri

        // --- FILOSOFI ---
        this.philosophers = this.physics.add.group({
            // Non usiamo più collideWorldBounds qui, perché i muri della mappa li conterranno
        });
        // Posizioni aggiornate per la nuova mappa
        const philosopherData = [
            { key: 'platone', x: 200, y: 150, scale: 0.2 },
            { key: 'aristotele', x: 600, y: 150, scale: 0.2 },
            { key: 'diogene', x: 400, y: 120, scale: 0.2 },
            { key: 'socrate', x: 150, y: 350, scale: 0.2 },
            { key: 'pitagora', x: 650, y: 350, scale: 0.15 }
        ];
        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key).setScale(data.scale).setName(data.key);
            philosopher.body.setCircle(philosopher.width / 2 * 0.8).setImmovable(true).setCollideWorldBounds(true);
            const name = data.key.charAt(0).toUpperCase() + data.key.slice(1);
            const label = this.add.text(philosopher.x, philosopher.y - 45, name, { fontSize: '14px', fill: '#ffffff', fontFamily: '"Cinzel", serif', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5);
            philosopher.nameLabel = label;
        });
        
        this.physics.add.collider(this.player, this.philosophers);
        this.physics.add.collider(this.philosophers, this.philosophers);
        this.physics.add.collider(this.philosophers, muriLayer); // Anche i filosofi si scontrano con i muri

        // --- IL RESTO DEL CODICE NON CAMBIA ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        if (!this.sound.get('bgm')) { this.sound.play('bgm', { loop: true, volume: 0.4 }); }
        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.3 });
        this.footstepsSound.play();
        this.footstepsSound.pause();
        this.time.addEvent({ delay: 3000, callback: this.movePhilosophers, callbackScope: this, loop: true });
    }

    movePhilosophers() {
        if (this.dialogActive) return;
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
        this.philosophers.getChildren().forEach(philosopher => {
            if (philosopher.nameLabel) {
                let labelX = philosopher.x;
                const labelWidth = philosopher.nameLabel.width / 2;
                if (labelX - labelWidth < 0) labelX = labelWidth;
                else if (labelX + labelWidth > this.physics.world.bounds.width) labelX = this.physics.world.bounds.width - labelWidth;
                philosopher.nameLabel.setPosition(labelX, philosopher.y - 45);
            }
        });
        if (this.dialogActive) { this.player.setVelocity(0); this.philosophers.setVelocity(0, 0); if (!this.footstepsSound.isPaused) this.footstepsSound.pause(); return; }
        const playerSpeed = 200;
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
        if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);
        const isMoving = this.player.body.velocity.length() > 0;
        if (isMoving && this.footstepsSound.isPaused) this.footstepsSound.resume();
        else if (!isMoving && !this.footstepsSound.isPaused) this.footstepsSound.pause();
        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y) < 100) {
                canInteractWith = philosopher;
                break;
            }
        }
        this.events.emit('interactionUpdate', canInteractWith);
        if (canInteractWith && Phaser.Input.Keyboard.JustDown(this.interactKey)) { this.dialogActive = true; this.events.emit('startDialog', canInteractWith.name); }
    }
}
