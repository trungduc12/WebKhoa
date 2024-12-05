from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from models import db, NguoiDung, ChiTietNguoiDung , ThongBao, TaiLieuKhoaHoc, BaiVietKhoaHoc, KhoaHoc
from sqlalchemy import text
from config import Config
from datetime import datetime
from sqlalchemy.orm import joinedload
from werkzeug.security import generate_password_hash, check_password_hash

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
    ma_nguoi_dung = session.get('ma_nguoi_dung')
    if not ma_nguoi_dung:
        return redirect(url_for('login'))  # Redirect nếu chưa đăng nhập

    chi_tiet_nguoi_dung = ChiTietNguoiDung.query.filter_by(ma_nguoi_dung=ma_nguoi_dung).first()

    # Lấy tất cả thông báo (có thể tùy chỉnh theo điều kiện giảng viên)
    notifications = ThongBao.query.all()

    # Lấy danh sách tài liệu (có thể tùy chỉnh theo điều kiện giảng viên)
    danh_sach_tai_lieu = TaiLieuKhoaHoc.query.all()

    danhsachbaibao = BaiVietKhoaHoc.query.all()

    # Render dữ liệu vào template
    return render_template('admin.html', notifications=notifications, danh_sach_tai_lieu=danh_sach_tai_lieu, danhsachbaibao=danhsachbaibao, chi_tiet_nguoi_dung=chi_tiet_nguoi_dung)

@app.route('/giangvien')
def giangvien():
    ma_nguoi_dung = session.get('ma_nguoi_dung')
    if not ma_nguoi_dung:
        return redirect(url_for('login'))  # Redirect nếu chưa đăng nhập

    chi_tiet_nguoi_dung = ChiTietNguoiDung.query.filter_by(ma_nguoi_dung=ma_nguoi_dung).first()

    # Lấy tất cả thông báo (có thể tùy chỉnh theo điều kiện giảng viên)
    notifications = ThongBao.query.all()

    # Lấy danh sách tài liệu (có thể tùy chỉnh theo điều kiện giảng viên)
    danh_sach_tai_lieu = TaiLieuKhoaHoc.query.all()

    danhsachbaibao = BaiVietKhoaHoc.query.all()

    # Render dữ liệu vào template
    return render_template('giangvien.html', notifications=notifications, danh_sach_tai_lieu=danh_sach_tai_lieu, danhsachbaibao=danhsachbaibao, chi_tiet_nguoi_dung=chi_tiet_nguoi_dung)


@app.route('/sinhvien')
def sinhvien():
    ma_nguoi_dung = session.get('ma_nguoi_dung')
    if not ma_nguoi_dung:
        return redirect(url_for('login'))  # Redirect nếu chưa đăng nhập

    chi_tiet_nguoi_dung = ChiTietNguoiDung.query.filter_by(ma_nguoi_dung=ma_nguoi_dung).first()

    # Lấy tất cả thông báo
    notifications = ThongBao.query.all()

    # Lấy danh sách tài liệu
    danh_sach_tai_lieu = TaiLieuKhoaHoc.query.all()

    danhsachbaibao = BaiVietKhoaHoc.query.all()

    # Render dữ liệu vào template
    return render_template('sinhvien.html', notifications=notifications, danh_sach_tai_lieu=danh_sach_tai_lieu, danhsachbaibao=danhsachbaibao, chi_tiet_nguoi_dung=chi_tiet_nguoi_dung)

@app.route('/get_students', methods=['GET'])
def get_students():
    # Lấy tất cả người dùng có vai trò 'sinh_vien'
    sinh_vien = NguoiDung.query.filter_by(vai_tro='sinh_vien').all()

    # Lấy chi tiết người dùng từ bảng ChiTietNguoiDung
    students_info = []
    for user in sinh_vien:
        chi_tiet = ChiTietNguoiDung.query.filter_by(ma_nguoi_dung=user.ma_nguoi_dung).first()
        if chi_tiet:
            students_info.append({
                'ho_ten': chi_tiet.ho_ten,
                'khoa': chi_tiet.khoa,
                'linh_vuc_nghien_cuu': chi_tiet.linh_vuc_nghien_cuu,
                'nam_hoc': chi_tiet.nam_hoc,
                'email': user.email,  # Lấy email từ bảng NguoiDung
                'so_dien_thoai': chi_tiet.so_dien_thoai,  # New field
                'gioi_tinh': chi_tiet.gioi_tinh,  # New field
                'dia_chi': chi_tiet.dia_chi  # New field
            })

    return jsonify(students_info)

