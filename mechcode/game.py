from threading import Thread

class Game(Thread):
    def __init__(self, queue):
        super().__init__()
        self.queue = queue
        self.width = 500
        self.height = 500
        self.size = 25
        self.half_size = self.size / 2

        self.x_step = 5
        self.y_step = 10

        self.x = self.half_size
        self.y = self.half_size

    def run(self):
        while True:
            t = self.next_turn()
            self.queue.put(t)
            print(self.queue.qsize())

    def next_turn(self):
        self.x = self.x + self.x_step
        self.y = self.y + self.y_step

        if (self.x_step > 0 and self.x + self.half_size > self.width) or \
           (self.x_step < 0 and self.x - self.half_size < 0):
            self.x_step = self.x_step * -1

        if (self.y_step > 0 and self.y + self.half_size > self.height) or \
           (self.y_step < 0 and self.y - self.half_size < 0):
            self.y_step = self.y_step * -1

        return {
            'color': '#0000ff',
            'x': self.x,
            'y': self.y
        }