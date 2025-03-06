const convertCase = (variable: string, isCamel: boolean) => {
  const sep = variable.split("");
  let str = "";
  if (isCamel) {
    sep.forEach((char, i) => {
      if (char === "_") return;
      char = sep[i - 1] === "_" ? char.toUpperCase() : char;
      str += char;
    });
  } else {
    sep.forEach((char) => {
      char =
        char === char.toUpperCase() && char !== char.toLowerCase()
          ? `_${char.toLowerCase()}`
          : char;
      str += char;
    });
  }
  return str;
};

export const simpleObjectKeyConversion = (
  obj: { [key: string]: string },
  isCamel: boolean
) => {
  Object.keys(obj).forEach((oldKey) => {
    const newKey = convertCase(oldKey, isCamel);
    if (oldKey !== newKey) {
      Object.defineProperty(
        obj,
        newKey,
        Object.getOwnPropertyDescriptor(obj, oldKey)!
      );
      delete obj[oldKey];
    }
  });
  return obj;
};
