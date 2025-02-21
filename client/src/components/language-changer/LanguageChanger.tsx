import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

function LanguageChanger() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu data-testid="language-changer">
      <MenuButton as={Button}>{t("languages.changeLanguage")}</MenuButton>
      <MenuList>
        <MenuItem onClick={() => changeLanguage("en")}>
          {t("languages.english")}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("fr")}>
          {t("languages.french")}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default LanguageChanger;
