<h1 align="center">Anime Searching Website Backend</h1>

<div align="center">
  <h3>
    <a href="https://animepx.netlify.app/">
      Demo
    </a>
    <span> | </span>
    <a href="https://github.com/GiorgiVartanov/react-anime-frontend">
      Frontend Code
    </a>
    <span> | </span>
    <a href="https://github.com/GiorgiVartanov/react-anime-backend">
      Backend Code
    </a>
  </h3>
</div>

## Table of Contents

- [Routes](#routes)
- [Tools](#tools)
- [Deploy](#deploy)
- [Notices](#notices)

## Routes

### /api/auth

- <span style="color: yellow;">POST</span> /api/auth/login - logs in user
- <span style="color: yellow;">POST</span> /api/auth/register - registers user
- <span style="color: yellow;">POST</span> /api/auth/reset - changes user's credentials

### /api/anime

- <span style="color: green;">GET</span> /api/anime/genres - returns all genres
- <span style="color: green;">GET</span> /api/anime/random - returns random anime ID (random from top 500)

### /api/user

- <span style="color: green;">GET</span> /api/user/search - <span style="opacity: 0.5;"> searches user for passed query </span>
- <span style="color: green;">GET</span> /api/user/all - <span style="opacity: 0.5;"> returns all users </span>
- <span style="color: green;">GET</span> /api/user/:username - <span style="opacity: 0.5;"> returns information about one user </span>
- <span style="color: green;">GET</span> /api/user/:username/friends - <span style="opacity: 0.5;"> returns information about one user's friends </span>
- <span style="color: yellow;">POST</span> /api/user/add - <span style="opacity: 0.5;"> adds new friend </span>
- <span style="color: yellow;">POST</span> /api/user/remove - <span style="opacity: 0.5;"> removed friend </span>
- <span style="color: red;">DELETE</span> /api/user/delete/:id - <span style="opacity: 0.5;"> deletes user </span>
- <span style="color: pink;">PATCH</span> /api/user/promote/:id - <span style="opacity: 0.5;"> promotes user (changes status from user to admin) </span>
- <span style="color: pink;">PATCH</span> /api/user/demote/:id - <span style="opacity: 0.5;"> demotes user (changes status from admin to user) </span>
- <span style="color: yellow;">POST</span> /api/user/profilepicture - <span style="opacity: 0.5;"> changes user's profile picture </span>
- <span style="color: green;">GET</span> /api/user/profilepicture/:username - <span style="opacity: 0.5;"> returns profile picture of a user </span>

### /api/comments

- <span style="color: green;">GET</span> /api/comments/:animeId <span style="opacity: 0.5;"> returns comments for anime with passed ID </span>
- <span style="color: green;">GET</span> /api/comments/:animeId/logged <span style="opacity: 0.5;"> returns comments for anime with passed ID but for logged in user </span>
- <span style="color: yellow;">POST</span> /api/comments/ <span style="opacity: 0.5;"> posts new comment </span>
- <span style="color: red;">DELETE</span> /api/comments/delete/:id <span style="opacity: 0.5;"> deletes comment </span>
- <span style="color: yellow;">POST</span> /api/comments/vote <span style="opacity: 0.5;"> likes or disliked comment </span>

### /api/favorite

- <span style="color: green;">GET</span> /api/favorite/:username <span style="opacity: 0.5;"> returns user's favorite anime </span>
- <span style="color: yellow;">POST</span> /api/favorite/add/:animeId <span style="opacity: 0.5;"> adds anime to user's favorite anime list </span>
- <span style="color: red;">DELETE</span> /api/favorite/remove/:animeId <span style="opacity: 0.5;"> deletes anime from user's favorite anime list </span>

## Tools

- <a href="https://react.dev"> axios </a> <span style="opacity: 0.5;"> HTTP client </span>
- <a href="https://react.dev"> bcryptjs </a> <span style="opacity: 0.5;"> hashing passwords </span>
- <a href="https://react.dev"> cors </a> <span style="opacity: 0.5;"> CORS configuration </span>
- <a href="https://react.dev"> dotenv </a> <span style="opacity: 0.5;"> to access environment variables </span>
- <a href="https://react.dev"> express </a> <span style="opacity: 0.5;"> nodejs framework for handling HTTP requests </span>
- <a href="https://react.dev"> express-async-handler </a> <span style="opacity: 0.5;"> Middleware for express that simplifies error handling </span>
- <a href="https://react.dev"> jsonwebtoken </a> <span style="opacity: 0.5;"> library for generating JWT (JSON Web Token) </span>
- <a href="https://react.dev"> mongoose </a> <span style="opacity: 0.5;"> library for interacting with MongoDB </span>
- <a href="https://react.dev"> multer </a> <span style="opacity: 0.5;"> middleware for multipart/form-data </span>
- <a href="https://react.dev"> nodemon </a> <span style="opacity: 0.5;"> Utility library that automatically restarts server when changes are made </span> <span style="opacity: 0.25;"> DEV </span>

## Deploy

- <a href="https://www.netlify.com">Netlify</a> <span style="opacity: 0.5;"> Frontend </span>
- <a href="https://render.com">Render</a> <span style="opacity: 0.5;"> Backend </span>

## Notices

\* The initial request to the backend may take around 1-2 minutes due to the use of the free tier of <a href="https://render.com">Render</a> for hosting.
