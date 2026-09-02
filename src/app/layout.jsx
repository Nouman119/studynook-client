import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'StudyNook | Study Room Booking Platform',
  description: 'Book quiet, private study rooms.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFB] text-[#0F172A] antialiased min-h-screen">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}