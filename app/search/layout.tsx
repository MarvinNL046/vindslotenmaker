import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zoek Slotenmaker | Vind Slotenmaker',
  description: 'Doorzoek onze database van slotenmakers in heel Nederland. Vind slotenmakers op naam, stad, provincie of postcode.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
