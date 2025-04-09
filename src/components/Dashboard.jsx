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
      <div className="flex-1 flex items-center justify-end p-4">
        <div className="w-full max-w-xl mr-20">
          <AppCarousel />
        </div>
      </div>
    </div>
  );
}