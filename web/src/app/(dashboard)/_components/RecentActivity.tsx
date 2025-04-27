import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const RecentActivity = () => {
  const activities = [
    {
      id: "1",
      user: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+$1,999.00",
    },
    {
      id: "2",
      user: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "+$39.00",
    },
    {
      id: "3",
      user: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "+$299.00",
    },
    {
      id: "4",
      user: "William Kim",
      email: "will@email.com",
      amount: "+$99.00",
    },
    {
      id: "5",
      user: "Sofia Davis",
      email: "sofia.davis@email.com",
      amount: "+$39.00",
    },
  ]

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden xl:table-column">Email</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="font-medium">{activity.user}</div>
                </TableCell>
                <TableCell className="hidden xl:table-column">
                  {activity.email}
                </TableCell>
                <TableCell className="text-right">{activity.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default RecentActivity