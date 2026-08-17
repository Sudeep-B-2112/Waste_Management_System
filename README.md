<div align="center">
♻️ EcoTrack
Role-Based Waste Management System

A full-stack MERN application for managing waste pickup requests — from submission to collection to verification.

Show Image Show Image Show Image Show Image Show Image

</div>
📖 About

EcoTrack streamlines waste collection with three dedicated portals:

Role	Capabilities
👤 User	Submit pickup requests, track status in real time
🚚 Collector	View assigned collections, mark as collected, upload proof photos
🛡️ Admin	Assign collectors, verify or reject collection proof, view reports
🛠️ Tech Stack
<table> <tr> <td><b>Frontend</b></td> <td>React (Vite)</td> </tr> <tr> <td><b>Backend</b></td> <td>Node.js · Express</td> </tr> <tr> <td><b>Database</b></td> <td>MongoDB · Mongoose</td> </tr> <tr> <td><b>Auth</b></td> <td>JWT · bcryptjs</td> </tr> <tr> <td><b>File Uploads</b></td> <td>Multer</td> </tr> </table>
📁 Project Structure
waste-management-role-based/
├── client/          🎨 React frontend
├── server/          ⚙️  Express backend
└── README.md
⚡ Quick Start
✅ Prerequisites
Node.js v18+
MongoDB (local) or MongoDB Atlas
npm
1️⃣ Clone the repo
bash
git clone https://github.com/Sudeep-B-2112/Waste_Management_System.git                                                       
cd waste-management-role-based
2️⃣ Backend setup
bash
cd server
npm install

Create a .env file inside server/:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

⚠️ Never commit .env — it's already covered by .gitignore.

Run the server:

bash
npm run dev

🟢 API live at → http://localhost:5000

On first launch, three demo accounts are seeded automatically:

Role	Email	Password
🛡️ Admin	admin@example.com	admin123
👤 User	user@example.com	user123
🚚 Collector	collector@example.com	collector123
3️⃣ Frontend setup

Open a new terminal:

bash
cd client
npm install
npm run dev

🟢 App live at → http://localhost:5173

🔑 Environment Variables
Variable	Description	Example
PORT	Backend server port	5000
MONGO_URI	MongoDB connection string	mongodb://localhost:27017/ecotrack
JWT_SECRET	Secret for signing JWT tokens	any long random string
📜 Available Scripts

Backend (server/)

bash
npm run dev       # start with auto-reload (nodemon)
npm start         # start normally

Frontend (client/)

bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview production build
🔄 App Flow
User creates request  →  Admin assigns collector  →  Collector collects & uploads proof
                                                              ↓
                                          Admin verifies  →  ✅ Completed
                                                 ↓
                                          or ❌ Rejected → Collector re-uploads
📝 Notes
Collection photos are stored in server/uploads/ and served at /uploads/<filename>.
Ensure MongoDB is running (or MONGO_URI points to a live Atlas cluster) before starting the backend.
<div align="center">

Made with ♻️ for a cleaner tomorrow

</div>
