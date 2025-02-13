import { themeFromImage, hexFromArgb } from '@material/material-color-utilities';

browser.tabs.onActivated.addListener(() => {
  applyThemeToActiveTab();
});

browser.tabs.onUpdated.addListener(() => {
  applyThemeToActiveTab();
});

const applyThemeToActiveTab = () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const activeTab = tabs[0];
    const favIconImage = new Image();
    try {
      favIconImage.src = activeTab.favIconUrl;
      favIconImage.onload = () => {
        updateTheme(favIconImage, activeTab.windowId);
      };
    } catch (error) {
      console.log(error);
      // apply default theme
    }
  });
};

const updateTheme = async (image, windowId) => {
  let theme = await themeFromImage(image);
  let palette = JSON.parse(JSON.stringify(theme.schemes));

  // convert colors from argb to hex
  for (let i in palette) for (let j in palette[i]) palette[i][j] = hexFromArgb(palette[i][j]);

  const browserTheme = { colors: {} };

  browserTheme.colors.frame = palette.light.primary;
  browserTheme.colors.tab_background_text = palette.light.onPrimary;

  browserTheme.colors.tab_selected = palette.light.primaryContainer;
  browserTheme.colors.tab_text = palette.light.onPrimaryContainer;
  browserTheme.colors.tab_line = palette.light.primary;

  browserTheme.colors.toolbar_filed = palette.light.surface;
  browserTheme.colors.toolbar_filed_focus = palette.light.surface;
  browserTheme.colors.toolbar_field_border_focus = palette.light.outline;

  browserTheme.colors.popup = palette.light.surface;
  browserTheme.colors.popup_text = palette.light.onSurface;

  browserTheme.colors.toolbar = palette.light.secondaryContainer;
  browserTheme.colors.bookmark_text = palette.light.onSecondaryContainer;

  browser.theme.update(windowId, browserTheme);
};
