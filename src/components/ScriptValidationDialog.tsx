import { ValidationResult } from "@/utils/scriptValidator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScriptValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validationResult: ValidationResult | null;
  onContinue: () => void;
  onCancel: () => void;
}

export const ScriptValidationDialog = ({
  open,
  onOpenChange,
  validationResult,
  onContinue,
  onCancel,
}: ScriptValidationDialogProps) => {
  if (!validationResult) return null;

  const getIconForType = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getAlertVariant = (type: 'error' | 'warning' | 'info') => {
    return type === 'error' ? 'destructive' : 'default';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Script Validation Results</DialogTitle>
          <DialogDescription>
            Review the validation results for your script before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Section */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Script Statistics</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Format: {validationResult.stats.formatType}
              </Badge>
              <Badge variant="outline">
                Scenes: {validationResult.stats.sceneCount}
              </Badge>
              <Badge variant="outline">
                Characters: {validationResult.stats.characterCount}
              </Badge>
              <Badge variant="outline">
                Dialogue Lines: {validationResult.stats.dialogueLineCount}
              </Badge>
              {validationResult.stats.hasRollerSection && (
                <Badge variant="outline">Has ROLLER Section</Badge>
              )}
            </div>
          </div>

          {/* Issues Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              {validationResult.isValid ? 'Validation Passed' : 'Issues Found'}
            </h4>
            {validationResult.issues.map((issue, index) => (
              <Alert key={index} variant={getAlertVariant(issue.type)}>
                <div className="flex gap-2">
                  {getIconForType(issue.type)}
                  <div className="flex-1">
                    <AlertDescription>
                      <p className="font-medium">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-sm text-muted-foreground mt-1">
                          💡 {issue.suggestion}
                        </p>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>

          {/* Help Section */}
          {!validationResult.isValid && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Need help with script formatting?
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Check the script format instructions for examples of proper formatting.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onContinue}
            disabled={!validationResult.isValid}
          >
            {validationResult.isValid ? 'Continue with Script' : 'Fix Issues First'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
