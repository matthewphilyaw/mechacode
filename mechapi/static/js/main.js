class Main {
    constructor(canvas, button, slider) {
        this.lastBtnClick = new Date().getTime();
        this.button = button;
        this.button.onclick = () => this.btnClick();
        this.button.innerHTML = 'Start';

        this.slider = slider;

        this.skip = this.slider.value;
        this.sinceLastSkip = this.skip;
        this.slider.oninput = (e) => {
            this.skip = e.target.value;
        }

        this.canvas = canvas;
        this.canvas.height = 500;
        this.canvas.width = 500;
        this.ctx = canvas.getContext('2d');
        this.height = canvas.height;
        this.width = canvas.width;
        this.clear();

        this.run = false;
        this.turns = [];


    }

    update() {
        window.requestAnimationFrame((timestamp) => {
            if (this.sinceLastSkip < this.skip) {
                this.sinceLastSkip++;
                this.update();
                return;
            }

            this.sinceLastSkip = 0;

            this.clear();
            if (!this.run) {
                return;
            }

            // hold on to 
            const nextTurn = this.turns.shift();
            if (nextTurn) {
                this.currentTurn = nextTurn;
                this.drawbox(this.currentTurn);
            }
            else if (!nextTurn && !this.currentTurn) {
                console.log("skipping turn, nothing to render");
            }
            else {
                console.log("replaying last turn, no new turns to view");
                this.drawbox(this.currentTurn);
            }

            this.fetchTurns();
            this.update()
        });
    }


    fetchTurns() {
        axios({
            url: 'http://localhost:5000/next_turn'
        }).then(resp => {
            console.log(resp.data);
            this.turns.push(resp.data)
        });
    }

    btnClick() {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastBtnClick < 250) {
            console.log("button clicked to fast");
            return;
        }

        this.run = !this.run;
        if (this.run) {
            this.buffer();
        }
        else {
            this.button.innerHTML = 'Start';
        }
    }

    buffer() {
        const oldFStyle = this.ctx.fillStyle;
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '48px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading...', this.width / 2, this.height / 2);
        this.ctx.fillStyle = oldFStyle;
        
        window.setTimeout(() => {
            this.clear();
            this.button.innerHTML = 'Stop';
            this.update();
        }, 2000);
    }

    clear() {
        // Clear screen
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawbox(turn) {
        const size = 25;
        const halfSize = size / 2;

        const color = turn.color;
        const x = turn.x;
        // offset y by 25 to account for bar at top
        const y = turn.y;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - halfSize, y - halfSize, size, size);
    }
}