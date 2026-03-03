export const numberToWords = (num: number): string => {
  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n: number): string => {
    if ((n = Math.floor(n)).toString().length > 9) return "overflow";
    const nStr = ("000000000" + n).substr(-9);
    const nArr: any = nStr.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArr) return "";
    let str = "";
    str +=
        Number(nArr[1]) !== 0
            ? (a[Number(nArr[1])] || b[nArr[1][0]] + " " + a[nArr[1][1]]) + "Crore "
            : "";
    str +=
        Number(nArr[2]) !== 0
            ? (a[Number(nArr[2])] || b[nArr[2][0]] + " " + a[nArr[2][1]]) + "Lakh "
            : "";
    str +=
        Number(nArr[3]) !== 0
            ? (a[Number(nArr[3])] || b[nArr[3][0]] + " " + a[nArr[3][1]]) + "Thousand "
            : "";
    str +=
        Number(nArr[4]) !== 0
            ? (a[Number(nArr[4])] || b[nArr[4][0]] + " " + a[nArr[4][1]]) + "Hundred "
            : "";
    str +=
        Number(nArr[5]) !== 0
            ? (str !== "" ? "and " : "") +
            (a[Number(nArr[5])] || b[nArr[5][0]] + " " + a[nArr[5][1]])
            : "";
    return str;
  };

  const [integer, fraction] = num.toFixed(2).split(".");
  let result = inWords(Number(integer));
  
  if (Number(fraction) > 0) {
    result += " & Cents " + inWords(Number(fraction));
  } else {
    result += " & Cents Zero";
  }

  return result.trim() + " Only.";
};
