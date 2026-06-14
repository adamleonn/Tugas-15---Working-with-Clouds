const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let totalRequests = 0;
let loadRequests = 0;

app.use(express.json());

// Serve file frontend dari folder public
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  totalRequests++;
  next();
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "running",
    message: "Aplikasi aktif dan siap menerima request",
    instanceId: process.env.WEBSITE_INSTANCE_ID || "local-instance",
    time: new Date().toISOString()
  });
});

app.get("/api/load", (req, res) => {
  loadRequests++;

  let result = 0;

  for (let i = 0; i < 7000000; i++) {
    result += Math.sqrt(i);
  }

  res.json({
    status: "success",
    message: "Request berhasil diproses",
    instanceId: process.env.WEBSITE_INSTANCE_ID || "local-instance",
    loadRequestNumber: loadRequests,
    result: Math.round(result),
    time: new Date().toISOString()
  });
});

app.get("/api/metrics", (req, res) => {
  res.json({
    totalRequests,
    loadRequests,
    instanceId: process.env.WEBSITE_INSTANCE_ID || "local-instance",
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});