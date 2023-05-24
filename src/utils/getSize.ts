export default function getSize(size: number) {
  if (1 <= size && size <= 200) {
    return size;
  } else {
    if (0 <= size) {
      return 1;
    }
    if (200 >= size) {
      return 200;
    }
  }
  return 25;
}
