import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

const AnimatedText = ({ tagsData }: { tagsData: string[] }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisibleIndex((prevIndex) => {
        if (prevIndex < tagsData.length - 1) {
          return prevIndex + 1;
        }
        clearInterval(intervalId);
        return prevIndex;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight="bold"
        color="brand.300"
        display="inline-block"
      >
        {tagsData?.slice(0, visibleIndex + 1).map((str, index) => (
          <Text
            as="span"
            key={index}
            display="inline-block"
            sx={{
              animation: `reveal 2s forwards ${index * 0.5}s`,
              whiteSpace: "nowrap",
              mr: "10px",
              opacity: 0,
              color: "brand.300",
            }}
          >
            {`#${str}`}
          </Text>
        ))}
      </Text>

      <style>
        {`
          @keyframes reveal {
            0% {
              opacity: 0; /* Start hidden */
            }
            100% {
              opacity: 1; /* Fade in */
            }
          }
        `}
      </style>
    </Box>
  );
};

export default AnimatedText;
