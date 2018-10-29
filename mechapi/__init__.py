import os
import queue

from flask import (Flask, render_template, jsonify)

from mechcode import game

def create_app(test_config=None):
    q = queue.Queue(2)
    g = game.Game(q)
    g.daemon = True
    g.start()

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py', silent=True)
    app.config['TEMPLATES_AUTO_RELOAD'] = True

    try:
        os.mkdir(app.instance_path)
    except OSError:
        pass

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/next_turn')
    def next_turn():
        try:
            turn = q.get_nowait()
            return jsonify(turn)
        except:
            return jsonify(error='no turn'), 400

    return app