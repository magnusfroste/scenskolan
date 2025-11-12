import { useState } from "react";
import { ParsedScript } from "@/types/script";
import { convertScriptFormat, detectCurrentFormat, ScriptFormat } from "@/utils/scriptConverter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScriptConverterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parsedScript: ParsedScript | null;
}

export const ScriptConverterDialog = ({
  open,
  onOpenChange,
  parsedScript,
}: ScriptConverterDialogProps) => {
  const { toast } = useToast();
  const [targetFormat, setTargetFormat] = useState<ScriptFormat>('theatrical');
  const [includeRoller, setIncludeRoller] = useState(true);
  const [useMarkdown, setUseMarkdown] = useState(false);
  const [theaterName, setTheaterName] = useState('');
  const [copied, setCopied] = useState(false);

  if (!parsedScript) return null;

  const currentFormat = detectCurrentFormat(parsedScript);
  const convertedScript = convertScriptFormat(parsedScript, {
    targetFormat,
    includeRollerSection: includeRoller,
    useMarkdownHeaders: useMarkdown,
    theaterName: theaterName.trim() || undefined,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(convertedScript);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The converted script has been copied.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([convertedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${targetFormat}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: `Script downloaded as script-${targetFormat}.txt`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Convert Script Format</DialogTitle>
          <DialogDescription>
            Current format: <span className="font-semibold">{currentFormat}</span>. 
            Convert your script to a different format with customization options.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Conversion Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target Format</Label>
              <RadioGroup value={targetFormat} onValueChange={(v) => setTargetFormat(v as ScriptFormat)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="simple" id="simple" />
                  <Label htmlFor="simple" className="font-normal cursor-pointer">
                    Simple Format - Basic dialogue format for practice and rehearsal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="theatrical" id="theatrical" />
                  <Label htmlFor="theatrical" className="font-normal cursor-pointer">
                    Theatrical Format - Professional format with ROLLER section and formatting
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Theatrical Options */}
            {targetFormat === 'theatrical' && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="flex items-center justify-between">
                  <Label htmlFor="roller-switch" className="cursor-pointer">
                    Include ROLLER section (character-actor pairs)
                  </Label>
                  <Switch
                    id="roller-switch"
                    checked={includeRoller}
                    onCheckedChange={setIncludeRoller}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="markdown-switch" className="cursor-pointer">
                    Use markdown headers for character names
                  </Label>
                  <Switch
                    id="markdown-switch"
                    checked={useMarkdown}
                    onCheckedChange={setUseMarkdown}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theater-name">
                    Play/Theater Name (optional)
                  </Label>
                  <Input
                    id="theater-name"
                    placeholder="e.g., Mord på Pensionat Sjöborren"
                    value={theaterName}
                    onChange={(e) => setTheaterName(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <Tabs defaultValue="converted" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="original" className="flex-1">Original</TabsTrigger>
                <TabsTrigger value="converted" className="flex-1">Converted</TabsTrigger>
              </TabsList>
              <TabsContent value="original" className="mt-2">
                <Textarea
                  readOnly
                  value={convertScriptFormat(parsedScript, {
                    targetFormat: currentFormat,
                    includeRollerSection: true,
                  })}
                  className="font-mono text-sm h-64 resize-none"
                />
              </TabsContent>
              <TabsContent value="converted" className="mt-2">
                <Textarea
                  readOnly
                  value={convertedScript}
                  className="font-mono text-sm h-64 resize-none"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