@app.route('/update_profile', methods=['POST'])
def update_profile():
    # Lấy dữ liệu gửi từ client
    data = request.get_json()
    ma_nguoi_dung = session.get('ma_nguoi_dung')
    
    if not ma_nguoi_dung:
        return jsonify({"success": False, "message": "Chưa đăng nhập"})
    
    # Tìm sinh viên trong cơ sở dữ liệu
    chi_tiet_nguoi_dung = ChiTietNguoiDung.query.filter_by(ma_nguoi_dung=ma_nguoi_dung).first()
    
    if chi_tiet_nguoi_dung:
        chi_tiet_nguoi_dung.tieu_su = data.get('tieu_su')
        chi_tiet_nguoi_dung.khoa = data.get('khoa')
        chi_tiet_nguoi_dung.linh_vuc_nghien_cuu = data.get('linh_vuc_nghien_cuu')
        chi_tiet_nguoi_dung.nam_hoc = data.get('nam_hoc')
        chi_tiet_nguoi_dung.so_dien_thoai = data.get('so_dien_thoai')  # New field
        chi_tiet_nguoi_dung.gioi_tinh = data.get('gioi_tinh')  # New field
        chi_tiet_nguoi_dung.dia_chi = data.get('dia_chi')  # New field
        
        try:
            # Cập nhật vào database
            db.session.commit()
            return jsonify({"success": True})
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "message": str(e)})
    else:
        return jsonify({"success": False, "message": "Không tìm thấy sinh viên"})


@app.route('/tao_thong_bao', methods=['POST'])
def tao_thong_bao():
    ma_nguoi_dung = session.get('ma_nguoi_dung')
    if not ma_nguoi_dung:
        return redirect(url_for('login'))  # Redirect nếu chưa đăng nhập

    tieu_de = request.form['tieu_de']
    noi_dung = request.form['noi_dung']
    nguoi_tao = ma_nguoi_dung  # Lấy mã người dùng từ session

    # Lấy thời gian hiện tại cho trường 'ngay_tao'
    ngay_tao = datetime.now()

    # Tạo một đối tượng ThongBao mới
    thong_bao = ThongBao(
        tieu_de=tieu_de,
        noi_dung=noi_dung,
        nguoi_tao=nguoi_tao,
        ngay_tao=ngay_tao  # Lưu ngày tạo
    )

    try:
        db.session.add(thong_bao)  # Thêm vào cơ sở dữ liệu
        db.session.commit()  # Lưu vào cơ sở dữ liệu
        return redirect(url_for('giangvien'))  # Redirect về trang giảng viên sau khi tạo thành công
    except Exception as e:
        db.session.rollback()  # Rollback nếu có lỗi
        return jsonify({"success": False, "message": str(e)})

@app.route('/get_courses', methods=['GET'])
def get_courses():
    courses = KhoaHoc.query.all()
    course_list = [{
        'ten_khoa_hoc': course.ten_khoa_hoc,
        'mo_ta': course.mo_ta
    } for course in courses]
    return jsonify(course_list)

# Route thêm khóa học mới
@app.route('/add_course', methods=['POST'])
def add_course():
    data = request.get_json()
    ten_khoa_hoc = data.get('ten_khoa_hoc')
    mo_ta = data.get('mo_ta')

    if not ten_khoa_hoc or not mo_ta:
        return jsonify({'success': False, 'message': 'Thiếu thông tin'}), 400

    new_course = KhoaHoc(ten_khoa_hoc=ten_khoa_hoc, mo_ta=mo_ta)
    db.session.add(new_course)
    db.session.commit()

    return jsonify({'success': True, 'ten_khoa_hoc': new_course.ten_khoa_hoc}), 201

    
