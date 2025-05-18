"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Users,
  Settings,
  GraduationCap,
  Home,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Dilemas",
      icon: BookOpen,
      href: "/dilemmas",
      active: pathname === "/dilemmas" || pathname.startsWith("/dilemmas/") && !pathname.includes("pandora-box"),
    },
    {
      label: "Caixa de Pandora",
      icon: Package,
      href: "/dilemmas/pandora-box",
      active: pathname === "/dilemmas/pandora-box",
    },
    {
      label: "Discussões",
      icon: MessageSquare,
      href: "/discussions",
      active: pathname === "/discussions" || pathname.startsWith("/discussions/"),
    },
    {
      label: "Comunidade",
      icon: Users,
      href: "/community",
      active: pathname === "/community",
    },
    {
      label: "Aprendizado",
      icon: GraduationCap,
      href: "/learning",
      active: pathname === "/learning",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "pb-12 min-h-screen border-r bg-background",
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link
            href="/dashboard"
            className="flex items-center mb-8 pl-2"
          >
            <h2 className="text-xl font-bold">D-Lemma</h2>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
              >
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}