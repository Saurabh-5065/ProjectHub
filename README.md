# ProjectHub

ProjectHub is a high-performance, full-stack project management platform designed to streamline team collaboration. It provides a centralized dashboard for planning, tracking, and managing projects with real-time updates and robust role-based access control.

---

##  Key Features

* **Centralized Dashboard:** A comprehensive overview of project statistics, recent activities, and progress tracking.
* **Role-Based Access Control (RBAC):** Secure authentication and authorization using JWT, distinguishing between User and Admin permissions.
* **Task Management:** Create projects, assign tasks to team members, designate team leads, and set strict deadlines.
* **Collaborative Workflows:** Real-time project tracking through status updates, task comments, and detailed activity logs.
* **Dynamic UI/UX:** Built with Shadcn UI and Tailwind CSS for a professional, responsive, and intuitive user experience.
* **Data Visualization:** Visual representation of project health and team activity.

---

##  Tech Stack

### **Frontend**
* **React.js:** Library for building the component-based user interface.
* **Shadcn UI:** High-quality, accessible UI components.
* **Tailwind CSS:** Utility-first CSS framework for rapid and responsive styling.

### **Backend**
* **Node.js & Express.js:** Scalable runtime environment and framework for handling API logic.
* **JWT (JSON Web Tokens):** For secure, stateless user authentication.
* **MongoDB:** NoSQL database for flexible and efficient project and user data storage.

---

##  System Architecture

1.  **Authentication Layer:** Users log in via JWT; the system validates roles to grant access to specific routes (e.g., Admin vs. Team Member).
2.  **Project Engine:** Handles the logic for creating projects, calculating deadlines, and updating task statuses.
3.  **Collaboration Layer:** Manages real-time updates for comments and activity logs to ensure team alignment.
4.  **Database Schema:** Optimized MongoDB collections for Users, Projects, and Tasks to ensure fast retrieval and data integrity.

---

## ⚙️ Installation & Setup

### **Prerequisites**
* Node.js (v18+)
* MongoDB Atlas account or local MongoDB instance

### **1. Clone the Repository**
```bash
git clone [https://github.com/your-username/projecthub.git](https://github.com/your-username/projecthub.git)
cd projecthub
