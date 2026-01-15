import Link from "next/link";

type Product = {
  id: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
};

type LowStockAlertProps = {
  products: Product[];
};

export default function LowStockAlert({ products }: LowStockAlertProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-red-800">⚠️ Low Stock Alert</h3>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
          {products.length} products
        </span>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center bg-white p-3 rounded"
          >
            <Link
              href={`/dashboard/product/${product.id}`}
              className="font-medium text-blue-500 hover:underline"
            >
              {product.name}
            </Link>
            <div className="text-right">
              <span className="text-red-600 font-bold">{product.stock}</span>
              <span className="text-gray-500 text-sm">
                {" "}
                / {product.lowStockThreshold} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
