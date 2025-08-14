from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from .models import Category, MenuItem, Cart, Order, OrderItem
from .serializers import (
    CategorySerializer, MenuItemSerializer, CartSerializer, CartAddSerializer,
    OrderSerializer, OrderInsertSerializer, UserSerilializer
)
from decimal import Decimal
from django.core.paginator import Paginator, EmptyPage


class CategoriesView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class MenuItemsView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    ordering_fields = ['price', 'title']
    filterset_fields = ['category', 'featured']
    search_fields = ['title']
    
    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class SingleMenuItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    
    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def cart_menu_items(request):
    if request.method == 'GET':
        cart = Cart.objects.filter(user=request.user)
        serialized_item = CartSerializer(cart, many=True)
        return Response(serialized_item.data)
    
    if request.method == 'POST':
        serialized_item = CartAddSerializer(data=request.data, context={'request': request})
        serialized_item.is_valid(raise_exception=True)
        serialized_item.save()
        return Response({'message': 'Item added to cart'}, status.HTTP_201_CREATED)
    
    if request.method == 'DELETE':
        Cart.objects.filter(user=request.user).delete()
        return Response({'message': 'All items removed from cart'}, status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def orders(request):
    if request.method == 'GET':
        if request.user.groups.filter(name='Manager').exists():
            orders = Order.objects.all()
        elif request.user.groups.filter(name='Delivery crew').exists():
            orders = Order.objects.filter(delivery_crew=request.user)
        else:
            orders = Order.objects.filter(user=request.user)
        
        serialized_item = OrderSerializer(orders, many=True)
        return Response(serialized_item.data)
    
    if request.method == 'POST':
        cart = Cart.objects.filter(user=request.user)
        if cart.count() == 0:
            return Response({'message': 'No item in cart'}, status.HTTP_400_BAD_REQUEST)
        
        total = sum([item.price for item in cart])
        order = Order.objects.create(user=request.user, status=False, total=total)
        
        for cart_item in cart:
            OrderItem.objects.create(
                order=order,
                menuitem=cart_item.menuitem,
                price=cart_item.price,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
            )
        
        cart.delete()
        result = OrderSerializer(order).data.copy()
        result['total'] = total
        result['status'] = 'Order placed! Your order will be delivered soon'
        return Response(result)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def single_order(request, pk):
    order = get_object_or_404(Order, pk=pk)
    
    if request.method == 'GET':
        if request.user == order.user or request.user.groups.filter(name='Manager').exists() or request.user == order.delivery_crew:
            serialized_item = OrderSerializer(order)
            return Response(serialized_item.data)
        else:
            return Response({'message': 'You are not authorized to view this order'}, status.HTTP_403_FORBIDDEN)
    
    if request.method == 'PUT':
        if request.user.groups.filter(name='Manager').exists():
            serialized_item = OrderSerializer(order, data=request.data, partial=True)
            serialized_item.is_valid(raise_exception=True)
            serialized_item.save()
            return Response(serialized_item.data)
        elif request.user.groups.filter(name='Delivery crew').exists():
            order.status = request.data['status']
            order.save()
            return Response({'message': 'Status updated'})
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)
    
    if request.method == 'DELETE':
        if request.user.groups.filter(name='Manager').exists():
            order.delete()
            return Response({'message': 'Order deleted'}, status.HTTP_200_OK)
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def managers(request):
    if request.method == 'GET':
        if request.user.groups.filter(name='Manager').exists() or request.user.is_superuser:
            managers = User.objects.filter(groups__name='Manager')
            serialized_item = UserSerilializer(managers, many=True)
            return Response(serialized_item.data)
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)
    
    if request.method == 'POST':
        if request.user.is_superuser:
            username = request.data['username']
            if username:
                user = get_object_or_404(User, username=username)
                managers = Group.objects.get(name="Manager")
                managers.user_set.add(user)
                return Response({'message': 'User added to Manager group'}, status.HTTP_201_CREATED)
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)
    
    if request.method == 'DELETE':
        if request.user.is_superuser:
            username = request.data['username']
            if username:
                user = get_object_or_404(User, username=username)
                managers = Group.objects.get(name="Manager")
                managers.user_set.remove(user)
                return Response({'message': 'User removed from Manager group'}, status.HTTP_200_OK)
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def delivery_crew(request):
    if request.method == 'GET':
        if request.user.groups.filter(name='Manager').exists():
            delivery_crew = User.objects.filter(groups__name='Delivery crew')
            serialized_item = UserSerilializer(delivery_crew, many=True)
            return Response(serialized_item.data)
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)
    
    if request.method == 'POST':
        if request.user.groups.filter(name='Manager').exists():
            username = request.data['username']
            if username:
                user = get_object_or_404(User, username=username)
                delivery_crew_group = Group.objects.get(name="Delivery crew")
                delivery_crew_group.user_set.add(user)
                return Response({'message': 'User added to Delivery crew group'}, status.HTTP_201_CREATED)
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)
    
    if request.method == 'DELETE':
        if request.user.groups.filter(name='Manager').exists():
            username = request.data['username']
            if username:
                user = get_object_or_404(User, username=username)
                delivery_crew_group = Group.objects.get(name="Delivery crew")
                delivery_crew_group.user_set.remove(user)
                return Response({'message': 'User removed from Delivery crew group'}, status.HTTP_200_OK)
        else:
            return Response({'message': 'You are not authorized'}, status.HTTP_403_FORBIDDEN)
