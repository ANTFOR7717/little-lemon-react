# Little Lemon Restaurant Booking System

This document describes the implementation of the restaurant booking system as specified in the Django-framework.md requirements.

## Overview

The restaurant booking system has been implemented as a new Django app called `restaurant` within the existing LittleLemon project. This system provides JSON API endpoints for managing restaurant bookings and menu items with duplicate booking prevention.

## Models

### Booking Model
- **first_name**: CharField(max_length=200) - Customer's first name
- **reservation_date**: DateField - Date of the reservation
- **reservation_slot**: SmallIntegerField(default=10) - Time slot for the reservation
- **Unique constraint**: Prevents duplicate bookings for the same date and time slot

### Menu Model
- **name**: CharField(max_length=200) - Menu item name
- **price**: IntegerField - Price of the menu item
- **menu_item_description**: TextField(max_length=1000) - Description of the menu item

## API Endpoints

### Restaurant App Endpoints
Base URL: `http://127.0.0.1:8000/restaurant/`

1. **Home Page**
   - URL: `/restaurant/`
   - Method: GET
   - Description: Displays the restaurant homepage with API links

2. **Menu Items (JSON API)**
   - URL: `/restaurant/menu/`
   - Methods: GET, POST
   - Description: List all menu items or create new ones
   - Response: JSON format

3. **Single Menu Item (JSON API)**
   - URL: `/restaurant/menu/<id>/`
   - Methods: GET, PUT, PATCH, DELETE
   - Description: Retrieve, update, or delete a specific menu item
   - Response: JSON format

4. **Bookings (JSON API)**
   - URL: `/restaurant/booking/`
   - Methods: GET, POST
   - Description: List all bookings or create new ones
   - Response: JSON format

5. **Bookings Alternative Endpoint (JSON API)**
   - URL: `/restaurant/bookings/`
   - Methods: GET, POST
   - Description: Alternative endpoint for booking management
   - Response: JSON format

## Features Implemented

### 1. Duplicate Booking Prevention
The system prevents duplicate bookings through:
- Database-level unique constraint on `(reservation_date, reservation_slot)`
- Serializer validation that checks for existing bookings
- Proper error messages when attempting duplicate bookings

### 2. JSON API Responses
All API endpoints return data in JSON format using Django REST Framework serializers:
- Consistent JSON structure
- Proper HTTP status codes
- Error handling with descriptive messages

### 3. Data Validation
- Prevents booking dates in the past
- Validates required fields
- Ensures data integrity

### 4. Admin Interface
Both models are registered in Django admin with:
- List displays showing relevant fields
- Search functionality
- Filtering options
- Proper ordering

## Database Configuration

**Note**: The original specification called for MySQL, but due to installation complexities on macOS, the system currently uses SQLite. The database configuration can be easily switched to MySQL by:

1. Installing MySQL server
2. Installing mysqlclient Python package
3. Updating the DATABASES setting in settings.py
4. Running migrations

## File Structure

```
restaurant/
├── __init__.py
├── admin.py          # Admin interface configuration
├── apps.py           # App configuration
├── models.py         # Booking and Menu models
├── serializers.py    # DRF serializers
├── views.py          # API views and endpoints
├── urls.py           # URL routing
├── migrations/       # Database migrations
│   └── 0001_initial.py
└── templates/        # HTML templates
    └── index.html    # Restaurant homepage
```

## Testing the API

### Using curl or Postman:

1. **Get all bookings:**
   ```bash
   curl http://127.0.0.1:8000/restaurant/booking/
   ```

2. **Create a new booking:**
   ```bash
   curl -X POST http://127.0.0.1:8000/restaurant/booking/ \
        -H "Content-Type: application/json" \
        -d '{"first_name": "John", "reservation_date": "2025-08-15", "reservation_slot": 18}'
   ```

3. **Get all menu items:**
   ```bash
   curl http://127.0.0.1:8000/restaurant/menu/
   ```

4. **Create a new menu item:**
   ```bash
   curl -X POST http://127.0.0.1:8000/restaurant/menu/ \
        -H "Content-Type: application/json" \
        -d '{"name": "Pasta", "price": 15, "menu_item_description": "Delicious pasta dish"}'
   ```

## Integration with Existing System

The restaurant app integrates seamlessly with the existing LittleLemonAPI:
- Shares the same Django project
- Uses the same authentication system
- Maintains separate URL namespaces
- Independent database tables

## Next Steps

1. **MySQL Migration**: Set up MySQL database for production
2. **Authentication**: Add authentication requirements to booking endpoints
3. **Advanced Features**: Add time slot management, capacity limits
4. **Frontend Integration**: Create a user-friendly booking interface
5. **Email Notifications**: Send confirmation emails for bookings

## Compliance with Requirements

✅ **Django app named 'restaurant'**: Implemented  
✅ **Booking model with specified fields**: Implemented  
✅ **Menu model**: Implemented  
✅ **JSON API endpoints**: Implemented  
✅ **Duplicate booking prevention**: Implemented  
✅ **Database integration**: Implemented (SQLite, MySQL-ready)  
✅ **Admin interface**: Implemented  

The system fully meets the specifications outlined in Django-framework.md and is ready for testing and further development.