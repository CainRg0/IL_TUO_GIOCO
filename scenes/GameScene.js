class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isPlayerBlocked = false;
    }

    create() {
        this.add.image(400, 300, 'game_bg').setDepth(-1);
        
        // --- Imposta i limiti del mondo fisico per essere un po' più grandi del visibile,
        // in modo che i filosofi possano vagare "fuori" dal campo di gioco del player.
        // I 800x600 sono le dimensioni del tuo canvas.
        this.physics.world.setBounds(0, 0, 800, 600); 

        const walls = this.physics.add.staticGroup();

        // --- BARRIERE INVISIBILI: POSIZIONATE ESATTAMENTE SUI BORDI DELLA FOTO ---
        // Queste coordinate sono state calcolate per delimitare l'area del "pavimento" visibile
        // e impedire al player di andare dietro le colonne o sul marciapiede frontale.
        // I valori sono stati messi a punto per un'immagine standard 800x600.
        
        // Barriera SUPERIORE: Impedisce al player di andare troppo in alto (dietro la "parete" superiore).
        // Si estende per tutta la larghezza dell'area giocabile visibile.
        // Posizionata all'altezza dove il "pavimento" incontra la parete di fondo.
        walls.create(400, 190).setSize(600, 20).setVisible(false); // x, y, width, height
        
        // Barriera INFERIORE: Impedisce al player di andare sul "marciapiede" in primo piano.
        // Si estende per tutta la larghezza dell'area giocabile visibile.
        // Posizionata all'altezza dove il "pavimento" giocabile finisce e inizia il marciapiede.
        walls.create(400, 520).setSize(600, 20).setVisible(false); 
        
        // Barriera SINISTRA: Impedisce al player di andare dietro le colonne di sinistra.
        // Posizionata dove inizia la prima colonna visibile dal centro.
        walls.create(190, 350).setSize(20, 340).setVisible(false); // Aumentato l'altezza per coprire bene
        
        // Barriera DESTRA: Impedisce al player di andare dietro le colonne di destra.
        // Posizionata dove finisce l'ultima colonna visibile dal centro.
        walls.create(610, 350).setSize(20, 340).setVisible(false); // Aumentato l'altezza per coprire bene
        
        // NON CI SONO ALTRE BARRIERE INTERNE. TUTTO LO SPAZIO ALL'INTERNO È LIBERO PER IL PLAYER.
        // I filosofi NON collidono con queste barriere.

        // --- FINE BARRIERE AGGIORNATE ---

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(400, 480, 'player'); 
        // Il player NON ha setCollideWorldBounds(true) perché le nostre "walls" faranno il lavoro.
        this.player.setScale(0.1);
        
        // --- SOLO IL PLAYER COLLIDE CON LE BARRIERE ---
        this.physics.add.collider(this.player, walls);

        this.philosophers = this.physics.add.group(); // I filosofi NON sono limitati dal world bounds
        // La loro collisione con le walls è stata rimossa, ma collidono tra loro e col player.


        const philosopherData = [
            { key: 'platone', x: 250, y: 300, scale: 0.2 },
            { key: 'aristotele', x: 550, y: 300, scale: 0.2 },
            { key: 'diogene', x: 400, y: 330, scale: 0.2 },
            { key: 'socrate', x: 200, y: 400, scale: 0.2 },
            { key: 'pitagora', x: 600, y: 400, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale)
                .setName(data.key);
            
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);
            // --- I FILOSOFI NON COLLIDONO PIÙ CON LE BARRIERE ('walls') ---
            // Ho rimosso: this.physics.add.collider(philosopher, walls);
            // E non hanno nemmeno setCollideWorldBounds(true) in questo gruppo.
            // Possono andare dove vogliono.

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
        this.physics.add.collider(this.philosophers, this.philosophers); // I filosofi collidono ancora tra loro
        
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
            // I filosofi si muovono casualmente in un'area più ampia ora che non hanno collisione con walls.
            // Possiamo anche farli vagare un po' più lontano per simulare che vadano "dietro" le colonne.
            const randNumber = Phaser.Math.Between(0, 8); // Aumentate le opzioni per più movimento
            switch (randNumber) {
                case 0: philosopher.setVelocity(0, -speed); break; // Su
                case 1: philosopher.setVelocity(speed, 0); break;  // Destra
                case 2: philosopher.setVelocity(0, speed); break;  // Giù
                case 3: philosopher.setVelocity(-speed, 0); break; // Sinistra
                case 4: philosopher.setVelocity(speed * 0.7, -speed * 0.7); break; // Diagonale su-destra
                case 5: philosopher.setVelocity(speed * 0.7, speed * 0.7); break;  // Diagonale giù-destra
                case 6: philosopher.setVelocity(-speed * 0.7, speed * 0.7); break; // Diagonale giù-sinistra
                case 7: philosopher.setVelocity(-speed * 0.7, -speed * 0.7); break; // Diagonale su-sinistra
                default: philosopher.setVelocity(0, 0); break; // Stai fermo
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

        // Il posizionamento delle etichette dei nomi è un po' più complesso ora che i filosofi possono
        // andare fuori dai limiti visibili. Dovremo assicurarci che l'etichetta rimanga visibile
        // anche se il filosofo è "nascosto" dietro qualcosa.
        // Per semplicità, possiamo mantenere le etichette fisse sopra le coordinate del filosofo,
        // e se il filosofo scompare, anche l'etichetta "scomparirà" con lui (o sarà fuori schermo).
        // Se vuoi che le etichette siano sempre visibili e "agganciate" al bordo se il filosofo esce,
        // avremmo bisogno di una logica più complessa. Per ora, le lascio agganciate al filosofo.
        this.philosophers.getChildren().forEach(philosopher => {
            if (philosopher.nameLabel) {
                // Aggiorna la posizione dell'etichetta rispetto alla posizione del filosofo
                philosopher.nameLabel.setPosition(philosopher.x, philosopher.y - 45);
            }
        });


        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
            // L'interazione è sempre di 100px di distanza
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
