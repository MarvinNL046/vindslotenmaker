'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Send, MessageSquare, Clock, CheckCircle, AlertCircle, ArrowRight, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InlineAd from '@/components/ads/InlineAd';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Contact</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Contact
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Heb je een vraag, opmerking of wil je samenwerken?
            We horen graag van je en reageren binnen 1-2 werkdagen.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 shadow-soft">
                <h2 className="font-serif text-2xl font-bold mb-6">Stuur ons een bericht</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-orange-700 font-medium">Bericht verzonden!</p>
                      <p className="text-orange-600 text-sm">
                        Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
                        Je ontvangt een bevestiging op het opgegeven e-mailadres.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 font-medium">Er ging iets mis</p>
                      <p className="text-red-600 text-sm">
                        Probeer het opnieuw of stuur een e-mail naar info@vindslotenmaker.nl.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Naam <span className="text-orange-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Je naam"
                        className="border-2 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        E-mailadres <span className="text-orange-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="je@email.nl"
                        className="border-2 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Onderwerp <span className="text-orange-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 bg-background"
                    >
                      <option value="">Selecteer een onderwerp</option>
                      <option value="general">Algemene vraag</option>
                      <option value="information">Informatie toevoegen/wijzigen</option>
                      <option value="partnership">Samenwerking</option>
                      <option value="technical">Technisch probleem</option>
                      <option value="other">Anders</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Bericht <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Je bericht..."
                      className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 resize-none bg-background"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isSubmitting ? (
                      <>Verzenden...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Verstuur bericht
                      </>
                    )}
                  </Button>
                </form>
              </Card>

              <InlineAd />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">Contactgegevens</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-orange-700" />
                    </div>
                    <div>
                      <p className="font-medium">E-mail</p>
                      <a
                        href="mailto:info@vindslotenmaker.nl"
                        className="text-sm text-orange-600 hover:underline"
                      >
                        info@vindslotenmaker.nl
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-orange-700" />
                    </div>
                    <div>
                      <p className="font-medium">Locatie</p>
                      <p className="text-sm text-muted-foreground">
                        Nederland
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-orange-700" />
                    </div>
                    <div>
                      <p className="font-medium">Reactietijd</p>
                      <p className="text-sm text-muted-foreground">
                        Binnen 1-2 werkdagen
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* FAQ Topics Card */}
              <Card className="p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold mb-4">Veelvoorkomende Onderwerpen</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Informatie Toevoegen</p>
                      <p className="text-xs text-muted-foreground">
                        Bent u slotenmaker? We voegen graag uw gegevens toe aan onze database.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Onjuiste Informatie</p>
                      <p className="text-xs text-muted-foreground">
                        Klopt er iets niet? Laat het ons weten zodat we het kunnen corrigeren.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Samenwerking</p>
                      <p className="text-xs text-muted-foreground">
                        Interesse in samenwerking? We staan open voor partnerschappen.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* For Locksmiths Card */}
              <Card className="p-6 shadow-soft bg-gradient-to-br from-orange-50 to-orange-50/50 border-orange-100">
                <h3 className="font-serif text-lg font-semibold mb-3">Voor Slotenmakers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bent u slotenmaker en wilt u zeker zijn dat uw gegevens correct en volledig zijn?
                  Neem contact met ons op voor een gratis verificatie van uw vermelding.
                </p>
                <a
                  href="mailto:info@vindslotenmaker.nl?subject=Slotenmaker Verificatie"
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:underline"
                >
                  Verificatie aanvragen
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Liever direct zoeken?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Doorzoek onze uitgebreide database van slotenmakers in heel Nederland.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              <Key className="w-5 h-5" />
              Zoek Slotenmaker
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
