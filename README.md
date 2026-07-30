#Fullstack_developer_capstone  — Full Stack Django + React Capstone

**Project Name:** Fullstack_developer_capstone
A full-stack car dealership review platform built with:
- **Backend:** Django (REST API, auth, admin)
- **Frontend:** React (embedded as static build inside Django, `server/frontend`)
- **Dealer/Review microservice:** Node.js + Express + MongoDB (`database/`)
- **Sentiment analysis microservice:** Flask (`djangosentiment/`)
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`)

## Repository layout

```
server/
  djangoproj/        Django project settings/urls
  djangoapp/          Django app: models, views, admin, urls, static/templates
  frontend/
    src/components/   React components (Register, Login, Dealers, Dealer, PostReview, Header)
    static/           About.html, Contact.html, index.html (built static assets)
database/              Node/Express/MongoDB microservice for dealers + reviews
djangosentiment/       Flask microservice for review sentiment analysis
.github/workflows/     CI/CD pipeline
```

## Quick start

See `INSTRUCTIONS.md` for the full step-by-step guide covering local setup, running each service, testing every API endpoint with cURL, and deployment.
