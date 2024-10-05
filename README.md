    # PROJECT MANAGEMENT TOOL - BACKEND


 1. OVERVIEW :

     - The Project Management Tool backend is built with Node.js and Express.js, providing a powerful and flexible API for managing projects and tasks.

     -  This application supports user authentication, role-based access control, and efficient data management using MongoDB.

     -  The backend is designed to support a robust frontend built with React.js, facilitating a seamless project management experience.

 3. FEATURES :

    -  User Authentication: Secure user registration and login using JWT (JSON Web Tokens).      

    -  Password Security: Passwords are hashed with Bcrypt before storage.     

    -  RESTful API: Full CRUD operations for managing projects and tasks.      
 
    -  Role-Based Access Control: Different access levels for managers and team members.      

    -  Data Storage: MongoDB for persistent data storage, including user profiles and project/task information.     

    -  Error Handling: Comprehensive error handling to ensure robust API responses.     

4. TECH STACK :

    - Frontend: React.js (for reference, not included in this README)

    - Backend: Node.js, Express.js
 
    - Database: MongoDB

    - Authentication: JWT, Bcrypt

5. INSTALLATION :

   Prerequisites
 
    - Node.js (v14 or later)
     
    - MongoDB (local installation or cloud service like MongoDB Atlas)
    
    - npm (comes with Node.js)
    
    - Set up environment variables: Create a .env file in the root directory and populate it with the following variables:

            _ PORT=5000
            _ MONGODB_URI=your_mongodb_connection_string
            _ JWT_SECRET=your_jwt_secret
  
    - Replace your_mongodb_connection_string with your MongoDB connection string.
  
    - Choose a strong secret for JWT_SECRET.

6.  The server will run at http://localhost:3000

7.  API ENDPOINTS  :
 
    a. Authentication :

      1) POST /api/auth/register

            -  Register a new user.

            -  Request Body:

                   {
               
                   "email": "user@example.com", 
  
                   "password": "yourpassword", 

                   "role": "manager/team_member" 

                   }
      
      3)  POST /api/auth/login

                 {    
         
                    "email": "user@example.com", 

                    "password": "yourpassword" 

                 }
         
    b. Projects :
   
      1) GET /api/projects

            -  Retrieve all projects (managers only).
     
      2) POST /api/projects

            -  Create a new project.

            -  Request Body :

                   {   

                    "title": "Project Title", 

                    "description": "Project Description", 

                    "deadline": "YYYY-MM-DD", 

                    "category": "Project Category" 
          
                   }
      
      4) GET /api/projects/

           -  Retrieve a specific project by ID.

      5) PUT /api/projects/

           -  Update a project by ID.

           -  Request Body:
          
                  { 
  
                    "title": "Updated Title", 

                    "description": "Updated Description" 

                  }
      
      7) DELETE /api/projects/

           - Delete a project by ID.
   
    c. Tasks :

      1) GET /api/tasks

           - Retrieve all tasks (accessible to team members and managers).

      2) POST /api/tasks

           - Create a new task.

           - Request Body:
          
                  { 

                      "projectId": "project_id", 

                      "title": "Task Title", 

                      "description": "Task Description", 

                      "deadline": "YYYY-MM-DD" 

                   }

      4) GET /api/tasks/

           - Retrieve a specific task by ID.

     7) PUT /api/tasks/

           - Update a task by ID.

     9) DELETE /api/tasks/

           - Delete a task by ID.

8.  ROLE-BASED-ACCESS :

    Manager Access:
   
      -   Managers have full access to all features in the system.
   
      -   They can perform CRUD (Create, Read, Update, Delete) operations on all tasks and data.
   
      -   Responsible for performing tasks not assigned to other users.
   
      -   Can view and generate reports.

    Team Member Access:

      -   Team Members can only access tasks that have been assigned to them.
  
      -   They can view and update their own tasks but cannot create or delete tasks.
  
      -   Can view and generate reports, similar to Managers, but without broader administrative capabilities.

9. SECURITY :

      -   JWT Authentication: Utilized to ensure that users can only access resources they are authorized for. Tokens are issued upon login and must be included in the headers of
  subsequent requests.

      -   Password Hashing: Bcrypt is used to hash passwords before storing them in the database, enhancing security.

      -   Role-Based Access Control: Middleware restricts access to certain routes based on user roles, ensuring that managers and team members have appropriate permissions.

10.  ERROR HANDLING :
 
      -   Comprehensive error handling is implemented throughout the API to return clear and consistent error messages, making it easier for clients to understand issues.

10. TESTING :

      -   Unit tests can be added using frameworks such as Jest or Mocha to ensure that the API functions as expected. Testing endpoints is encouraged to maintain code quality.

11. LICENSE :
 
      -   This project is licensed under the MIT License. See the LICENSE file for details.

12. ACKNOWLEDMENT :
 
   -   Special thanks to the open-source community for their invaluable resources and tools that contributed to building this application.

