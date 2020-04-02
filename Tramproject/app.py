import json
import random
import time
from datetime import datetime
from random import choice
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
# import dbmodule

from flask import Flask, Response, render_template, jsonify, request
from sqlalchemy.ext.automap import automap_base

# Initializing the app
app = Flask(__name__)
random.seed()  # Initialize the random number generator

# Setup DB marshmallow vars
# db = dbmodule.setup(app)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Ansh@5024@localhost/tramdb'
SQLALCHEMY_TRACK_MODIFICATIONS = False
db = SQLAlchemy(app)
ma = Marshmallow(app)


Base = automap_base()
Base.prepare(db.engine, reflect=True)
tram_BUSES = Base.classes.tram_BUSES

# class AddSampleScores(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), unique=True)

#     def __init__(self, name):
#         self.name = name


class TrambusesSchema(ma.Schema):
    class Meta:
        fields = ('bus_id', 'bus_name')


tram_bus_schema = TrambusesSchema()
tram_buses_schema = TrambusesSchema(many=True)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/chart-data')
def chart_data():
    def generate_random_data():
        while True:
            json_data = json.dumps(
                {'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'value': choice([0.38, 0.43, 0.55, 0.34, 0.55, 0.43])})
            # yield f"data:{json_data}\n\n"
            time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')

# Getting Tram Scores from the database
@app.route('/gettramscores', methods=['GET'])
def get_tram_scores():
    query_results = db.session.query(tram_BUSES).all()
    # for r in results:
    #     print(r.bus_name)
    result = tram_buses_schema.dump(query_results)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
