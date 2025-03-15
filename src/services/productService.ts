
// Fix the deep type instantiation by simplifying the return type:
const response: ProductResponse = {
  data: products,
  error: null,
  filter: (predicate) => (products || []).filter(predicate)
};
return response;
