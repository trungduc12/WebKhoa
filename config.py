import os

class Config:
    SECRET_KEY = 'your_secret_key'  # Đặt SECRET_KEY của bạn ở đây
    SQLALCHEMY_DATABASE_URI = 'mssql+pyodbc://TẤNCHUNG\\SQLEXPRESS/webkhoa?trusted_connection=yes&driver=ODBC+Driver+17+for+SQL+Server'
    SQLALCHEMY_TRACK_MODIFICATIONS = False