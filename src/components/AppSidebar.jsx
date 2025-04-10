import { Calendar, Home, Inbox, Search, Settings, ListCheck, icons } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider, // Importa SidebarProvider
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Página Principal",
    url: "/home",
    icon: Home,
  },
  {
    title: "Calendario",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Lista de tareas",
    url: "/tasklist",
    icon: ListCheck
  },
  {
    title: "Contraseñas",
    url: "/passwords",
    icon: icons.Lock,
  },
  {
    title: "Configuración",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <SidebarProvider className="w-64 h-full "> {/* Envuelve el Sidebar con SidebarProvider */}
      <Sidebar className="w-64 h-screen text-black ">
        <SidebarContent className="bg-rose-200">
          <SidebarGroup>
            <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-rose-300">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}