# This Python file uses the following encoding: utf-8
import requests
from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import Integer, String, DateTime, ForeignKey, Column, func
from sqlalchemy import Time
 
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:3a2b6c5d@localhost/DailyProgress?charset=utf8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
 
class Name(db.Model):
    wid = db.Column(String(50), primary_key=True)
    name = db.Column(String(50), nullable=False)
 
    def to_dict(self):
        return {
            'wid': self.wid,
            'name': self.name
        }
 
class Task(db.Model):
    tid = db.Column(Integer, primary_key=True, autoincrement=True)
    wid = db.Column(String(50), ForeignKey('name.wid'), nullable=False)
    name = db.Column(String(50), nullable=False)
    start = db.Column(DateTime, nullable=False)
    end = db.Column(DateTime, nullable=False)
    desc = db.Column(String(400), nullable=False)
    status = db.Column(Integer, nullable=False)
 
    def to_dict(self):
        return {
            'tid': self.tid,
            'wid': self.wid,
            'name': self.name,
            'start': self.start.isoformat(),
            'end': self.end.isoformat(),
            'desc': self.desc,
            'status': self.status
        }
 
class Sleep(db.Model):
    wid = db.Column(db.String(50), primary_key=True)
    start = db.Column(db.String(5), nullable=False)
    end = db.Column(db.String(5), nullable=False)
    def to_dict(self):
        return {
            'wid': self.wid,
            'start': self.start,
            'end': self.end,
        }
 
class Buffer(db.Model):
    wid = db.Column(db.String(50), primary_key=True)
    buffer = db.Column(db.String(5), nullable=False)
    def to_dict(self):
        return {
            'wid': self.wid,
            'buffer': self.buffer
        }
 
@app.route('/test', methods=['GET'])
def test():
    return "Hello World!"
 
@app.route('/onLogin', methods=['GET'])
def login():
    code = request.args.get('code')
    url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxcc69298f0834c2ed&secret=df964bcf38b485e3c6cd6e643b3f3ed1&js_code=%s&grant_type=authorization_code" % code
    wid = requests.get(url).json().get('openid')
    return wid
 
# Name endpoints
@app.route('/name', methods=['POST'])
def create_name():
    data = request.get_json()
    existing_name = Name.query.filter_by(wid=data['wid']).first()
 
    if existing_name is not None:
        return jsonify({"attention": "A record with the provided wid already exists"}), 204
 
    new_name = Name(wid=data['wid'], name=data['name'])
    db.session.add(new_name)
    db.session.commit()
    return jsonify(new_name.to_dict()), 201
 
@app.route('/name', methods=['PATCH'])
def update_name():
    data = request.get_json()
    existing_name = Name.query.filter_by(wid=data['wid']).first()
 
    if existing_name is not None:
        existing_name.name = data['name']
        db.session.commit()
        return jsonify({'name': existing_name.name})
    else:
        return jsonify({'error': 'Wechat ID not found'}), 404
 
@app.route('/name', methods=['GET'])
def get_name():
    data = request.get_json()
    existing_name = Name.query.filter_by(wid=data['wid']).first()
 
    if existing_name is not None:
        return jsonify({'name': existing_name.name})
    else:
        return jsonify({'error': 'Wechat ID not found'}), 404
 
# Task endpoints
@app.route('/task', methods=['GET', 'POST'])
def create_task():
    if request.method == 'GET':
        data = request.args.get('wid')
        tasks = Task.query.filter_by(wid=data).all()
        if tasks:
            return jsonify([task.to_dict() for task in tasks])
        else:
            return jsonify([])
    if request.method == 'POST':
        data = request.get_json()
        
        start = datetime.fromisoformat(data['start'])
        end = datetime.fromisoformat(data['end'])
    
        new_task = Task(
            wid=data['wid'],
            name=data['name'],
            start=start,
            end=end,
            desc=data['desc'],
            status=0
        )
        db.session.add(new_task)
        db.session.commit()

        task = Task.query.filter_by(wid=data['wid']).order_by(Task.tid.desc()).first()
        tid = task.tid
        return jsonify({'tid': tid}), 201
 
@app.route('/task', methods=['PATCH'])
def update_task():
    data = request.get_json()
    task = Task.query.filter_by(tid=data['tid']).first()
 
    if task is not None:
        start = datetime.fromisoformat(data['start'])
        end = datetime.fromisoformat(data['end'])
 
        task.name = data['name']
        task.start = start
        task.end = end
        task.descn = data['desc']
        task.status = data['status']
 
        db.session.commit()
        return jsonify(task.to_dict())
    else:
        return jsonify({'error': 'Task ID not found'}), 404
 
@app.route('/task', methods=['DELETE'])
def delete_task():
    data = request.get_json()
    task = Task.query.filter_by(tid=data['tid']).first()
 
    if task is not None:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Delete succesfully'})
    else:
        return jsonify({'error': 'Task ID not found'}), 404
    
 
# Sleep endpoints
@app.route('/sleep', methods=['POST'])
def create_sleep():
    data = request.get_json()
    existing_sleep = Sleep.query.filter_by(wid=data['wid']).first()
 
    if existing_sleep is not None:
        start = data['start']
        end = data['end']
 
        existing_sleep.start = start
        existing_sleep.end = end
 
        db.session.commit()
        return jsonify({'wid': existing_sleep.wid, 'start': existing_sleep.start,'end': existing_sleep.end}), 204
 
    new_sleep = Sleep(
        wid=data['wid'], 
        start=data['start'], 
        end=data['end']
    )
    db.session.add(new_sleep)
    db.session.commit()
    return jsonify({'wid': new_sleep.wid, 'start': new_sleep.start,'end': new_sleep.end}),201

@app.route('/sleep', methods=['GET'])
def get_sleep():
    data = request.args.get('wid')
    existing_sleep = Sleep.query.get(data)
    if existing_sleep is not None:
        return jsonify({'wid': existing_sleep.wid, 'start': existing_sleep.start,'end': existing_sleep.end})
    else:
        return jsonify({'error': 'Wechat ID not found'}), 404
 
# Buffer endpoints
@app.route('/buffer', methods=['POST'])
def create_buffer():
    data = request.get_json()
    existing_buffer = Buffer.query.filter_by(wid=data['wid']).first()
 
    if existing_buffer is not None:
        existing_buffer.buffer = data['buffer']
        db.session.commit()
        return jsonify({'wid': existing_buffer.wid, 'buffer': existing_buffer.buffer}), 204
 
 
    new_buffer = Buffer(
        wid=data['wid'],
        buffer=data['buffer']
    )
    db.session.add(new_buffer)
    db.session.commit()
    return jsonify({'wid': new_buffer.wid, 'buffer': new_buffer.buffer}), 201
 
@app.route('/buffer', methods=['GET'])
def get_buffer():
    data = request.args.get('wid')
    buffer = Buffer.query.get(data)
    if not buffer:
        return jsonify({"error": "Buffer not found"}), 404
    return jsonify({'wid': buffer.wid, 'buffer': buffer.buffer}), 200
 

# 在运行应用之前创建所有数据表
@app.before_first_request
def create_tables():
    db.create_all()
 
if __name__ == '__main__':
    app.run(debug=True)