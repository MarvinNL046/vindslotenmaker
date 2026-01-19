'use client';

import { useState, useEffect, useCallback, Suspense, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Loader2, X, Star, Key, Lock, SlidersHorizontal, Plus, Shield, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import InFeedAd from '@/components/ads/InFeedAd';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import SidebarAd from '@/components/ads/SidebarAd';
import { AD_SLOTS } from '@/lib/ad-config';

interface Facility {
  name: string;
  city: string;
  county?: string;
  state: string;
  state_abbr: string;
  type: string;
  slug: string;
  address?: string;
  zipCode?: string;
  rating?: number;
  review_count?: number;
  photo?: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const locationParam = searchParams.get('location') || '';
  const typeFilter = searchParams.get('type') || 'all';

  const [results, setResults] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query || locationParam);
  const [selectedType, setSelectedType] = useState(typeFilter);
  const [selectedState, setSelectedState] = useState('all');
  const [states, setStates] = useState<{ name: string; abbr: string }[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleResults, setVisibleResults] = useState(12);

  const serviceTypes = [
    { value: 'all', label: 'Alle Diensten', icon: Lock },
    { value: 'noodopening', label: 'Noodopening', icon: Key },
    { value: 'sloten-vervangen', label: 'Sloten Vervangen', icon: Lock },
    { value: 'inbraakbeveiliging', label: 'Inbraakbeveiliging', icon: Shield },
    { value: 'autosloten', label: 'Autosloten', icon: Key },
    { value: '24-uurs-service', label: '24-uurs Service', icon: Clock },
  ];

  useEffect(() => {
    fetch('/api/data?type=states')
      .then(res => res.json())
      .then(data => setStates(data || []));
  }, []);

  const performSearch = useCallback(async (currentQuery: string, currentType: string, currentState: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const trimmedQuery = currentQuery?.trim() || '';
      if (trimmedQuery) params.append('q', trimmedQuery);
      if (currentType && currentType !== 'all') params.append('type', currentType);
      if (currentState && currentState !== 'all') params.append('state', currentState);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      setResults(data || []);
      setVisibleResults(12);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearchQuery(query || locationParam);
    setSelectedType(typeFilter);
    performSearch(query || locationParam, typeFilter, selectedState);
  }, [query, locationParam, typeFilter, selectedState, performSearch]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedType !== 'all') params.append('type', selectedType);

    window.location.href = `/search?${params.toString()}`;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedState('all');
    performSearch('', 'all', 'all');
  };

  const hasActiveFilters = selectedType !== 'all' || selectedState !== 'all' || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-center">
            {searchQuery ? `Zoekresultaten voor "${searchQuery}"` : 'Vind Slotenmakers'}
          </h1>
          <p className="text-orange-100 text-center max-w-2xl mx-auto">
            Doorzoek onze database van slotenmakers in heel Nederland
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filter Bar */}
          <Card className="p-4 mb-8 shadow-soft border-orange-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-600 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Zoek op naam, stad of postcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-12 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Quick Filters - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                <Select value={selectedType} onValueChange={(val) => {
                  setSelectedType(val);
                  performSearch(searchQuery, val, selectedState);
                }}>
                  <SelectTrigger className="w-[200px] h-12">
                    <SelectValue placeholder="Type Dienst" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedState} onValueChange={(val) => {
                  setSelectedState(val);
                  performSearch(searchQuery, selectedType, val);
                }}>
                  <SelectTrigger className="w-[180px] h-12">
                    <SelectValue placeholder="Provincie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Provincies</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state.abbr} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} size="lg" className="h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white">
                  <Search className="w-5 h-5 mr-2" />
                  Zoeken
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 w-5 h-5 bg-orange-600 text-white rounded-full text-xs flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
                <Button onClick={handleSearch} className="h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type Dienst</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecteer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Provincie</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Alle Provincies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Provincies</SelectItem>
                      {states.map(state => (
                        <SelectItem key={state.abbr} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={clearFilters} className="flex-1 border-gray-300 hover:bg-gray-50">
                    Wissen
                  </Button>
                  <Button
                    onClick={() => {
                      performSearch(searchQuery, selectedType, selectedState);
                      setShowFilters(false);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Toepassen
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Actieve filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm">
                  <Search className="w-3 h-3" />
                  {searchQuery}
                  <button onClick={() => {
                    setSearchQuery('');
                    performSearch('', selectedType, selectedState);
                  }} className="ml-1 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm">
                  {serviceTypes.find(t => t.value === selectedType)?.label}
                  <button onClick={() => {
                    setSelectedType('all');
                    performSearch(searchQuery, 'all', selectedState);
                  }} className="ml-1 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedState !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm">
                  {selectedState}
                  <button onClick={() => {
                    setSelectedState('all');
                    performSearch(searchQuery, selectedType, 'all');
                  }} className="ml-1 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium"
              >
                Alle filters wissen
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                <span>Zoeken...</span>
              </div>
            ) : (
              <p className="text-muted-foreground">
                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-orange-600 text-white text-sm font-semibold rounded-full mr-2">{results.length}</span>
                slotenmakers gevonden
              </p>
            )}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Slotenmakers zoeken...</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center border-orange-100">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Geen Resultaten Gevonden</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We konden geen slotenmakers vinden die aan je zoekopdracht voldoen.
                Probeer andere zoektermen of pas de filters aan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={clearFilters} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  Filters Wissen
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Leaderboard ad before results */}
              <LeaderboardAd slot={AD_SLOTS.search.topLeaderboard} className="mb-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {results.slice(0, visibleResults).map((facility, index) => (
                  <Fragment key={facility.slug}>
                    <Link
                      href={`/facility/${facility.slug}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden border-2 border-transparent hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-orange-600 transition-colors line-clamp-2">
                              {facility.name}
                            </h3>
                            {facility.rating && facility.rating > 0 && (
                              <div className="flex items-center gap-1 text-sm bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full shrink-0 ml-2">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {facility.rating.toFixed(1)}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                              <span>{facility.city}, {facility.state_abbr || facility.state}</span>
                            </div>

                            {facility.address && (
                              <p className="text-xs pl-6 line-clamp-1">
                                {facility.address}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-xs font-medium bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full capitalize">
                              {facility.type?.replace(/-/g, ' ') || 'Slotenmaker'}
                            </span>

                            <span className="text-sm font-medium text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                              Bekijk
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                    {/* Show in-feed ad after every 6 results */}
                    {(index + 1) % 6 === 0 && index < visibleResults - 1 && (
                      <div key={`ad-${index}`} className="col-span-1 md:col-span-2 lg:col-span-3">
                        <InFeedAd slot={AD_SLOTS.search.inFeed} />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>

              {/* Load More */}
              {results.length > visibleResults && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {visibleResults} van {results.length} resultaten weergegeven
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleResults(prev => prev + 12)}
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Meer Laden
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Browse by Type */}
          <section className="mt-16 pt-8 border-t border-orange-100">
            <h2 className="font-serif text-2xl font-semibold mb-6 text-center">
              Zoek op Type Dienst
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {serviceTypes.slice(1).map((type) => (
                <Link
                  key={type.value}
                  href={`/type/${type.value}`}
                >
                  <Card className="p-5 h-full text-center hover:shadow-lg hover:border-orange-300 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{type.label}</h3>
                    <p className="text-xs text-orange-600 group-hover:text-orange-700">
                      Bekijk alle →
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="h-10 w-64 bg-white/20 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-white/10 rounded mx-auto animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
