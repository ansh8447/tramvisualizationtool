import json
import random
import time
from datetime import datetime
# from random import sample
# from random import random
# from random import seed
from random import choice
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
# import dbmodule

from flask import Flask, Response, render_template, jsonify, request
from sqlalchemy.ext.automap import automap_base

# seed(1)

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
tram_BUSES_STATIC = Base.classes.tram_BUSES_STATIC
tram_LINE_LIVE = Base.classes.tram_LINE_LIVE
tram_BUSES_VOL_LIVE = Base.classes.tram_BUSES_VOL_LIVE
tram_CYBER_VUL = Base.classes.tram_CYBER_VUL
tram_TRANS_POWER = Base.classes.tram_TRANS_POWER

class TramTransPowerSchema(ma.Schema):
    class Meta:
        fields = ('branch_id', 'voltage_level', 'transferred_mva', 'mva_line_rating')

class TrambusesSchema(ma.Schema):
    class Meta:
        fields = ('bus_id', 'bus_name')

class TramBusesStaticSchema(ma.Schema):
    class Meta:
        fields = ('bus_id', 'base_kv', 'gis_latitude', 'gis_longitude', 'lower_limit', 'upper_limit', 'bus_status')

class TramLineLiveSchema(ma.Schema):
    class Meta:
        fields = ('from_bus_id', 'to_bus_id', 'branch_id', 'line_rating', 'active_powflow_from', 'active_powflow_to', 'reactive_powflow_from', 'reactive_powflow_to', 'line_status')

class TramLiveVoltage(ma.Schema):
    class Meta:
        fields = ('bus_id', 'bus_voltage')

class TramGetVoltage(ma.Schema):
    class Meta:
        fields = ('bus_id','bus_name','base_kv','lower_limit','upper_limit','bus_voltage')

class TramNodeConnections(ma.Schema):
    class Meta:
        fields = ('branch_id', 'gis_latitude', 'gis_longitude')

# class TempSchema(ma.Schema):
#     class Meta:
#         fields = ('bus_id', 'base_kv', 'gis_latitude', 'gis_longitude', 'lower_limit', 'upper_limit', 'bus_status', 'from_bus_id', 'to_bus_id', 'branch_id', 'line_rating', 'active_powflow_from', 'active_powflow_to', 'reactive_powflow_from', 'reactive_powflow_to', 'line_status')

class TramCyberVul(ma.Schema):
    class Meta:
        fields = ('cyber_cve_id','cyber_score','cyber_av','cyber_ac','cyber_au','cyber_c','cyber_i','cyber_a','cyber_device','cyber_substation')


tram_bus_static_schema = TramBusesStaticSchema()
tram_buses_static_schema = TramBusesStaticSchema(many=True)

tram_bus_schema = TrambusesSchema()
tram_buses_schema = TrambusesSchema(many=True)

tram_line_live_schema = TramLineLiveSchema()
tram_lines_live_schema = TramLineLiveSchema(many=True)

tram_live_voltage = TramLiveVoltage()
tram_live_voltages = TramLiveVoltage(many=True)

tram_get_voltages = TramGetVoltage(many=True)
tram_node_connections = TramNodeConnections(many=True)

tram_cyber_vul = TramCyberVul(many=True)
tram_trans_power = TramTransPowerSchema(many=True)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/map-data')
def map_data():
    print("In map-data")
    query_results = db.session.query(tram_BUSES_STATIC).all()
    print(query_results)
    query_results2 = db.session.query(tram_LINE_LIVE.branch_id, tram_BUSES_STATIC.gis_latitude, tram_BUSES_STATIC.gis_longitude).filter(tram_LINE_LIVE.to_bus_id == tram_BUSES_STATIC.bus_id)
    query_results3 = db.session.query(tram_LINE_LIVE.branch_id, tram_BUSES_STATIC.gis_latitude, tram_BUSES_STATIC.gis_longitude).filter(tram_LINE_LIVE.from_bus_id == tram_BUSES_STATIC.bus_id)
    
    # query_results2 = db.session.query(tram_LINE_LIVE, tram_BUSES_STATIC).join(tram_BUSES_STATIC, tram_BUSES_STATIC.bus_id == tram_LINE_LIVE.from_bus_id).all()
    nodes_result = tram_buses_static_schema.dump(query_results)
    connection_from = tram_node_connections.dump(query_results3)
    connection_to = tram_node_connections.dump(query_results2)
    
    return jsonify({'data': nodes_result, 'connectionfrom': connection_from, 'connectionto': connection_to})

@app.route('/chart-data')
def chart_data():
    
    # print("*********In chart-data***************")
    
    
    return jsonify({'results' : choice([0.38, 0.43, 0.55, 0.34, 0.55, 0.43]), 'time': datetime.now().strftime('%X')})



# Getting Tram Scores from the database
@app.route('/gettramscores', methods=['GET'])
def get_tram_scores():
    query_results = db.session.query(tram_BUSES).all()
    # for r in results:
    #     print(r.bus_name)
    result = tram_buses_schema.dump(query_results)
    # print(result[0])
    return jsonify({'data': result[0]})


@app.route('/physical/livevoltages')
def get_live_voltages():
    query_results = db.session.query(tram_BUSES.bus_id, tram_BUSES.bus_name, tram_BUSES_STATIC.base_kv, tram_BUSES_STATIC.lower_limit, tram_BUSES_STATIC.upper_limit, tram_BUSES_VOL_LIVE.bus_voltage).filter(tram_BUSES_VOL_LIVE.bus_id == tram_BUSES_STATIC.bus_id, tram_BUSES_VOL_LIVE.bus_id == tram_BUSES.bus_id)
    result = tram_get_voltages.dump(query_results)
    return jsonify({'data' : result})   

@app.route('/physical/transpower')
def get_trans_power():
    power_query = db.session.query(tram_TRANS_POWER).all()
    power_query_result = tram_trans_power.dump(power_query) 
    return jsonify({'data':power_query_result})


@app.route('/cyber/vulnerabilities')
def get_cyber_vul():
    query_results = db.session.query(tram_CYBER_VUL).all()
    result = tram_cyber_vul.dump(query_results)
    return jsonify({'data' : result})

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
