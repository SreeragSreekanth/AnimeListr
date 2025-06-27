# 🎌 AnimeListr

**AnimeListr** is a full-stack Anime Catalog & Review Platform built with **React (Vite)**, **Django REST Framework**, and **Tailwind CSS**.  
Users can browse anime, write reviews, manage their watchlists, join community discussions, and get notified about activity — all powered by AniList API integration.

---

## 🚀 Features

### 👤 User & Authentication
- JWT-based Register, Login, Logout
- Profile View & Edit
- Role-based access (User/Admin)

### 📺 Anime Module
- Browse Anime List with Pagination, Search & Filter
- View Anime Details (title, genres, type, rating)
- Auto-import anime from AniList API  
  ➤ `https://graphql.anilist.co`

### ⭐ Reviews & Ratings
- Add, Edit, Delete Reviews for Anime
- Star Rating System
- View Average Rating per Anime

### 💬 Community Forum
- Create, Edit, Delete Forum Posts
- Comment on Posts
- Report Inappropriate Posts/Comments
- Admin moderation for posts, comments, and reports

### 📜 Watchlist
- Add Anime to Watchlist
- Categorize by: To Watch / Watching / Completed
- View Watchlist Page

### 🔔 Notifications
- Receive notifications for comments or reports on your posts
- View latest notifications

### 🛠️ Admin Panel
- Edit or Delete Anime
- Manage Forum Posts, Comments, and Reports

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router DOM
- Tailwind CSS

### Backend
- Django + Django REST Framework
- JWT Authentication
- PostgreSQL or SQLite
- AniList GraphQL API Integration

---

## ⚙️ Setup Instructions

### 🔹 Backend

```bash
cd backend
python -m venv env
source env/bin/activate   # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 AniList API Reference

Anime data is sourced from the [AniList GraphQL API](https://anilist.gitbook.io).

```js
const url = 'https://graphql.anilist.co';
```

---

## ✨ Author

Made with ❤️ by [Sreerag Sreekanth](https://github.com/SreeragSreekanth)

