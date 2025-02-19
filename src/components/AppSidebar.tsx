
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  scenes: string[];
  currentScene: string;
  onSceneChange: (scene: string) => void;
}

export function AppSidebar({ scenes, currentScene, onSceneChange }: AppSidebarProps) {
  if (scenes.length <= 1) return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Scenes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
