import { cva } from "class-variance-authority";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  variant?: "primary" | "secondary" | "accent";
}

const iconContainerVariants = cva(
  "rounded-lg p-3 mr-3",
  {
    variants: {
      variant: {
        primary: "bg-primary/15",
        secondary: "bg-secondary/15",
        accent: "bg-accent/15",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const iconVariants = cva(
  "text-xl",
  {
    variants: {
      variant: {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export default function StatsCard({ title, value, icon, trend, variant = "primary" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-light hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={iconContainerVariants({ variant })}>
          <i className={`${icon} ${iconVariants({ variant })}`}></i>
        </div>
        <div>
          <p className="text-neutral-medium text-sm font-medium">{title}</p>
          <h3 className="font-heading font-bold text-2xl">{value}</h3>
        </div>
      </div>
      {trend && (
        <div className={`mt-3 ${trend.positive ? 'text-success' : 'text-danger'} text-sm font-medium flex items-center`}>
          <i className={`${trend.positive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} mr-1`}></i> 
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
