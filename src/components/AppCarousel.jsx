import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { fetchDriveImages } from "../api/Drive"

export function AppCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }))
  const [images, setImages] = React.useState([])

  React.useEffect(() => {
    if(images.length > 0) return
    fetchDriveImages().then((files) => {
      setImages(files);
    });
  }, []);

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
    <CarouselContent>
      {images.map((img, index) => (
        <CarouselItem key={img.id}>
            <div className="">
                <Card className="border-2 border-rose-400 rounded-lg">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                    <img
                      src={`https://drive.google.com/uc?export=view&id=${img.id}`}
                      alt={img.name}
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    </CardContent>
                </Card>
            </div>
        </CarouselItem>
        ))}
    </CarouselContent>
    </Carousel>
  )
}
