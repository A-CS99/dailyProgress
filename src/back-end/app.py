from flask import Flask, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:3a2b6c5d@localhost/DailyProgress?charset=utf8'
db = SQLAlchemy(app)

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(50))

    def __init__(self, user):
        self.user = user


class Schemes(db.Model):
    __tablename__ = 'schemes'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(50))
    title = db.Column(db.String(20))
    content = db.Column(db.String(50))
    time = db.Column(db.String(20))

    def __init__(self, user, title, content, time):
        self.user = user
        self.title = title
        self.content = content
        self.time = time

with app.app_context():
    db.create_all()

import json

# 通过methods设置GET请求
@app.route('/getSchemes', methods=["GET"])
def getSchemes_request():
    # 接收处理json数据请求
    user = request.args.get('user')

    # 从数据库中获取数据
    if user == '':
        return json.dumps([])
    userExist = Users.query.filter_by(user=user).first()
    if userExist is None:
        return json.dumps([])
    else:
        schemes = Schemes.query.filter_by(user=user).all()
        schemes = [{'title': scheme.title, 'content': scheme.content, 'time': scheme.time} for scheme in schemes]
        return json.dumps(schemes)

# 通过methods设置POST请求
@app.route('/setSchemes', methods=["GET", "POST"])
def setSchemes_request():
    if request.method == "POST":
        # 接收处理json数据请求
        data = request.get_data() # 获取json字符串
        data = json.loads(data) # 将json字符串转为dict
        user = data['user']
        scheme = data['scheme']
        userExist = Users.query.filter_by(user=user).first()

        if userExist == None:
            _user = Users(user=user)
            db.session.add(_user)
            _scheme = Schemes(user=user, title=scheme['title'], content=scheme['content'], time=scheme['time'])
            db.session.add(_scheme)
            db.session.commit()
        else:
            _scheme = Schemes(user=user, title=scheme['title'], content=scheme['content'], time=scheme['time'])
            db.session.add(_scheme)
            db.session.commit()
        return '', 204

# 通过methods设置login请求
@app.route('/onLogin', methods=['GET'])
def login():
    code = request.args.get('code')
    url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxcc69298f0834c2ed&secret=df964bcf38b485e3c6cd6e643b3f3ed1&js_code=%s&grant_type=authorization_code" % code
    res = redirect(url)
    return res

if __name__ == '__main__':
    app.run()
