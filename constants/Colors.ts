
export const DARK_BACKGROUND = "#0F172A";
export const WHITE = "#FFFFFF";
export const SUBHEADER_TEXT = "#94A3B8";
export const PRIMARY_BUTTON_BG = "#1E293B";
export const PRIMARY_BUTTON_TEXT = "#FFFFFF";
export const ACCENT_COLOR = "rgba(99, 102, 241, 0.1)";
export const ACCENT_BORDER = "rgba(99, 102, 241, 0.2)";

const tintColorLight = '#8A7CFF';
const tintColorDark = '#8A7CFF';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    gradient: {
      primary: '#8A7CFF',
      secondary: '#6AACFF',
    }
  },
  dark: {
    text: '#fff',
    background: '#0A0A0F',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    gradient: {
      primary: '#8A7CFF',
      secondary: '#6AACFF',
    }
  },
};
