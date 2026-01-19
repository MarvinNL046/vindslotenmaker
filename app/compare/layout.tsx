import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slotenmakers Vergelijken | Vind Slotenmaker',
  description: 'Vergelijk slotenmakers naast elkaar. Bekijk details, diensten, beoordelingen en contactgegevens om de juiste slotenmaker te vinden.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
