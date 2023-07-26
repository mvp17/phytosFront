export const thousandsHundredsTensUnitsNumberString = (value: string) => {
  var parts = value.split(",");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
};
