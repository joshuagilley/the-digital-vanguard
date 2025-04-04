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

const countOccurrences = (str: string, tag: string) => {
  const regex = new RegExp(tag, "g"); // 'g' for global search
  const matches = str.match(regex);
  return matches ? matches.length : 0;
};

export const rankTagsInString = (text: string, tags: string[]) => {
  const lowercasedString = text.toLowerCase();

  const tagCounts = tags.map((tag) => {
    const lowercasedTag = tag.toLowerCase();
    const count = countOccurrences(lowercasedString, lowercasedTag);
    return { tag: lowercasedTag, count };
  });

  tagCounts.sort((a, b) => b.count - a.count);

  return (
    tagCounts.find(({ count }) => count > 0)
      ? tagCounts.filter((tagCount) => tagCount.count > 0)
      : tagCounts
  )
    .slice(0, 10)
    .map(({ tag }) => tag);
};
