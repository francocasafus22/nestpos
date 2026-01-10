"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSalesByDate } from "@/src/api";
import TransactionSummary from "./TransactionSummary";
import { formatCurrency } from "@/src/utils";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function TransactionFilter() {
  const [date, setDate] = useState<Value>(new Date());

  const formattedDate = format(date?.toString() || new Date(), "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: ["sales", formattedDate],
    queryFn: () => getSalesByDate(formattedDate),
  });

  const total =
    data?.transactions.reduce(
      (total, transaction) => total + +transaction.total,
      0,
    ) ?? 0;

  return (
    <div className="gap-5 mt-10">
      <div className="flex justify-center mb-5">
        <Calendar value={date} onChange={setDate} />
      </div>

      <div>
        {isLoading && <p className="text-center">Cargando...</p>}
        {data ? (
          data.transactions.length ? (
            data.transactions.map((transaction) => (
              <TransactionSummary
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <p className="text-lg text-center ">No hay ventas en esta fecha</p>
          )
        ) : null}

        <p className="my-5 text-lg font-bold text-right">
          Total del día: {""}
          <span className="font-normal">{formatCurrency(total)}</span>
        </p>
      </div>
    </div>
  );
}
