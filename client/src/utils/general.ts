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

export const editArticle = async (
  changeText: string,
  property: string,
  id: string,
  aId: string,
  // eslint-disable-next-line no-unused-vars
  handleToast: (issue: string) => void,
  refetch: () => void
) => {
  const credential = localStorage.getItem("googleCredential");
  const res = await fetch(`/api/users/${id}/articles/${aId}`, {
    method: "PUT",
    body: JSON.stringify({ changeText, property }),
    headers: {
      Authorization: `Bearer ${credential}`,
      "Content-Type": "application/json",
    },
  });
  const issue = JSON.stringify(`Status: ${res.status} at ${res.url}`);
  if (res.status !== 200) {
    handleToast(issue);
  } else {
    refetch();
  }
};
