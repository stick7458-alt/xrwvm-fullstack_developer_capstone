from django.db import models
from django.utils.timezone import now


class CarMake(models.Model):
    """Represents a car manufacturer, e.g. Toyota, Ford."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    SEDAN = "Sedan"
    SUV = "SUV"
    WAGON = "Wagon"
    COUPE = "Coupe"
    TRUCK = "Truck"
    CAR_TYPES = [
        (SEDAN, "Sedan"),
        (SUV, "SUV"),
        (WAGON, "Wagon"),
        (COUPE, "Coupe"),
        (TRUCK, "Truck"),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)
    dealer_id = models.IntegerField(help_text="Foreign key reference to a dealer in the Mongo microservice")
    type = models.CharField(max_length=10, choices=CAR_TYPES, default=SEDAN)
    year = models.IntegerField(default=2024)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
