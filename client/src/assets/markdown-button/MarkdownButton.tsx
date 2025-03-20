import { IconButton } from "@chakra-ui/react";
import { FileText } from "lucide-react"; // Markdown button icon
import { motion } from "framer-motion";

const MotionIconButton = motion(IconButton);

const MarkdownButton = () => {
  return (
    <MotionIconButton
      aria-label="React Markdown Button"
      icon={<FileText size={34} />}
      variant="ghost"
      color="brand.300"
      _hover={{ bg: "brand.200" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        window.open("https://stackedit.io/app#", "_blank");
      }}
    />
  );
};

export default MarkdownButton;
