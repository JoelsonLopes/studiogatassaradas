import { Badge } from "@/components/ui/badge";

interface PaymentItemProps {
  plan: string;
  studentName: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
}

const statusConfig = {
  paid: {
    label: "Pago",
    icon: "ri-checkbox-circle-fill",
    className: "text-success"
  },
  pending: {
    label: "Pendente",
    icon: "ri-error-warning-fill",
    className: "text-warning"
  },
  overdue: {
    label: "Atrasado",
    icon: "ri-error-warning-fill",
    className: "text-danger"
  }
};

export default function PaymentItem({ plan, studentName, date, amount, status }: PaymentItemProps) {
  const { label, icon, className } = statusConfig[status];

  return (
    <div className="p-4 hover:bg-neutral-lightest transition-colors rounded-lg border border-transparent hover:border-neutral-light">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{plan}</h4>
          <p className="text-neutral-medium text-sm">{studentName}</p>
          <p className="text-neutral-medium text-xs mt-1">{date}</p>
        </div>
        <div className="text-right">
          <span className="font-medium text-lg">{amount}</span>
          <div className={`${className} text-xs mt-1 flex items-center justify-end font-medium`}>
            <i className={`${icon} mr-1`}></i> {label}
          </div>
        </div>
      </div>
    </div>
  );
}
