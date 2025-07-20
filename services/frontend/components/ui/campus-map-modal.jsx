"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink } from "lucide-react"

export function CampusMapModal({ isOpen, onClose, university }) {
  if (!university || !university.locationUrl) {
    return null
  }

  // Extract coordinates from the Google Maps URL to create street view URL
  const getStreetViewUrl = (locationUrl) => {
    try {
      // Extract coordinates from URL like: https://maps.google.com/maps?q=42.360351,-71.093462&hl=en&z=18&output=embed
      const match = locationUrl.match(/q=([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)/);
      if (match) {
        const lat = match[1];
        const lng = match[2];
        return `https://www.google.com/maps/@${lat},${lng},3a,75y,90t/data=!3m6!1e1!3m4!1s0x0:0x0!2e0!7i13312!8i6656`;
      }
    } catch (error) {
      console.error('Error extracting coordinates for street view:', error);
    }
    
    // Fallback: basic Google Maps URL
    return university.locationUrl.replace('&output=embed', '');
  }

  const openStreetView = () => {
    const streetViewUrl = getStreetViewUrl(university.locationUrl);
    window.open(streetViewUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[90vw] h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">
              Walk in the Campus - {university.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* Google Maps Embed */}
          <div className="flex-1 relative rounded-lg overflow-hidden border">
            <iframe
              src={university.locationUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${university.name}`}
              className="absolute inset-0"
            ></iframe>
          </div>
          
          {/* Action Buttons */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={openStreetView}
              className="flex items-center gap-2"
              variant="default"
            >
              <ExternalLink className="h-4 w-4" />
              Open Street View
            </Button>
            
            <Button
              onClick={() => window.open(university.locationUrl.replace('&output=embed', ''), '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </Button>
          </div>
        </div>
        
        {/* University Info */}
        <div className="flex-shrink-0 bg-muted p-3 rounded-lg">
          <div className="text-sm">
            <p className="font-medium">{university.name}</p>
            <p className="text-muted-foreground">{university.address}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
