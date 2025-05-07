import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface SessionItemProps {
  time: string;
  title: string;
  subtitle: string;
  variant?: "primary" | "secondary" | "accent";
  onEdit?: () => void;
  onDelete?: () => void;
}

const colorVariants = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary", 
  accent: "bg-accent/15 text-accent"
};

export default function SessionItem({ 
  time, 
  title, 
  subtitle, 
  variant = "primary",
  onEdit,
  onDelete
}: SessionItemProps) {
  const colorClass = colorVariants[variant];

  return (
    <div className="p-4 hover:bg-neutral-lightest transition-colors rounded-lg border border-transparent hover:border-neutral-light">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${colorClass} rounded-lg p-2 flex items-center justify-center mr-3 w-12 h-12 shadow-sm`}>
            <span className="font-heading font-medium">{time}</span>
          </div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-neutral-medium text-sm">{subtitle}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-neutral-medium hover:text-neutral-dark"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <i className="ri-edit-line mr-2"></i> Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <i className="ri-delete-bin-line mr-2"></i> Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
