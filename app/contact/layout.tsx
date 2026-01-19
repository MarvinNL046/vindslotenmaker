import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Vind Slotenmaker',
  description: 'Neem contact op met Vind Slotenmaker voor vragen, suggesties of samenwerkingen.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
