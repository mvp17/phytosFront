export const getTotalProductByTotalArea = (
  totalAreaPolygons: number,
  productDensity: number
) => {
  return Math.round(totalAreaPolygons * productDensity);
};
