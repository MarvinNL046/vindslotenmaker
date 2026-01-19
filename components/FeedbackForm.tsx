'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Send, X } from 'lucide-react';

interface FeedbackFormProps {
  pageTitle?: string;
  pageUrl?: string;
}

export default function FeedbackForm({ pageTitle, pageUrl }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Get prompt text based on rating
  const getPromptText = () => {
    if (rating <= 2) return 'Wat kunnen we verbeteren?';
    if (rating === 3) return 'Wat mist er nog?';
    return 'Wat vond u goed?';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Selecteer eerst een beoordeling');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
          page_title: pageTitle,
          page_url: pageUrl || window.location.pathname,
          type: 'rating'
        }),
      });

      if (!response.ok) {
        throw new Error('Feedback verzenden mislukt');
      }

      setIsSubmitted(true);
    } catch {
      setError('Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setComment('');
    setIsSubmitted(false);
    setError('');
  };

  if (isSubmitted) {
    return (
      <Card className="p-6 bg-orange-50 border-orange-200">
        <div className="text-center space-y-2">
          <p className="text-orange-700 font-medium">
            Bedankt voor uw feedback!
          </p>
          <p className="text-sm text-orange-600">
            Uw input helpt ons om onze informatie te verbeteren.
          </p>
          <button
            onClick={handleReset}
            className="text-sm text-orange-700 underline hover:no-underline mt-2"
          >
            Nieuwe feedback geven
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">Was deze informatie nuttig?</h3>

        {/* Rating stars */}
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                disabled={isSubmitting}
                className="p-1 transition-colors disabled:opacity-50"
                aria-label={`Beoordeel met ${star} sterren`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating === 1 && 'Zeer ontevreden'}
              {rating === 2 && 'Ontevreden'}
              {rating === 3 && 'Neutraal'}
              {rating === 4 && 'Tevreden'}
              {rating === 5 && 'Zeer tevreden'}
            </p>
          )}
        </div>

        {/* Comment box - shows after rating selection */}
        {rating > 0 && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5">
                {getPromptText()} <span className="text-muted-foreground font-normal">(optioneel)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  rating <= 2
                    ? "Bijv. ontbrekende info, fouten, onduidelijke informatie..."
                    : rating === 3
                    ? "Bijv. welke aanvullende informatie zou u willen zien..."
                    : "Bijv. wat was vooral nuttig voor u..."
                }
                className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                rows={3}
                maxLength={500}
              />
              {comment && (
                <button
                  type="button"
                  onClick={() => setComment('')}
                  className="absolute top-8 right-2 text-gray-400 hover:text-gray-600"
                  aria-label="Tekst wissen"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {comment.length}/500 tekens
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Annuleren
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Verzenden...' : 'Versturen'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </form>
    </Card>
  );
}
