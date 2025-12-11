// VIEW LAYER: App sidebar component

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
    <Sidebar className="!w-48 border-r border-border">
      <SidebarHeader className="border-b border-border">
        <SidebarMenuButton
          onClick={onGoBack}
          className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <ArrowLeft size={16} />
          <span>Tillbaka</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-display text-muted-foreground">Scener</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onSceneChange(null)}
                  className={currentScene === null ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"}
                >
                  <span>Alla scener</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {scenes.map((sceneNum) => (
                <SidebarMenuItem key={sceneNum}>
                  <SidebarMenuButton
                    onClick={() => onSceneChange(sceneNum)}
                    className={currentScene === sceneNum ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"}
                  >
                    <span>Scen {sceneNum}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {onConvert && (
        <SidebarFooter className="border-t border-border p-2">
          <SidebarMenuButton
            onClick={onConvert}
            className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <RefreshCw size={16} />
            <span>Konvertera format</span>
          </SidebarMenuButton>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
