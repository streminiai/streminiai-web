// pages/api/team/[id].js
// PUT → update a member's profile (requires username + password for auth)

import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'team.json');

const ALLOWED_FIELDS = [
  'name', 'role', 'bio', 'location',
  'twitter', 'linkedin', 'website',
  'skills', 'colorKey', 'color', 'avatar', 'status'
];

const COLORS = {
  blue:   'linear-gradient(135deg,#0071e3,#34aadc)',
  purple: 'linear-gradient(135deg,#bf5af2,#9b59b6)',
  orange: 'linear-gradient(135deg,#ff9f0a,#ff6b35)',
  green:  'linear-gradient(135deg,#34c759,#30a14e)',
  red:    'linear-gradient(135deg,#ff3b30,#c0392b)',
  teal:   'linear-gradient(135deg,#5ac8fa,#0097a7)',
};

function readTeam() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeTeam(team) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(team, null, 2), 'utf8');
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // allow avatar base64 image
    },
  },
};

export default function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { username, password, updates } = req.body;

    if (!username || !password || !updates) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const team = readTeam();
    const idx = team.findIndex((m) => m.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Auth: only the member themselves can update their profile
    const member = team[idx];
    if (
      member.username.toLowerCase() !== username.toLowerCase() ||
      member.password !== password
    ) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Apply only allowed fields
    ALLOWED_FIELDS.forEach((field) => {
      if (updates[field] !== undefined) {
        team[idx][field] = updates[field];
      }
    });

    // Sync color gradient from colorKey
    if (updates.colorKey && COLORS[updates.colorKey]) {
      team[idx].color = COLORS[updates.colorKey];
    }

    writeTeam(team);

    // Return updated member without password
    const { password: _pw, ...safe } = team[idx];
    return res.status(200).json(safe);

  } catch (err) {
    console.error('[team/[id]] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
