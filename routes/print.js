const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const PRINT_JOBS_DIR = path.join(__dirname, '../print-jobs');
if (!fs.existsSync(PRINT_JOBS_DIR)) fs.mkdirSync(PRINT_JOBS_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PRINT_JOBS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Upload PDF
router.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Save job info for admin listing
  const jobs = JSON.parse(fs.readFileSync(path.join(PRINT_JOBS_DIR, 'jobs.json'), 'utf8') || '[]');
  jobs.push({ filename: req.file.filename, originalname: req.file.originalname, uploaded: new Date() });
  fs.writeFileSync(path.join(PRINT_JOBS_DIR, 'jobs.json'), JSON.stringify(jobs, null, 2));
  res.json({ success: true, filename: req.file.filename });
});

// List jobs
router.get('/jobs', (req, res) => {
  let jobs = [];
  try {
    jobs = JSON.parse(fs.readFileSync(path.join(PRINT_JOBS_DIR, 'jobs.json'), 'utf8'));
  } catch {}
  res.json({ jobs });
});

// Print PDF
router.post('/print/:filename', (req, res) => {
  const filePath = path.join(PRINT_JOBS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  // For Windows, use 'print'; for Linux/Mac, use 'lp'
  const { exec } = require('child_process');
  const printCmd = process.platform === 'win32' ? `print /D:PRINTER_NAME "${filePath}"` : `lp "${filePath}"`;
  exec(printCmd, (err) => {
    if (err) return res.status(500).json({ error: 'Print failed' });
    res.json({ success: true });
  });
});

module.exports = router;
