import { submitOrder } from "@/actions/submit-order-action";
import { useStore } from "@/src/store";
import { clear } from "node:console";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export default function SubmitOrderForm() {
  const { contents, total, clearCart } = useStore((state) => state);
  const coupon = useStore((state) => state.coupon.name);

  const order = {
    total,
    coupon,
    contents,
  };

  const submitOrderWithData = submitOrder.bind(null, order);

  const [state, dispatch, isLoading] = useActionState(submitOrderWithData, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      clearCart();
    }
    if (state.errors) {
      state.errors.map((error) => toast.error(error));
    }
  }, [state]);

  return (
    <form action={dispatch}>
      <button
        type="submit"
        className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold p-3 rounded-lg cursor-pointer"
      >
        {isLoading ? "Cargando..." : "Confirmar Compra"}
      </button>
    </form>
  );
}
