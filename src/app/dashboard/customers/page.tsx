import PageHeader from "@/components/PageHeader";
import CustomerSearch from "@/components/CustomerSearch";
import prisma from "@/lib/db";
import Link from "next/link";

type CustomerPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: CustomerPageProps) {
  const { search } = await searchParams;

  const customers = await prisma.customer.findMany({
    where: {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      addresses: true,
      orders: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <PageHeader title="Customers" description="View customer information" />

      <CustomerSearch />

      <p className="mb-4 text-gray-600">{customers.length} customers found</p>

      {customers.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {customers.map((customer) => {
            const defaultAddress = customer.addresses.find((a) => a.isDefault);

            return (
              <div key={customer.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="font-bold text-lg hover:text-blue-500"
                    >
                      {customer.firstName} {customer.lastName}
                    </Link>
                    <p className="text-gray-600">{customer.email}</p>
                    <p className="text-gray-600">
                      {customer.phone ?? "No phone"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {customer.orders.length} orders
                    </p>
                  </div>
                </div>

                {defaultAddress && (
                  <p className="mt-2 text-sm text-gray-600">
                    📍 {defaultAddress.city}, {defaultAddress.state}
                  </p>
                )}

                <div className="mt-3">
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
