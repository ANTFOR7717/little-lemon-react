# Little Lemon Restaurant API

A comprehensive Django REST API for the Little Lemon restaurant management system, providing endpoints for menu management, order processing, user authentication, and role-based access control.

## Features

### User Roles & Permissions
- **Admin**: Full system access, user management, menu management
- **Manager**: Menu management, order assignment, delivery crew management
- **Delivery Crew**: Access to assigned orders, order status updates
- **Customer**: Menu browsing, cart management, order placement

### Core Functionalities
1. User registration and authentication
2. Menu item and category management
3. Shopping cart functionality
4. Order processing and tracking
5. Role-based access control
6. Pagination and filtering
7. RESTful API design

## Technology Stack

- **Backend**: Django 4.2.23
- **API Framework**: Django REST Framework
- **Authentication**: Djoser + Token Authentication
- **Database**: SQLite
- **Environment Management**: Pipenv
- **CORS**: Django CORS Headers

## Installation & Setup

### Prerequisites
- Python 3.9+
- Pipenv

### Installation Steps

1. **Clone and navigate to project**
   ```bash
   cd LittleLemon
   ```

2. **Install dependencies**
   ```bash
   pipenv install
   ```

3. **Activate virtual environment**
   ```bash
   pipenv shell
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://127.0.0.1:8000/`

## API Endpoints

### Authentication Endpoints
- `POST /auth/users/` - User registration
- `POST /auth/token/login/` - User login (get token)
- `POST /auth/token/logout/` - User logout

### Menu Management
- `GET /api/categories` - List all categories
- `GET /api/menu-items` - List all menu items (with pagination, filtering, sorting)
- `GET /api/menu-items/{id}` - Get single menu item
- `POST /api/menu-items` - Create menu item (Admin/Manager only)
- `PUT/PATCH /api/menu-items/{id}` - Update menu item (Admin/Manager only)
- `DELETE /api/menu-items/{id}` - Delete menu item (Admin/Manager only)

### Cart Management
- `GET /api/cart/menu-items` - View cart items
- `POST /api/cart/menu-items` - Add item to cart
- `DELETE /api/cart/menu-items` - Clear cart

### Order Management
- `GET /api/orders` - List orders (role-based filtering)
- `POST /api/orders` - Place new order
- `GET /api/orders/{id}` - Get single order
- `PUT/PATCH /api/orders/{id}` - Update order (Manager/Delivery crew)
- `DELETE /api/orders/{id}` - Delete order (Manager only)

### User Group Management
- `GET /api/groups/manager/users` - List managers (Admin only)
- `POST /api/groups/manager/users` - Add user to managers (Admin only)
- `DELETE /api/groups/manager/users/{id}` - Remove manager (Admin only)
- `GET /api/groups/delivery-crew/users` - List delivery crew (Manager only)
- `POST /api/groups/delivery-crew/users` - Add to delivery crew (Manager only)
- `DELETE /api/groups/delivery-crew/users/{id}` - Remove from delivery crew (Manager only)

## API Usage Examples

### 1. User Registration
```bash
curl -X POST http://127.0.0.1:8000/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{"username": "customer1", "password": "password123", "email": "customer@example.com"}'
```

### 2. User Login
```bash
curl -X POST http://127.0.0.1:8000/auth/token/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "customer1", "password": "password123"}'
```

### 3. Browse Menu Items
```bash
curl -X GET http://127.0.0.1:8000/api/menu-items \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 4. Add Item to Cart
```bash
curl -X POST http://127.0.0.1:8000/api/cart/menu-items \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"menuitem_id": 1, "quantity": 2}'
```

### 5. Place Order
```bash
curl -X POST http://127.0.0.1:8000/api/orders \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 6. Add User to Manager Group (Admin only)
```bash
curl -X POST http://127.0.0.1:8000/api/groups/manager/users \
  -H "Authorization: Token ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"username": "manager1"}'
```

## Query Parameters

### Menu Items Filtering & Sorting
- `?category=1` - Filter by category ID
- `?ordering=price` - Sort by price (ascending)
- `?ordering=-price` - Sort by price (descending)
- `?search=pizza` - Search in title
- `?page=2` - Pagination
- `?perpage=5` - Items per page

## Authentication

The API uses Token-based authentication. Include the token in the Authorization header:
```
Authorization: Token YOUR_TOKEN_HERE
```

## Permission System

### Admin Users
- Full access to all endpoints
- Can manage users and assign roles
- Can create, update, delete menu items and categories

### Managers
- Can manage menu items and categories
- Can assign orders to delivery crew
- Can manage delivery crew members
- Can view all orders

### Delivery Crew
- Can view orders assigned to them
- Can update order status to delivered

### Customers
- Can browse menu items and categories
- Can manage their cart
- Can place and view their own orders

## Database Models

### Category
- `slug` (CharField) - Unique identifier
- `title` (CharField) - Category name

### MenuItem
- `title` (CharField) - Item name
- `price` (DecimalField) - Item price
- `featured` (BooleanField) - Featured status
- `category` (ForeignKey) - Category reference

### Cart
- `user` (ForeignKey) - User reference
- `menuitem` (ForeignKey) - Menu item reference
- `quantity` (SmallIntegerField) - Item quantity
- `unit_price` (DecimalField) - Price per unit
- `price` (DecimalField) - Total price

### Order
- `user` (ForeignKey) - Customer reference
- `delivery_crew` (ForeignKey) - Assigned delivery person
- `status` (BooleanField) - Delivery status
- `total` (DecimalField) - Order total
- `date` (DateField) - Order date

### OrderItem
- `order` (ForeignKey) - Order reference
- `menuitem` (ForeignKey) - Menu item reference
- `quantity` (SmallIntegerField) - Item quantity
- `unit_price` (DecimalField) - Price per unit
- `price` (DecimalField) - Total price

## Testing

You can test the API using:
- **Browser**: Navigate to `http://127.0.0.1:8000/api/`
- **Insomnia/Postman**: Import the endpoints
- **cURL**: Use the examples provided above
- **Django Admin**: Access at `http://127.0.0.1:8000/admin/`

## Project Structure

```
LittleLemon/
├── LittleLemon/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── LittleLemonAPI/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
├── manage.py
├── Pipfile
├── Pipfile.lock
└── README.md
```

## Development Notes

- The API follows RESTful conventions
- All endpoints require authentication except registration
- Proper HTTP status codes are returned
- Error handling is implemented throughout
- The database uses SQLite for development
- CORS is configured for frontend integration

## License

This project is created for educational purposes as part of the Meta Backend Developer Certificate program.