
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
}

export const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};
