from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class NguoiDung(db.Model):
    __tablename__ = 'NguoiDung'
    ma_nguoi_dung = db.Column(db.Integer, primary_key=True)
    ten_dang_nhap = db.Column(db.String(50), unique=True, nullable=False)
    mat_khau = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    vai_tro = db.Column(db.String(50), nullable=False)
    ngay_tao = db.Column(db.DateTime, default=db.func.current_timestamp())

    @staticmethod
    def get_all_users():
        return NguoiDung.query.all()

    @staticmethod
    def get_user_by_username_and_role(ten_dang_nhap, vai_tro):
        return NguoiDung.query.filter_by(ten_dang_nhap=ten_dang_nhap, vai_tro=vai_tro).first()

    def kiem_tra_mat_khau(self, mat_khau_nhap):
        return check_password_hash(self.mat_khau, mat_khau_nhap)
class ChiTietNguoiDung(db.Model):
    __tablename__ = 'chi_tiet_nguoi_dung'
    ma_ho_so = db.Column(db.Integer, primary_key=True)
    ma_nguoi_dung = db.Column(db.Integer, db.ForeignKey('nguoi_dung.ma_nguoi_dung'), nullable=False)
    ho_ten = db.Column(db.String(100))
    khoa = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    gioi_tinh = db.Column(db.String(10))
    mon_giang_day = db.Column(db.String(100))



class BaiVietKhoaHoc(db.Model):
    ma_bai_viet = db.Column(db.Integer, primary_key=True)
    tieu_de = db.Column(db.String(255), nullable=False)
    noi_dung = db.Column(db.Text, nullable=False)
    ma_tac_gia = db.Column(db.Integer, db.ForeignKey('nguoi_dung.ma_nguoi_dung'))
    ngay_dang = db.Column(db.DateTime, default=db.func.current_timestamp())
    trang_thai = db.Column(db.String(50), default='cho_duyet')

class ThongBao(db.Model):
    ma_thong_bao = db.Column(db.Integer, primary_key=True)
    tieu_de = db.Column(db.String(255), nullable=False)
    noi_dung = db.Column(db.Text, nullable=False)
    nguoi_tao = db.Column(db.Integer, db.ForeignKey('nguoi_dung.ma_nguoi_dung'))
    ngay_tao = db.Column(db.DateTime, default=db.func.current_timestamp())

class KhoaHoc(db.Model):
    ma_khoa_hoc = db.Column(db.Integer, primary_key=True)
    ten_khoa_hoc = db.Column(db.String(100), nullable=False)
    mo_ta = db.Column(db.Text)
    ma_giang_vien = db.Column(db.Integer, db.ForeignKey('nguoi_dung.ma_nguoi_dung'))
    ngay_tao = db.Column(db.DateTime, default=db.func.current_timestamp())

class TaiLieuKhoaHoc(db.Model):
    ma_tai_lieu = db.Column(db.Integer, primary_key=True)
    ma_khoa_hoc = db.Column(db.Integer, db.ForeignKey('khoa_hoc.ma_khoa_hoc'), nullable=False)
    tieu_de = db.Column(db.String(255), nullable=False)
    duong_dan_tai_lieu = db.Column(db.String(255))
    nguoi_tai = db.Column(db.Integer, db.ForeignKey('nguoi_dung.ma_nguoi_dung'))
    ngay_tai = db.Column(db.DateTime, default=db.func.current_timestamp())

class PhanHoi(db.Model):
    ma_phan_hoi = db.Column(db.Integer, primary_key=True)
    noi_dung = db.Column(db.Text, nullable=False)
    ma_nguoi_dung = db.Column(db.Integer, db.ForeignKey('nguoi_dung.ma_nguoi_dung'))
    loai_phan_hoi = db.Column(db.String(50))
    ma_tham_chieu = db.Column(db.Integer)
    ngay_phan_hoi = db.Column(db.DateTime, default=db.func.current_timestamp())

class VaiTro(db.Model):
    ma_vai_tro = db.Column(db.Integer, primary_key=True)
    ten_vai_tro = db.Column(db.String(50), nullable=False)
    mo_ta = db.Column(db.Text)

class VaiTroNguoiDung(db.Model):
    ma_nguoi_dung = db.Column(db.Integer, db.ForeignKey('nguoi_dung.ma_nguoi_dung'), primary_key=True)
    ma_vai_tro = db.Column(db.Integer, db.ForeignKey('vai_tro.ma_vai_tro'), primary_key=True)
    ngay_gan_vai_tro = db.Column(db.DateTime, default=db.func.current_timestamp())