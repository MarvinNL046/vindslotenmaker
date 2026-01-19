'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, X, ArrowLeft, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProxiedImage from '@/components/ProxiedImage';
import { Facility } from '@/lib/data';

interface CompareItem {
  id: string;
  name: string;
}

export default function ComparePage() {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load compare list from localStorage
    const saved = localStorage.getItem('compareList');
    if (saved) {
      const list = JSON.parse(saved);
      setCompareList(list);
      loadFacilities(list);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen for storage events
    const handleStorageChange = () => {
      const saved = localStorage.getItem('compareList');
      if (saved) {
        const list = JSON.parse(saved);
        setCompareList(list);
        loadFacilities(list);
      } else {
        setCompareList([]);
        setFacilities([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadFacilities = async (items: CompareItem[]) => {
    setLoading(true);
    try {
      const promises = items.map(item =>
        fetch(`/api/facility/${item.id}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      setFacilities(results.filter(Boolean));
    } catch (error) {
      console.error('Fout bij laden slotenmakers:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCompare = (id: string) => {
    const newList = compareList.filter(item => item.id !== id);
    localStorage.setItem('compareList', JSON.stringify(newList));
    setCompareList(newList);
    setFacilities(facilities.filter(f => f.slug !== id));
    window.dispatchEvent(new Event('storage'));
  };

  const clearAll = () => {
    localStorage.removeItem('compareList');
    setCompareList([]);
    setFacilities([]);
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Slotenmakers laden...</p>
        </div>
      </div>
    );
  }

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Slotenmakers Vergelijken</h1>
          <p className="text-muted-foreground mb-8">
            Je hebt nog geen slotenmakers geselecteerd om te vergelijken.
            Ga naar een slotenmaker pagina en klik op de &quot;Vergelijk&quot; knop.
          </p>
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar homepagina
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Slotenmakers Vergelijken</h1>
        <Button variant="outline" onClick={clearAll} className="border-orange-200 text-orange-700 hover:bg-orange-50">
          Alles wissen
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Eigenschap</th>
              {facilities.map(facility => (
                <th key={facility.slug} className="p-4 min-w-[300px]">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={() => removeFromCompare(facility.slug)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
                    <Link href={`/facility/${facility.slug}`}>
                      <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                        Bekijk details
                      </Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Photo */}
            <tr className="border-b">
              <td className="p-4 font-medium">Foto</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  {facility.photo_url ? (
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                      <ProxiedImage
                        src={facility.photo_url}
                        alt={facility.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-orange-50 rounded-lg flex items-center justify-center">
                      <Key className="w-8 h-8 text-orange-300" />
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Type */}
            <tr className="border-b bg-orange-50/50">
              <td className="p-4 font-medium">Type</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  <span className="inline-block px-3 py-1 bg-white rounded-full text-sm border border-orange-100">
                    {facility.type || 'Slotenmaker'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr className="border-b">
              <td className="p-4 font-medium">Locatie</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-600 mt-0.5" />
                    <div className="text-sm">
                      <p>{facility.city}{facility.county ? `, ${facility.county}` : ''}</p>
                      <p className="text-muted-foreground">{facility.state}</p>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Address */}
            <tr className="border-b bg-orange-50/50">
              <td className="p-4 font-medium">Adres</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  <p className="text-sm">
                    {facility.address || '-'}<br />
                    {facility.city}, {facility.state_abbr} {facility.zipCode}
                  </p>
                </td>
              ))}
            </tr>

            {/* Opening hours */}
            <tr className="border-b">
              <td className="p-4 font-medium">Openingstijden</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
                    <p className="text-sm">{facility.opening_hours || 'Niet beschikbaar'}</p>
                  </div>
                </td>
              ))}
            </tr>

            {/* Phone */}
            <tr className="border-b bg-orange-50/50">
              <td className="p-4 font-medium">Telefoon</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  <p className="text-sm">{facility.phone || 'Niet beschikbaar'}</p>
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b">
              <td className="p-4 font-medium">Beoordeling</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  {facility.rating && facility.rating > 0 ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{facility.rating.toFixed(1)}</span>
                        <div className="text-orange-500">
                          {'★'.repeat(Math.round(facility.rating))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {facility.review_count || 0} reviews
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nog geen beoordelingen</p>
                  )}
                </td>
              ))}
            </tr>

            {/* Services */}
            <tr className="border-b bg-orange-50/50">
              <td className="p-4 font-medium">Diensten</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  <p className="text-sm">
                    {facility.treatment_types?.join(', ') || 'Niet gespecificeerd'}
                  </p>
                </td>
              ))}
            </tr>

            {/* Amenities */}
            <tr className="border-b">
              <td className="p-4 font-medium">Faciliteiten</td>
              {facilities.map(facility => (
                <td key={facility.slug} className="p-4">
                  <p className="text-sm">
                    {facility.amenities?.join(', ') || 'Niet gespecificeerd'}
                  </p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add more facilities */}
      {compareList.length < 3 && (
        <div className="mt-8 p-6 bg-orange-50 rounded-lg text-center border border-orange-100">
          <p className="text-muted-foreground mb-4">
            Je kunt nog {3 - compareList.length} slotenmaker{3 - compareList.length > 1 ? 's' : ''} toevoegen aan je vergelijking
          </p>
          <Link href="/">
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              Vind meer slotenmakers
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
