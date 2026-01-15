import prisma from "@/lib/db";
import { CreateProduct } from "../action/addproduct";

export default async function ProductForm() {
  const categories = await prisma.category.findMany();

  return (
    <>
      <form action={CreateProduct}>
        <input type="text" name="name" placeholder="Enter product name" />

        <input type="text" name="description" placeholder="Enter description" />

        <input type="text" name="sku" placeholder="Enter stock ID" />

        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Enter price"
        />

        <input type="number" name="stock" step="1" placeholder="Enter units" />

        <select name="categoryId">
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">Create Product</button>
      </form>
    </>
  );
}
