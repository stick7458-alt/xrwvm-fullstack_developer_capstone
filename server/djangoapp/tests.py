from django.test import TestCase
from django.contrib.auth.models import User
from .models import CarMake, CarModel


class CarModelTests(TestCase):
    def setUp(self):
        self.make = CarMake.objects.create(name="Toyota", description="Reliable cars")
        CarModel.objects.create(car_make=self.make, name="Camry", dealer_id=1, type="Sedan", year=2024)

    def test_car_model_str(self):
        car = CarModel.objects.first()
        self.assertIn("Toyota", str(car))

    def test_get_cars_endpoint(self):
        response = self.client.get("/djangoapp/get_cars")
        self.assertEqual(response.status_code, 200)
        self.assertIn("CarModels", response.json())


class AuthTests(TestCase):
    def test_registration_and_login(self):
        response = self.client.post(
            "/djangoapp/register",
            data={
                "userName": "testuser",
                "firstName": "Test",
                "lastName": "User",
                "email": "test@example.com",
                "password": "StrongPass123",
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "Authenticated")
        self.assertTrue(User.objects.filter(username="testuser").exists())
