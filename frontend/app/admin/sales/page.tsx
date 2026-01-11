import TransactionFilter from "@/components/transactions/TransactionFilter";
import Heading from "@/components/ui/Heading";
import { format } from "date-fns";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getSalesByDate } from "@/src/api";
import { isValidPage } from "@/src/utils";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ page: string }>;

export default async function SalesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queryClient = new QueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { page } = await searchParams;
  if (!isValidPage(+page)) redirect("/admin/sales?page=1");

  await queryClient.prefetchQuery({
    queryKey: ["sales", today, page],
    queryFn: () => getSalesByDate(today, page),
  });

  return (
    <>
      <Heading>Ventas</Heading>
      <p>
        En esta sección aparecerán las ventas, utiliza el calendario para
        filtrar por fecha.
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionFilter page={page} />
      </HydrationBoundary>
    </>
  );
}
