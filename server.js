const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const USERS_FILE = path.join(__dirname, 'users.json');

function getUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const foundUser = users.find(u => u.email === email && u.password === password);

  if (foundUser) {
    console.log(`Successful login: ${foundUser.fullName}`);
    return res.json({
      success: true,
      user: {
        email: foundUser.email,
        fullName: foundUser.fullName
      }
    });
  }

  console.log(`Failed login attempt for: ${email}`);
  return res.status(401).json({
    success: false,
    message: "The email address or password is incorrect"
  });
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});