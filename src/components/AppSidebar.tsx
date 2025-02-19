
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  scenes: string[];
  currentScene: string | null;
  onSceneChange: (scene: string | null) => void;
  onGoBack: () => void;
}

export function AppSidebar({ scenes, currentScene, onSceneChange, onGoBack }: AppSidebarProps) {
  if (scenes.length <= 1) return null;

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SidebarMenuButton
          onClick={onGoBack}
          className="w-full flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          <span>Back to upload</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Scenes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onSceneChange(null)}
                  className={currentScene === null ? "bg-primary/10" : ""}
                >
                  <span>All Scenes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {scenes.map((sceneNum) => (
                <SidebarMenuItem key={sceneNum}>
                  <SidebarMenuButton
                    onClick={() => onSceneChange(sceneNum)}
                    className={currentScene === sceneNum ? "bg-primary/10" : ""}
                  >
                    <span>Scene {sceneNum}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
