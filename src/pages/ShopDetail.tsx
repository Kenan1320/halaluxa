
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById } from '@/services/shopService';
import { ShopDetails } from '@/types/shop';
import { ShopHeader } from '@/components/shop/ShopHeader';
import ShopProductList from '@/components/shop/ShopProductList';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShopDetails = async () => {
      setIsLoading(true);
      if (shopId) {
        const shop = await getShopById(shopId);
        if (shop) {
          // TODO: This is temporary until we update the backend
          const shopDetails: ShopDetails = {
            ...shop,
            categories: [],
            deliveryInfo: {
              isDeliveryAvailable: true,
              isPickupAvailable: true,
              deliveryFee: 1.49,
              estimatedTime: '10-15 min',
            },
            workingHours: {
              open: '10:30 AM',
              close: '10:00 PM',
            },
            isGroupOrderEnabled: true,
            rating: {
              average: 4.5,
              count: 500
            }
          };
          setShopDetails(shopDetails);
        }
      }
      setIsLoading(false);
    };

    loadShopDetails();
  }, [shopId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="w-full h-48" />
        <div className="p-4">
          <Skeleton className="w-40 h-8 mb-2" />
          <Skeleton className="w-24 h-4 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      </div>
    );
  }

  if (!shopDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Shop not found</h2>
          <p className="text-muted-foreground">The shop you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader shop={shopDetails} />
      
      <main className="container mx-auto px-4 py-6">
        {shopDetails.categories.length > 0 ? (
          shopDetails.categories.map((category) => (
            <section key={category.id} className="mb-8">
              <h2 className="text-xl font-bold mb-4">{category.name}</h2>
              <ShopProductList shopId={shopId} products={category.products} />
            </section>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">This shop hasn't added any products yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
