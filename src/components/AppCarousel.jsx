import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { fetchDriveImages } from "../api/Drive"

import img1 from "/images/img1.jpeg"
import img2 from "/images/img2.jpeg"
import img3 from "/images/img3.jpeg"

export function AppCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))
  const [images, setImages] = React.useState([])

  // React.useEffect(() => {
  //   if(images.length > 0) return
  //   fetchDriveImages().then((files) => {
  //     setImages(files);
  //   });
  // }, []);

  if(images.length === 0) {
    setImages([
      { id: 1, name: "Image 1", webContentLink: img1 },
      { id: 2, name: "Image 2", webContentLink: img2 },
      { id: 3, name: "Image 3", webContentLink: img3 },
    ]);
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xl"
    >
    <CarouselContent>
      {images.map((img, index) => (
        <CarouselItem key={img.id}>
            <div className="">
                <Card className="border-2 border-rose-400 rounded-lg">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                    <img
                      src={img.webContentLink}
                      alt={img.name}
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
