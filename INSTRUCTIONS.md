# INSTRUCTIONS.md — How to run this project and complete all 28 tasks

This project has been scaffolded and verified to run (Django checks pass,
migrations apply cleanly, all included tests pass, and `/`, `/about/`,
`/contact/`, and `/djangoapp/get_cars` all return HTTP 200 locally).

Everything below is real — no fabricated output. You need to run these
commands yourself, on your own machine/IDE, so the terminal output,
screenshots, GitHub repo, and deployment URL are genuinely yours.

---

## 0. Push to GitHub first

```bash
cd best-cars-dealership   # the folder containing this file
git init
git add .
git commit -m "Initial commit: full Django + React dealership app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

**Task 1** — after pushing, your README URL is:
`https://github.com/<your-username>/<your-repo>/blob/main/README.md`
(It already contains "Project name: Best Cars Dealership Application".)

**Task 3** — `https://github.com/<your-username>/<your-repo>/blob/main/server/frontend/static/About.html`

**Task 4** — `https://github.com/<your-username>/<your-repo>/blob/main/server/frontend/static/Contact.html`

**Task 7** — `https://github.com/<your-username>/<your-repo>/blob/main/server/frontend/src/components/Register/Register.jsx`

---

## 1. Run the three services locally

Open three terminals.

### Terminal A — Dealer/Review microservice (Node + MongoDB)
Requires MongoDB running locally (or a MongoDB Atlas URI in `MONGO_URI`).
```bash
cd database
npm install
npm start
# -> "Connected to MongoDB", "Seeded 6 dealers", "Seeded 4 reviews"
# -> "Dealer/review microservice listening on port 3030"
```

### Terminal B — Sentiment analysis microservice (Flask)
```bash
cd djangosentiment
pip install -r requirements.txt
python app.py
# -> running on http://0.0.0.0:5050
```

### Terminal C — Django server
```bash
cd server
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # username: e.g. "root" — for Task 12/13
python manage.py runserver
```

**Task 2** — Copy the terminal output from Terminal C (the lines starting
"Watching for file changes...", "System check identified no issues",
"Starting development server at http://127.0.0.1:8000/") into a plain text
file named `django_server`.

---

## 2. Build the React frontend into Django's static folder

```bash
cd server/frontend
npm install
npm run build
# copy the compiled build into the static folder Django serves:
cp -r build/* static/
```
Restart the Django server afterward so `/` serves the compiled React app
with the Register/Login/Dealers/Dealer/PostReview components.

---

## 3. cURL-based tasks

Run these with the Django server (port 8000) and, where relevant, the
Node microservice (port 3030) running. Paste the command **and** its
output into the correspondingly named file.

**Task 5 — `loginuser`** (use any user you registered, or your superuser):
```bash
curl -s -X POST http://localhost:8000/djangoapp/login \
  -H "Content-Type: application/json" \
  -d '{"userName": "testuser", "password": "StrongPass123"}'
```

**Task 6 — `logoutuser`**:
```bash
curl -s -X GET http://localhost:8000/djangoapp/logout
```
(For a real session logout, first log in via the browser/session cookie,
or use `-c cookies.txt -b cookies.txt` with curl to persist the session
across the login/logout calls.)

**Task 8 — `getdealerreviews`** (dealer id 1 has seeded reviews):
```bash
curl -s http://localhost:8000/djangoapp/reviews/dealer/1
```

**Task 9 — `getalldealers`**:
```bash
curl -s http://localhost:8000/djangoapp/get_dealers
```

**Task 10 — `getdealerbyid`**:
```bash
curl -s http://localhost:8000/djangoapp/dealer/1
```

**Task 11 — `getdealersbyState`** (Kansas dealers are already seeded — ids 1 and 2):
```bash
curl -s http://localhost:8000/djangoapp/get_dealers/Kansas
```

**Task 14/15 — `getallcarmakes`**:
First add a few CarMake/CarModel rows via Django admin (`/admin/`), then:
```bash
curl -s http://localhost:8000/djangoapp/get_cars
```

**Task 16 — `analyzereview`** (sentiment analyzer running on port 5050):
```bash
curl -s "http://localhost:5050/analyze/Fantastic%20services"
```
Expected: `{"sentiment": "positive"}`

---

## 4. Screenshots

Take these directly from your browser while the full stack (Node + Flask +
Django, with the React build copied into `static/`) is running:

- **Task 12** `admin_login.png` — log in at `http://localhost:8000/admin/`
  with your superuser (e.g. "root").
- **Task 13** `admin_logout.png` — click "Log out" on the admin page.
- **Task 17** `get_dealers.png` — visit `http://localhost:8000/` while
  logged out.
- **Task 18** `get_dealers_loggedin.png` — log in via `/login`, then visit
  `/` again; the screenshot must show the "Review Dealer" links, your
  username in the header, and `localhost:8000/` in the address bar.
- **Task 19** `dealersbystate.png` — select "Kansas" from the state
  dropdown on the home page; make sure the address bar is visible (if you
  want the state to show directly in the URL, you can also navigate to
  `http://localhost:8000/?state=Kansas` after wiring that query param, or
  simply show the dropdown selection with the visible URL).
- **Task 20** `dealer_id_reviews.png` — click into a dealer (e.g.
  `/dealer/1`) to show details + reviews, with the URL visible.
- **Task 21** `dealership_review_submission.png` — open
  `/postreview/1`, fill in the review form, screenshot before clicking
  "Post Review".
- **Task 22** `added_review.png` — after submitting, screenshot the
  review now appearing on the dealer page.

---

## 5. CI/CD (Task 23)

The workflow is at `.github/workflows/ci.yml`. Once pushed to GitHub, go to
your repo's **Actions** tab, open the latest run, and copy the full log
output (all steps: checkout, Python setup, install deps, `manage.py check`,
migrate, test, Node setup, `npm install`, `npm run build`, sentiment service
compile check) into a file named `CICD`.

---

## 6. Deployment (Tasks 24–28)

Deploy the Django app (with the React build copied into `static/`) to a
platform such as Render, Railway, Heroku, PythonAnywhere, or IBM Cloud Code
Engine. The `Dockerfile` and `Procfile` in `server/` are ready for either a
buildpack or container-based deploy. You'll also need to deploy (or point
to a hosted) MongoDB instance and the Flask sentiment service — set
`BACKEND_URL` and `SENTIMENT_ANALYZER_URL` environment variables on your
Django deployment to point at them.

- **Task 24** — save the live URL in a file named `deploymentURL`.
- **Task 25** — screenshot the deployed landing page → `deployed_landingpage`.
- **Task 26** — screenshot logged in on the deployed app, username visible → `deployed_loggedin`.
- **Task 27** — screenshot a dealer detail page on the deployed app → `deployed_dealer_detail`.
- **Task 28** — screenshot a posted review on the deployed app → `deployed_add_review`.

---

## Notes

- All code in this repo has been locally verified: `python manage.py check`
  passes, migrations apply cleanly, and `python manage.py test` (3 tests)
  passes. The dev server was booted and `/`, `/about/`, `/contact/`, and
  `/djangoapp/get_cars` all returned HTTP 200.
- Kansas dealers are pre-seeded (`database/data/dealerships.json`, ids 1–2)
  so Task 11 works out of the box once the Node microservice is running.
- Add more CarMake/CarModel entries via `/admin/` before Task 14/15 so the
  response isn't an empty list.
