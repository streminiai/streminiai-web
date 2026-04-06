// pages/api/team/index.js
// GET  → returns all team members (passwords stripped)
// POST → login: returns member data if credentials match

import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'team.json');

function readTeam() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function stripPasswords(members) {
  return members.map(({ password, ...rest }) => rest);
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return all members without passwords
    try {
      const team = readTeam();
      return res.status(200).json(stripPasswords(team));
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read team data' });
    }
  }

  if (req.method === 'POST') {
    // Login: { username, password }
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Missing credentials' });
      }
      const team = readTeam();
      const member = team.find(
        (m) =>
          m.username.toLowerCase() === username.toLowerCase() &&
          m.password === password
      );
      if (!member) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Return member data without password
      const { password: _pw, ...safe } = member;
      return res.status(200).json(safe);
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
