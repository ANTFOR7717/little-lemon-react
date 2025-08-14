from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories', views.CategoriesView.as_view()),
    
    # Menu items
    path('menu-items', views.MenuItemsView.as_view()),
    path('menu-items/<int:pk>', views.SingleMenuItemView.as_view()),
    
    # Cart management
    path('cart/menu-items', views.cart_menu_items),
    
    # Order management
    path('orders', views.orders),
    path('orders/<int:pk>', views.single_order),
    
    # User group management
    path('groups/manager/users', views.managers),
    path('groups/delivery-crew/users', views.delivery_crew),
]