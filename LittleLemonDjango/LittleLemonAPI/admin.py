from django.contrib import admin
from .models import Category, MenuItem, Cart, Order, OrderItem

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['slug', 'title']
    search_fields = ['title']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'featured', 'category']
    list_filter = ['featured', 'category']
    search_fields = ['title']
    list_editable = ['price', 'featured']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'menuitem', 'quantity', 'unit_price', 'price']
    list_filter = ['user']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'delivery_crew', 'status', 'total', 'date']
    list_filter = ['status', 'date']
    list_editable = ['status', 'delivery_crew']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'menuitem', 'quantity', 'unit_price', 'price']
    list_filter = ['order']
