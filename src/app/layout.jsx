import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import ToasterProvider from '../components/ToasterProvider';

export const metadata = {
  title: {
    default: 'StudyNook – Study Room Booking Platform',
    template: 'StudyNook – %s',
  },
  description: 'Book quiet, private study rooms.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFB] text-[#0F172A] antialiased min-h-screen">
        <AuthProvider>
          <ToasterProvider />
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}