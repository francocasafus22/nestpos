import TransactionFilter from "@/components/transactions/TransactionFilter";
import Heading from "@/components/ui/Heading";
import { format } from "date-fns";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getSalesByDate } from "@/src/api";

export default async function SalesPage() {
  const queryClient = new QueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  await queryClient.prefetchQuery({
    queryKey: ["sales", today],
    queryFn: () => getSalesByDate(today),
  });

  return (
    <>
      <Heading>Ventas</Heading>
      <p>
        En esta sección aparecerán las ventas, utiliza el calendario para
        filtrar por fecha.
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionFilter />
      </HydrationBoundary>
    </>
  );
}
