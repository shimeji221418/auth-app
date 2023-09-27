from django.contrib import admin
from .models import UserAccount, Post


class UserAccountAdmin(admin.ModelAdmin):
    # 一覧表示画面のフィールド
    list_display = ("name", "email", "is_active", "is_staff")
    # フィールドをリンク化


admin.site.register(UserAccount, UserAccountAdmin)
admin.site.register(Post)
