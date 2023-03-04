function sortIcon(key, direction) {
  switch (key) {
    case "banco":
      if (direction === "ascending") {
        return "fa-sort-up";
      } else {
        return "fa-sort-down";
      }
    case "compra":
      if (direction === "ascending") {
        return "fa-sort-up";
      } else {
        return "fa-sort-down";
      }
    case "venta":
      if (direction === "ascending") {
        return "fa-sort-up";
      } else {
        return "fa-sort-down";
      }
    case "ventaTot":
      if (direction === "ascending") {
        return "fa-sort-up";
      } else {
        return "fa-sort-down";
      }
    case "coin":
      if (direction === "ascending") {
        return "fa-sort-up";
      } else {
        return "fa-sort-down";
      }
    default:
      return "fa-sort";
  }
}

export default sortIcon;
