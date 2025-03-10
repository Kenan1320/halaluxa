import { useQuery } from "@tanstack/react-query";
import { getShops } from "@/services/shopService";

const Browse = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getShops()
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Browse Shops</h1>
      {products?.map((product) => (
        <div key={product.id}>
          {product.name}
        </div>
      ))}
    </div>
  );
};

export default Browse;