@app.route('/update_thong_bao/<int:id>', methods=['POST'])
def update_thong_bao(id):
    data = request.get_json()
    notification = ThongBao.query.get(id)
    
    if notification:
        try:
            notification.tieu_de = data.get('tieu_de')
            notification.noi_dung = data.get('noi_dung')
            db.session.commit()
            return jsonify({"success": True, "message": "Notification updated successfully"})
        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            return jsonify({"success": False, "message": str(e)})
    return jsonify({"success": False, "message": "Notification not found"})



@app.route('/delete_thong_bao/<int:id>', methods=['DELETE'])
def delete_thong_bao(id):
    notification = ThongBao.query.get(id)
    
    if notification:
        try:
            db.session.delete(notification)  # Delete the notification
            db.session.commit()  # Commit the changes to the database
            return jsonify({"success": True, "message": "Notification deleted successfully"})
        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            return jsonify({"success": False, "message": str(e)})
    
    return jsonify({"success": False, "message": "Notification not found"})










@app.route('/test_db')
def test_db():
    try:
        # Thử lấy một số thông báo từ bảng ThongBao
        notifications = ThongBao.query.all()
        return jsonify([{
            'ma_thong_bao': n.ma_thong_bao,
            'tieu_de': n.tieu_de,
            'noi_dung': n.noi_dung,
            'nguoi_tao': n.nguoi_tao,
            'ngay_tao': n.ngay_tao
        } for n in notifications])
    except Exception as e:
        return str(e)

@app.route('/check_session')
def check_session():
    return {
        'ma_nguoi_dung': session.get('ma_nguoi_dung'),
        'vai_tro': session.get('vai_tro')
    }


@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    ten_dang_nhap = data.get('ten_dang_nhap')
    mat_khau = data.get('mat_khau')
    email = data.get('email')
    vai_tro = data.get('vai_tro')

    if not ten_dang_nhap or not mat_khau or not email or not vai_tro:
        return jsonify({'success': False, 'message': 'Thiếu thông tin!'}), 400

    if NguoiDung.query.filter_by(ten_dang_nhap=ten_dang_nhap).first():
        return jsonify({'success': False, 'message': 'Tên đăng nhập đã tồn tại!'}), 400

    hashed_password = generate_password_hash(mat_khau)

    new_user = NguoiDung(
        ten_dang_nhap=ten_dang_nhap,
        mat_khau=hashed_password,
        email=email,
        vai_tro=vai_tro
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/get_users', methods=['GET'])
def get_users():
    users = NguoiDung.query.all()
    user_list = []
    for user in users:
        user_list.append({
            'ma_nguoi_dung': user.ma_nguoi_dung,
            'ten_dang_nhap': user.ten_dang_nhap,
            'email': user.email,
            'vai_tro': user.vai_tro,
            'ngay_tao': user.ngay_tao.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(user_list)



@app.route('/add_article', methods=['POST'])
def add_article():
    data = request.get_json()
    tieu_de = data.get('tieu_de')
    noi_dung = data.get('noi_dung')

    if not tieu_de or not noi_dung:
        return jsonify({'success': False, 'message': 'Thiếu thông tin'}), 400

    new_article = BaiVietKhoaHoc(tieu_de=tieu_de, noi_dung=noi_dung)
    db.session.add(new_article)
    db.session.commit()

    return jsonify({
        'success': True,
        'ma_bai_viet': new_article.ma_bai_viet,
        'tieu_de': new_article.tieu_de,
        'noi_dung': new_article.noi_dung
    }), 201


@app.route('/delete_article/<int:ma_bai_viet>', methods=['DELETE'])
def delete_article(ma_bai_viet):
    article = BaiVietKhoaHoc.query.get(ma_bai_viet)
    if article:
        db.session.delete(article)
        db.session.commit()
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Bài báo không tồn tại'}), 404



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)