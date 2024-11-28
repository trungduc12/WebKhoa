from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from models import db, NguoiDung, ChiTietNguoiDung 
from sqlalchemy import text
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = 'your_secret_key'  # Đảm bảo bạn có một secret key cho session
db.init_app(app)


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None

    if request.method == 'POST':
        ten_dang_nhap = request.form['ten_dang_nhap']
        mat_khau = request.form['mat_khau']
        vai_tro = request.form['vai_tro']
        user = NguoiDung.query.filter_by(ten_dang_nhap=ten_dang_nhap, vai_tro=vai_tro).first()
        if user and user.mat_khau == mat_khau:
            session['ma_nguoi_dung'] = user.ma_nguoi_dung
            session['vai_tro'] = user.vai_tro
            # Phân quyền dựa trên vai trò
            if user.vai_tro == 'quan_tri':
                return redirect(url_for('admin'))
            elif user.vai_tro == 'giang_vien':
                return redirect(url_for('giangvien'))
            elif user.vai_tro == 'sinh_vien':
                return redirect(url_for('sinhvien'))
            else:
                error = 'Thông tin đăng nhập không hợp lệ'
        else:
            error = 'Tên đăng nhập hoặc mật khẩu không đúng'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('ma_nguoi_dung', None)
    session.pop('vai_tro', None)
    return redirect(url_for('home'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/giangvien')
def giangvien():
    return render_template('giangvien.html')

@app.route('/sinhvien')
def sinhvien():
    return render_template('sinhvien.html')

@app.route('/test_db')
def test_db():
    try:
        with db.engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return "Kết nối thành công!" if result.scalar() == 1 else "Kết nối thất bại!"
    except Exception as e:
        return f"Kết nối thất bại: {e}"

@app.route('/check_session')
def check_session():
    return {
        'ma_nguoi_dung': session.get('ma_nguoi_dung'),
        'vai_tro': session.get('vai_tro')
    }


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)