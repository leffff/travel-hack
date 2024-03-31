export function getYearDeclension(years: number) {
  if (years === 1) {
    return "год";
  } else if (years >= 2 && years <= 4) {
    return "года";
  } else {
    return "лет";
  }
}

export function getDonationDeclension(count: number) {
  if (count === 1) {
    return "донация";
  } else if (count >= 2 && count <= 4) {
    return "донации";
  } else {
    return "донаций";
  }
}
