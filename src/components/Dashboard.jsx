import { AppSidebar } from "@/components/AppSidebar";
import { AppCarousel } from "@/components/AppCarousel";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar a la izquierda */}
      <div className="w-1/4">
        <AppSidebar />
      </div>

      

      {/* Carrusel a la derecha */}
      <div className="flex-1 flex items-center justify-center p-4">
  <div className="m-8 flex items-center justify-center p-4 ring-2 ring-rose-200 rounded-lg shadow-lg bg-gradient-to-br from-rose-100 to-rose-300 text-2xl font-serif text-center text-rose-800 leading-relaxed tracking-wide">
    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
      Holi mi vida, disfruta esta aplicación tanto como yo disfrute haciéndola y 
      como yo disfruto contigo todos los días de mi vida.
    </p>
    <p className="mt-4">
      Quiero ir expandiendo esta aplicación y que sea un lugar donde podamos compartir nuestros momentos juntos, además de que sea útil para ti mi vida.
    </p>
    <br />
    <p className="text-4xl font-extrabold text-rose-600 mt-4">
      Te amo ❣️
    </p>
  </div>
  <div className="w-full max-w-xl mr-20">
    <AppCarousel />
  </div>
</div>
    </div>
  );
}