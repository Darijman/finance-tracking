## Finance-Tracking is a modern app that helps you track your income, expenses, and overall financial balance.

Finance-Tracking is a simple application that allows you to organize your money. It is built using:

- Next.js
- NestJS
- Redis
- MySQL
- Antd (Ant Design)
- TypeScript
- Css

---

## 👾 Features

- Jump between dark-light modes.
- Track each **expense** or **income** by creating a Finance-Note.
- Add up to 10 **Custom-Categories**.
- Delete **Finance-Note** or **Custom-Category**.
- Edit **Finance-Note**, you can change everything.
- Receive analytics from all time or specific date.
- Explore graphs to see where you spend the most and which months are the most expensive.

---

## 📒 Process

### Finance Notes:
Core feature allowing users to add, update, delete, and fetch income or expense records.

### Finance Categories:
Users can create up to 10 custom categories to better organize their financial data.

### Currencies:
Users can set and update their preferred currency. All data is formatted accordingly. (Default: USD $).

### Fixtures:
Used to populate the database with initial or test data for faster development and testing.

### Multer:
Integrated for handling file uploads. Only for basic categories so far.

### Redis:
Used for performance optimization.

### Guards:
Implemented custom **AuthGuard** and **OwnerOrAdminGuard** to secure routes and enforce role-based access. Also added Guards for specific entities to avoid code duplication.

### Roles:
Admin/user roles are supported with specific permissions.

### Users:
Authenticated user management, including profile and currency preferences.

---

### NOTE: The project's purpose

- Gain deeper experience with MySQL and explore how Redis can improve API performance.
- Leverage Redis for efficient caching and data handling.
- Design a better user interface using a sidebar layout instead of a traditional header.
- Deepen understanding of JWT tokens and cookies for secure authentication.
- Implement robust route protection using decorators like @Admin(), @Public(), @UseGuards(), and more.
- Improve error handling to provide a smoother and more user-friendly UI experience.

---

## 💡 INSPIRATION

- I drew inspiration from the desktop version of Instagram, which is why my sidebar design looks quite similar to theirs.

---

## 🚦 Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repository to your local machine.
2. Create a MySQL database named finance-tracking using your MySQL client (e.g., MySQL Workbench).
3. cd frontend 
npm install    # or yarn 
npm run dev    # starts the frontend dev server
4. cd backend
npm install    # or yarn
npm run start:dev # starts the backend dev server
5. Open http://localhost:3000 (or the address shown in your console) in your web browser to view the app.

## 📹 Video



