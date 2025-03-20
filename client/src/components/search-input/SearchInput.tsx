import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { User } from "types/user";

const MotionBox = motion(Box);

interface Props {
  data: User[];
  // eslint-disable-next-line no-unused-vars
  handleNavigate: (userId: string) => void;
}

export default function SearchInput({ data, handleNavigate }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredDevelopers = data.filter(({ username }) =>
    username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onAnimationComplete={() => setIsVisible(true)}
      maxW="400px"
      position="relative"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={SearchIcon} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search developers..."
          bg="gray.900"
          color="white"
          border="1px solid"
          borderColor="gray.600"
          _focus={{
            borderColor: "#ea80fc",
            boxShadow: "0 0 10px rgba(234, 128, 252, 0.8)",
          }}
          transition="all 0.3s ease-in-out"
          opacity={isVisible ? 1 : 0}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </InputGroup>
      {showDropdown && (
        <List
          mt={2}
          bg="brand.500"
          borderRadius="md"
          boxShadow="lg"
          p={2}
          maxH="200px"
          overflowY="auto"
          border="1px solid"
          borderColor="brand.600"
          position="absolute"
          width="100%"
          color="brand.100"
          zIndex={10}
        >
          {filteredDevelopers.length > 0 ? (
            filteredDevelopers.map(({ username, userId }, index) => (
              <ListItem
                key={index}
                p={2}
                onClick={() => handleNavigate(userId)}
                _hover={{
                  bg: "brand.700",
                  color: "brand.200",
                  cursor: "pointer",
                }}
              >
                {username}
              </ListItem>
            ))
          ) : (
            <ListItem p={2} color="gray.500">
              No developers found
            </ListItem>
          )}
        </List>
      )}
    </MotionBox>
  );
}
