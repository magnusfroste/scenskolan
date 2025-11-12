
import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  scenes: string[];
  currentScene: string | null;
  onSceneChange: (scene: string | null) => void;
  onGoBack: () => void;
  onConvert?: () => void;
}

export function AppSidebar({ scenes, currentScene, onSceneChange, onGoBack, onConvert }: AppSidebarProps) {
  return (
    <Sidebar className="!w-48">
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
      {onConvert && (
        <SidebarFooter className="border-t p-2">
          <SidebarMenuButton
            onClick={onConvert}
            className="w-full flex items-center gap-2 text-sm"
          >
            <RefreshCw size={16} />
            <span>Convert Format</span>
          </SidebarMenuButton>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
