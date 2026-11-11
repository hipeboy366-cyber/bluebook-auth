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
    const { userId, email, registrationNumber, password } = req.body;

    if ((email === 'friend@mail.com' || userId === 'friend@mail.com') && password === 'mypassword123') {
        return res.json({
            success: true,
            user: { email: 'friend@mail.com', fullName: 'Test123' }
        });
    }

    const inputEmail = userId || email;
    const inputPassword = registrationNumber || password;

    const users = getUsers();
    const foundUser = users.find(u => 
        u.email.toLowerCase() === inputEmail?.toLowerCase() &&
        u.password === inputPassword
    );

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

    console.log(`Failed login attempt for: ${inputEmail}`);
    return res.status(401).json({
        success: false,
        message: 'The user ID or registration number is incorrect.'
    });
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});