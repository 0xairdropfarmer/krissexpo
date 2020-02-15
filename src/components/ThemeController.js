import React, { createContext, useState } from "react";

export const ThemeContext = createContext();
export const ThemeController = ({ children }) => {
  const [theme, setTheme] = useState(false);

  const toggleTheme = value => {
    if (value === true) {
      setTheme(true);
    } else {
      setTheme(false);
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
