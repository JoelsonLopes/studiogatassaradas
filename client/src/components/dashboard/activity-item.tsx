import { Badge } from "@/components/ui/badge";

interface ActivityItemProps {
  user: {
    name: string;
    profilePicture?: string;
  };
  action: string;
  timestamp: string;
  status: "completed" | "payment" | "new" | "canceled";
}

const statusConfig = {
  completed: {
    label: "Completado",
    variant: "success"
  },
  payment: {
    label: "Pagamento",
    variant: "warning"
  },
  new: {
    label: "Nova aluna",
    variant: "primary"
  },
  canceled: {
    label: "Cancelamento",
    variant: "destructive"
  }
};

export default function ActivityItem({ user, action, timestamp, status }: ActivityItemProps) {
  const { label, variant } = statusConfig[status];

  return (
    <div className="p-4 hover:bg-neutral-lightest transition-colors">
      <div className="flex items-start">
        {user.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt={`Foto de perfil de ${user.name}`} 
            className="w-10 h-10 rounded-full object-cover mr-3" 
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white mr-3">
            {user.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center">
            <h4 className="font-medium">{user.name}</h4>
            <Badge 
              className={`ml-2 bg-${variant} bg-opacity-10 text-${variant} rounded-full px-2 py-1`}
              variant={variant as any}
            >
              {label}
            </Badge>
          </div>
          <p className="text-neutral-medium text-sm mt-1">{action}</p>
          <p className="text-neutral-medium text-xs mt-1">{timestamp}</p>
        </div>
      </div>
    </div>
  );
}
