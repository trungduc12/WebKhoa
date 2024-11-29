from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from models import db, NguoiDung, ChiTietNguoiDung , ThongBao, TaiLieuKhoaHoc, BaiVietKhoaHoc
from sqlalchemy import text
from config import Config
from datetime import datetime
from sqlalchemy.orm import joinedload

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
                'email': user.email  # Lấy email từ bảng NguoiDung
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



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)