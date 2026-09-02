const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = 3000;

// DEMO ONLY: intentionally hardcoded credentials
const ADMIN_PASSWORD = "demo-password-123";
const API_TOKEN = "demo-api-token-123456789";

// 1. Potential XSS
app.get("/hello", (req, res) => {
  const name = req.query.name || "world";

  res.send(`
    <html>
      <body>
        <h1>Hello ${name}</h1>
      </body>
    </html>
  `);
});

// 2. Command injection
app.get("/ping", (req, res) => {
  const host = req.query.host;

  exec(`ping -c 1 ${host}`, (error, stdout) => {
    if (error) {
      return res.status(500).send(error.message);
    }

    res.send(stdout);
  });
});

// 3. Path traversal
app.get("/file", (req, res) => {
  const filename = req.query.filename;

  const contents = fs.readFileSync(
    "./uploads/" + filename,
    "utf8"
  );

  res.send(contents);
});

// 4. Dangerous eval()
app.get("/calculate", (req, res) => {
  const expression = req.query.expression;

  const result = eval(expression);

  res.send(String(result));
});

// 5. Weak randomness for something security-sensitive
app.get("/reset-token", (req, res) => {
  const resetToken = Math.random()
    .toString(36)
    .substring(2);

  res.json({
    resetToken: resetToken
  });
});

// 6. Information disclosure / bad practice
app.get("/debug", (req, res) => {
  res.json({
    password: ADMIN_PASSWORD,
    token: API_TOKEN,
    environment: process.env
  });
});

app.listen(PORT, () => {
  console.log(`Demo app listening on port ${PORT}`);
});
