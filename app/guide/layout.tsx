import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Vind Slotenmaker Gidsen',
    default: 'Slotenmaker Gidsen & Tips | Vind Slotenmaker',
  },
  description: 'Praktische gidsen over slotenmakers, woningbeveiliging, sloten kiezen en wat te doen bij noodgevallen.',
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary/20 min-h-screen">
      {children}
    </div>
  );
}
