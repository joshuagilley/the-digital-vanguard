export const isFirstDigitTwo = (number: number) => {
  const numStr = String(number);
  return numStr.charAt(0) === "2";
};

export const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target?.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file); // Or other read method based on your needs
  });
};
