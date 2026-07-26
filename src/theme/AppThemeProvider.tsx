import { useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useAppSelector } from "../store/hooks";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mode, baseStyle, defaultBackgroundColor } = useAppSelector(
    (s) => s.theme,
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: { default: defaultBackgroundColor || undefined },
        },
        typography: {
          fontSize: baseStyle.fontSize ? parseInt(baseStyle.fontSize, 10) : 14,
        },
      }),
    [mode, baseStyle.fontSize, defaultBackgroundColor],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
