import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'StudyNook | Study Room Booking Platform',
  description: 'Book quiet, private study rooms.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFB] text-[#0F172A] antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}