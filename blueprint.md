# Stremini Website Blueprint

## Overview
Stremini is a premium website for an AI-powered platform, designed with a high-tech, futuristic aesthetic. It features a dark theme, glassmorphism effects, and dynamic interactive elements to provide a "wow" factor for users.

## Project Documentation

### Style & Design
- **Theme**: Dark mode by default using Slate and Purple color palettes.
- **Typography**: Modern sans-serif fonts (Geist).
- **Aesthetics**: Glassmorphism (blurred backgrounds, semi-transparent borders), glowing effects, and smooth animations.
- **Layout**: Responsive design with a sidebar navigation and structured sections (Hero, Features, Gallery, Team, Blog).

### Features
- **Waitlist System**: Integrated with Supabase for user signups.
- **Blog Section**: Dynamic blog posts fetched from Supabase with an admin dashboard for management.
- **Team Page**: Showcases team members with social links.
- **Interactive Elements**:
    - **Custom AI Orb Cursor**: A glowing cursor that reacts to interactive elements.
    - **Magnetic Buttons**: CTA buttons and icons that attract the cursor.
    - **Page Transitions**: Smooth entry/exit animations for all routes.
    - **Glow Borders**: Hover-activated glowing borders on feature cards.

## Current Implementation: Interactive Features
The goal was to enhance the website with premium interactive features to create a more engaging experience.

### Steps Taken:
1. **Setup**: Created core interactive components using `framer-motion`.
2. **Cursor**: Implemented `CursorOrb` for a custom, glowing cursor experience.
3. **Interactivity**: Created `MagneticWrapper` to add magnetic pull to buttons and icons.
4. **Transitions**: Implemented `PageTransition` for smooth route changes.
5. **Styling**: Updated `globals.css` with utility classes for glassmorphism and glowing borders.
6. **Integration**: Applied these features to the Hero section and Features grid.
7. **Verification**: Confirmed with successful linting and production build.
