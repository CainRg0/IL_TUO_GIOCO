class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#3d3d3d');
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);

        // --- MODIFICA 1: GRUPPO DINAMICO ---
        // Il gruppo ora non è più "static" per permettere il movimento.
        // Aggiungiamo anche delle proprietà di default per i figli del gruppo.
        this.philosophers = this.physics.add.group({
            collideWorldBounds: true, // Non escono dallo schermo
            bounceX: 1, // Rimbalzano leggermente quando si scontrano
            bounceY: 1
        });

        // Creiamo i filosofi e impostiamo le loro proprietà fisiche
        const philosopherData = [
            { key: 'platone', x: 150, y: 150 },
            { key: 'aristotele', x: 700, y: 500 },
            { key: 'diogene', x: 650, y: 150 },
            { key: 'socrate', x: 100, y: 500 },
            { key: 'pitagora', x: 400, y: 300 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(0.2)
                .setName(data.key);
            
            // Diamo una "massa" al corpo fisico per collisioni più realistiche
            philosopher.body.setCircle(philosopher.width / 2 * 0.8); // Hitbox circolare
            philosopher.setPushable(false); // Il giocatore non li può spingere
        });
        
        // --- MODIFICA 2: REGOLE DELLA FISICA ---
        // Aggiungiamo una collisione tra il giocatore e i filosofi
        this.physics.add.collider(this.player, this.philosophers);
        // Aggiungiamo una collisione tra i filosofi stessi per non farli sovrapporre
        this.physics.add.collider(this.philosophers, this.philosophers);

        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        if (!this.sound.get('bgm')) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.3 });
        this.footstepsSound.play();
        this.footstepsSound.pause();

        // --- MODIFICA 3: TIMER PER L'IA DEI MOVIMENTI ---
        // Creiamo un evento a tempo che si ripete ogni 3 secondi (3000 ms)
        // e che chiama la funzione per muovere i filosofi.
        this.time.addEvent({
            delay: 3000,
            callback: this.movePhilosophers,
            callbackScope: this,
            loop: true
        });
    }

    // --- NUOVA FUNZIONE PER L'IA DEI MOVIMENTI ---
    movePhilosophers() {
        // Se c'è un dialogo attivo, non muovere nessuno
        if (this.dialogActive) {
            return;
        }

        const speed = 30; // Una velocità bassa per farli "passeggiare"
        
        // Per ogni filosofo nel gruppo...
        this.philosophers.getChildren().forEach(philosopher => {
            const randNumber = Phaser.Math.Between(0, 5); // Scegli un numero casuale

            switch (randNumber) {
                case 0: // Va a Nord
                    philosopher.setVelocity(0, -speed);
                    break;
                case 1: // Va a Est
                    philosopher.setVelocity(speed, 0);
                    break;
                case 2: // Va a Sud
                    philosopher.setVelocity(0, speed);
                    break;
                case 3: // Va a Ovest
                    philosopher.setVelocity(-speed, 0);
                    break;
                default: // Rimane fermo
                    philosopher.setVelocity(0, 0);
                    break;
            }
        });
    }


    update() {
        if (this.dialogActive) {
            this.player.setVelocity(0);
            
            // --- MODIFICA 4: FERMIAMO I FILOSOFI QUANDO PARTE UN DIALOGO ---
            // Usiamo una funzione del gruppo per fermare tutti i suoi membri
            this.philosophers.setVelocity(0, 0);
            
            if (!this.footstepsSound.isPaused) {
                this.footstepsSound.pause();
            }
            return;
        }

        const playerSpeed = 200;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
        
        if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);

        const isMoving = this.player.body.velocity.length() > 0;

        if (isMoving && this.footstepsSound.isPaused) {
            this.footstepsSound.resume();
        } 
        else if (!isMoving && !this.footstepsSound.isPaused) {
            this.footstepsSound.pause();
        }

        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
            if (distance < 70) {
                canInteractWith = philosopher;
                break;
            }
        }
        
        this.events.emit('interactionUpdate', canInteractWith);

        if (canInteractWith && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.dialogActive = true;
            this.events.emit('startDialog', canInteractWith.name);
        }
    }
}
