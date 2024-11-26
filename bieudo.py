import matplotlib.pyplot as plt

# Dữ liệu
days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
current_week = [80, 90, 120, 140, 100, 110, 95]
last_week = [70, 85, 100, 130, 120, 105, 90]

# Tạo biểu đồ
x = range(len(days))
width = 0.35

fig, ax = plt.subplots(figsize=(8, 5))
ax.bar(x, current_week, width, label='Tuần này', color='blue')
ax.bar([i + width for i in x], last_week, width, label='Tuần trước', color='red')

# Tùy chỉnh trục
ax.set_xlabel('Ngày trong tuần')
ax.set_ylabel('Tài chính (triệu VND)')
ax.set_xticks([i + width / 2 for i in x])
ax.set_xticklabels(days)
ax.legend()

# Lưu biểu đồ dưới dạng tệp hình ảnh
chart_path = 'D:/vscode/WebKhoa/img/finance_chart.png'
plt.savefig(chart_path, bbox_inches='tight')
plt.close()
