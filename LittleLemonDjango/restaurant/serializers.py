from rest_framework import serializers
from .models import Booking, Menu
from datetime import date


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
    
    def validate(self, data):
        reservation_date = data.get('reservation_date')
        reservation_slot = data.get('reservation_slot')
        
        # Check if booking already exists for this date and slot
        if Booking.objects.filter(
            reservation_date=reservation_date,
            reservation_slot=reservation_slot
        ).exists():
            raise serializers.ValidationError(
                "This time slot is already booked for the selected date."
            )
        
        # Check if reservation date is not in the past
        if reservation_date < date.today():
            raise serializers.ValidationError(
                "Cannot make reservations for past dates."
            )
        
        return data


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'