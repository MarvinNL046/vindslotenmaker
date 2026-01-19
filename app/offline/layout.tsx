import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline | Vind Slotenmaker',
  description: 'Je bent momenteel offline. Controleer je internetverbinding.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
