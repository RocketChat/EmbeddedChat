import React, { useMemo } from "react";
import { Box, useTheme } from "@embeddedchat/ui-elements";
import { getFormatterStyles } from "./ChatInput.styles";
import SurfaceMenu from "../../components/SurfaceMenu/SurfaceMenu";

const Formatters = ({ formatters, ...props }) => {
  const styles = getFormatterStyles(useTheme());

  const options = useMemo(() => {
    return {
      bold: {
        label: "Bold",
        id: "bold",
        onClick: () => {},
        iconName: "bold",
        visible: true,
      },
      italic: {
        label: "Italic",
        id: "italic",
        onClick: () => {},
        iconName: "italic",
        visible: true,
      },
      strike: {
        label: "Strike",
        id: "strike",
        onClick: () => {},
        iconName: "strike",
        visible: true,
      },
      code: {
        label: "Code",
        id: "code",
        onClick: () => {},
        iconName: "code",
        visible: true,
      },
      multiline: {
        label: "Multiline",
        id: "multiline",
        onClick: () => {},
        iconName: "multiline",
        visible: true,
      },
    };
  }, []);

  const surfaceOptions = useMemo(() => {
    return (
      formatters.length > 0 &&
      formatters
        .map((item) => {
          if (item === "formatter") {
            return options.formatter;
          }
          if (options[item] && options[item].visible) {
            return {
              id: options[item].id,
              onClick: options[item].onClick,
              label: options[item].label,
              iconName: options[item].iconName,
            };
          }
          return null;
        })
        .filter((option) => option !== null)
    );
  }, [formatters, options]);

  return (
    <>
      {surfaceOptions?.length > 0 && (
        <Box css={styles.toolboxContainer}>
          <Box css={styles.toolbox} className="ec-formatter-box">
            <SurfaceMenu options={surfaceOptions} {...props} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Formatters;
