from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('menu/', views.MenuItemsView.as_view(), name='menu'),
    path('menu/<int:pk>/', views.SingleMenuItemView.as_view(), name='menu-item'),
    path('booking/', views.BookingViewSet.as_view(), name='booking'),
    path('bookings/', views.bookings, name='bookings'),
]