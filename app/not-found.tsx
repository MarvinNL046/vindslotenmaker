import Link from 'next/link'
import { Search, Home, MapPin, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <Key className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Pagina Niet Gevonden</h2>
        <p className="text-lg text-muted-foreground mb-8">
          De pagina die je zoekt bestaat niet of is verplaatst.
          Geen zorgen, we helpen je vinden wat je nodig hebt!
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          <Link href="/">
            <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
              <Home className="mr-2 h-4 w-4" />
              Homepagina
            </Button>
          </Link>
          <Link href="/search">
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              <Search className="mr-2 h-4 w-4" />
              Zoek Slotenmaker
            </Button>
          </Link>
          <Link href="/state">
            <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
              <MapPin className="mr-2 h-4 w-4" />
              Per Provincie
            </Button>
          </Link>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
          <h3 className="font-semibold mb-3 text-orange-800">Populaire Locaties</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/state/noord-holland" className="text-orange-600 hover:underline">
              Slotenmakers in Noord-Holland
            </Link>
            <Link href="/state/zuid-holland" className="text-orange-600 hover:underline">
              Slotenmakers in Zuid-Holland
            </Link>
            <Link href="/state/noord-brabant" className="text-orange-600 hover:underline">
              Slotenmakers in Noord-Brabant
            </Link>
          </div>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>Kapotte link gevonden? Laat het ons weten via</p>
          <a href="mailto:info@vindslotenmaker.nl" className="text-orange-600 hover:underline">
            info@vindslotenmaker.nl
          </a>
        </div>
      </div>
    </div>
  )
}
