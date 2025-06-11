# BioLove - Personalized Couple Experiences

A modern web platform for creating and sharing personalized couple experiences through beautiful, interactive landing pages.

## Features

- 🎨 Beautiful, responsive design
- 🎵 Music integration (Spotify/YouTube)
- 📸 Photo gallery with smooth transitions
- ✍️ Custom message display
- 🔒 Secure admin authentication
- 🚀 Fast and modern tech stack

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)
- Framer Motion
- React Player

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- Environment variables configured

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bio-love.git
cd bio-love
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Admin Access

1. Navigate to `/admin/login`
2. Log in with your admin credentials
3. Create new experiences by uploading photos, adding music, and writing messages

#### Changing Admin Credentials

Admin login and password are managed directly through Firebase Authentication. To change credentials:

1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. In the left-hand menu, navigate to "Authentication" under the "Build" section.
4. Go to the "Users" tab.
5. Here you can add new users, delete existing ones, or change passwords for existing users (by clicking on the user and then "reset password").

### Experience Viewing

1. Share the generated experience URL with the couple
2. The experience page will automatically play music and display photos with the custom message

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
