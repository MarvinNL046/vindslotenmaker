// Site configuration for VindSlotenmaker.nl (Netherlands)
export const getSiteConfig = () => {
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ||
                 (typeof window !== 'undefined' ? window.location.hostname : 'vindslotenmaker.nl');

  const configs: Record<string, {
    id: string;
    domain: string;
    name: string;
    description: string;
  }> = {
    'vindslotenmaker.nl': {
      id: 'slotenmaker',
      domain: 'vindslotenmaker.nl',
      name: 'VindSlotenmaker.nl',
      description: 'Vind een slotenmaker bij jou in de buurt'
    },
    'www.vindslotenmaker.nl': {
      id: 'slotenmaker',
      domain: 'vindslotenmaker.nl',
      name: 'VindSlotenmaker.nl',
      description: 'Vind een slotenmaker bij jou in de buurt'
    },
    'localhost:3000': {
      id: 'slotenmaker',
      domain: 'vindslotenmaker.nl',
      name: 'VindSlotenmaker.nl',
      description: 'Vind een slotenmaker bij jou in de buurt'
    },
    'localhost:3001': {
      id: 'slotenmaker',
      domain: 'vindslotenmaker.nl',
      name: 'VindSlotenmaker.nl',
      description: 'Vind een slotenmaker bij jou in de buurt'
    }
  };

  return configs[domain] || configs['vindslotenmaker.nl'];
};
