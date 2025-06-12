# Memoriae - Personalized Digital Experiences

A modern web platform for creating and sharing personalized digital experiences through beautiful, interactive landing pages.

## Features

- 🎨 Beautiful, responsive design
- 🖼️ Multiple interactive layouts
- 🎵 Music integration (Spotify/YouTube)
- 📸 Photo gallery with smooth transitions
- ✍️ Custom message display
- 🔒 Secure admin authentication
- 🚀 Fast and modern tech stack

## Layouts Available

Memoriae offers a variety of layouts to present your experience. Each layout has a unique visual style and optimal photo requirements:

-   **Default Layout**: A standard layout featuring a main photo in prominence and the message below, with subtle background photos. Requires 1-10 main photos and 1-10 background photos.
-   **Full Screen Photo Layout**: Displays a single full-screen photo as the background, with elegant, overlaid text. Requires exactly 1 main photo (no additional background photos are used).
-   **Centered Message Layout**: Focuses the message and a carousel of smaller, rotating photos in the center, with smoothly moving background photos. Ideal for a central focus. Requires 1-5 main photos and 1-10 background photos.
-   **Split Screen Layout**: Dividess the screen horizontally to display photos on one side and the message on the other, creating a dynamic and modern interaction. Requires 1-10 main photos and 1-10 background photos.
-   **Vertical Timeline Layout**: Organizes photos and message snippets in a vertical timeline, perfect for sequential narratives or progressive stories. Requires 1-20 main photos (tied to sentences) and 1-10 background photos.
-   **Photo Grid Message Layout**: Presents a dynamic grid of photos that animate, with the message integrated or highlighted below the grid. Great for showcasing multiple moments. Requires 3-9 main photos and 1-10 background photos.

## Photo Uploads

When creating an experience, photo upload fields will dynamically appear based on the chosen layout's requirements. Each uploaded file has a maximum size limit of 5MB, and there are no specific image dimension limits.

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
git clone https://github.com/yourusername/memoriae.git
cd memoriae
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
3. Create new experiences by uploading photos, adding music, writing messages, and selecting a layout.

#### Changing Admin Credentials

Admin login and password are managed directly through Firebase Authentication. To change credentials:

1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. In the left-hand menu, navigate to "Authentication" under the "Build" section.
4. Go to the "Users" tab.
5. Here you can add new users, delete existing ones, or change passwords for existing users (by clicking on the user and then "reset password").

### Experience Viewing

1. Share the generated experience URL
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

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE](LICENSE) file for details.
