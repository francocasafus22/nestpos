import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  baseURL: string;
};

export default function Pagination({
  page,
  totalPages,
  baseURL,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center py-10 gap-2">
      {page > 1 && (
        <Link
          href={`${baseURL}?page=${page - 1}`}
          className="px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 rounded-lg"
        >
          &laquo;
        </Link>
      )}
      {pages.map((currentPage) => (
        <Link
          key={currentPage}
          href={`${baseURL}?page=${currentPage}`}
          className={`${currentPage === page && "bg-green-500 font-bold text-white"} px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 rounded-lg`}
        >
          {currentPage}
        </Link>
      ))}
      {page < pages.length && (
        <Link
          href={`${baseURL}?page=${page + 1}`}
          className="px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 rounded-lg"
        >
          &raquo;
        </Link>
      )}
    </nav>
  );
}
