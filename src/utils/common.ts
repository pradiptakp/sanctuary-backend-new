export const lpad = (s: string) => {
  const width = 3;
  const char = "0";
  return s.length >= width
    ? s
    : (new Array(width).join(char) + s).slice(-width);
};

export const getLastID = (arr: { id: string }[]) => {
  const lastItem = arr[arr.length - 1];
  const newId = parseInt(lastItem.id.split(":")[3]) + 1;
  return lpad(newId.toString());
};
