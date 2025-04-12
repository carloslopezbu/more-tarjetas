import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { fechtAmbumPhotos } from "@/api/Photos"

const user = JSON.parse(localStorage.getItem("user")) || null
const userEmail = user?.email ?? null

export function AppCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))
  const [images, setImages] = React.useState([])

  React.useEffect(() => {
    const loadImages = async () => {
      if (!userEmail) return
      if (localStorage.getItem("home-photos")) {
        const cachedImages = JSON.parse(localStorage.getItem("home-photos"))
        setImages(cachedImages)
        return
      }
      const fetchedImages = await fechtAmbumPhotos(userEmail, "Inicio")
      console.log("fetchedImages", fetchedImages)
      localStorage.setItem("home-photos", JSON.stringify(fetchedImages))
      setImages(fetchedImages)
    }

    loadImages()
  }, [])

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xl"
    >
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img.id}>
            <div>
              <Card className="border-2 border-rose-400 rounded-lg">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover rounded-lg blur-md"
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
