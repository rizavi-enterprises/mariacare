from flask import Flask, render_template, redirect, url_for, request, flash
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import db, User
import mysql.connector
import credentials


app = Flask(__name__)
db_config = credentials.dbconf
app.config['SECRET_KEY'] = '37THc0MDHugi7DMsHOxPEPShgD6RrjVFokIpHUwxQDq9gEcsr9u6i0CeKDf2iaba'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'danger')
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(username=username, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        flash('Account created successfully! Please log in.', 'success')
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/parents')
@login_required
def parents():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM parents')
    parents = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('parents.html', parents=parents)

@app.route('/add_parent', methods=['POST'])
def add_parent():
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    email = request.form['email']
    phone = request.form['phone']

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    query = '''
        INSERT INTO parents (first_name, last_name, email, phone)
        VALUES (%s, %s, %s, %s)
    '''
    cursor.execute(query, (first_name, last_name, email, phone))
    conn.commit()
    cursor.close()
    conn.close()

    return redirect(url_for('parents'))
    return render_template('parents.html')

@app.route('/children')
@login_required
def children():
    return render_template('children.html')

@app.route('/teachers')
@login_required
def teachers():
    return render_template('teachers.html')

@app.route('/classrooms')
@login_required
def classrooms():
    return render_template('classrooms.html')

@app.route('/tour_calendar')
@login_required
def tour_calendar():
    return render_template('tour_calendar.html')

@app.route('/first_contact_info')
@login_required
def first_contact_info():
    return render_template('first_contact_info.html')

@app.route('/enrollment_log')
@login_required
def enrollment_log():
    return render_template('enrollment_log.html')

@app.route('/invoicing')
@login_required
def invoicing():
    return render_template('invoicing.html')

@app.route('/daily_sheets')
@login_required
def daily_sheets():
    return render_template('daily_sheets.html')
    
@app.route('/incident_reports')
@login_required
def incident_reports():
    return render_template('incident_reports.html')

@app.route('/behavior_notes')
@login_required
def behavior_notes():
    return render_template('behavior_notes.html')

@app.route('/medication_log')
@login_required
def medication_log():
    return render_template('medication_log.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host=credentials.h, port=credentials.p)
