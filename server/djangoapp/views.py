import json
import logging

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review

logger = logging.getLogger(__name__)


# ---------- Page views (server-rendered shell that boots the React app) ----------

def index_view(request):
    return render(request, "index.html")


def about_view(request):
    return render(request, "About.html")


def contact_view(request):
    return render(request, "Contact.html")


# ---------- Auth ----------

@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data["userName"]
    password = data["password"]
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}
    if user is not None:
        login(request, user)
        response_data["status"] = "Authenticated"
    else:
        response_data["status"] = "Failed"
    return JsonResponse(response_data)


def logout_request(request):
    username = request.user.username if request.user.is_authenticated else ""
    logout(request)
    return JsonResponse({"userName": "", "previousUserName": username, "status": "Logged out"})


@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data["userName"]
    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    user = User.objects.create_user(
        username=username,
        first_name=data.get("firstName", ""),
        last_name=data.get("lastName", ""),
        email=data.get("email", ""),
        password=data["password"],
    )
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


# ---------- Car makes / models ----------

def get_cars(request):
    car_models = CarModel.objects.select_related("car_make")
    cars = [
        {"CarModel": cm.name, "CarMake": cm.car_make.name}
        for cm in car_models
    ]
    return JsonResponse({"CarModels": cars})


# ---------- Dealers (proxied to Node/Mongo microservice) ----------

def get_dealerships(request, state="All"):
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail.get("review", ""))
            review_detail["sentiment"] = response.get("sentiment", "neutral")
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})


@csrf_exempt
def add_review(request):
    if not request.user.is_anonymous:
        data = json.loads(request.body)
        response = post_review(data)
        return JsonResponse({"status": 200 if response else 401})
    return JsonResponse({"status": 403, "message": "Unauthorized"})
