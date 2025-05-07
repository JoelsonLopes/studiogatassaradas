import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkoutCardProps {
  title: string;
  level: string;
  duration: string;
  studentsCount: number;
  image: string;
  tag?: {
    label: string;
    variant: "primary" | "secondary" | "accent" | "neutral";
  };
  onEdit?: () => void;
}

const tagVariants = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  accent: "bg-accent/15 text-accent",
  neutral: "bg-neutral-medium/15 text-neutral-medium"
};

export default function WorkoutCard({ 
  title, 
  level, 
  duration, 
  studentsCount, 
  image, 
  tag,
  onEdit
}: WorkoutCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-light workout-card group hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden h-40">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-75"></div>
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h3 className="font-heading font-semibold">{title}</h3>
          <p className="text-xs">Nível {level}</p>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between text-sm text-neutral-medium mb-2">
          <span className="flex items-center">
            <i className="ri-time-line mr-1"></i> {duration}
          </span>
          <span className="flex items-center">
            <i className="ri-user-line mr-1"></i> {studentsCount} alunas
          </span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          {tag && (
            <Badge 
              className={tagVariants[tag.variant]}
              variant="outline"
            >
              {tag.label}
            </Badge>
          )}
          {onEdit && (
            <Button 
              onClick={onEdit} 
              variant="ghost" 
              size="icon"
              className="text-primary hover:text-primary/80"
            >
              <i className="ri-edit-line"></i>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
