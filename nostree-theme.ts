import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const nostreeTheme: CustomThemeConfig = {
  name: "nostree-theme",
  properties: {
    // =~= Theme Properties =~=
    "--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    "--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    "--theme-font-color-base": "0 0 0",
    "--theme-font-color-dark": "255 255 255",
    "--theme-rounded-base": "9999px",
    "--theme-rounded-container": "16px",
    "--theme-border-base": "1px",
    // =~= Theme On-X Colors =~=
    "--on-primary": "0 0 0",
    "--on-secondary": "0 0 0",
    "--on-tertiary": "0 0 0",
    "--on-success": "0 0 0",
    "--on-warning": "0 0 0",
    "--on-error": "0 0 0",
    "--on-surface": "255 255 255",
    // =~= Theme Colors  =~=
    // primary | #ffa348
    "--color-primary-50": "255 241 228", // #fff1e4
    "--color-primary-100": "255 237 218", // #ffedda
    "--color-primary-200": "255 232 209", // #ffe8d1
    "--color-primary-300": "255 218 182", // #ffdab6
    "--color-primary-400": "255 191 127", // #ffbf7f
    "--color-primary-500": "255 163 72", // #ffa348
    "--color-primary-600": "230 147 65", // #e69341
    "--color-primary-700": "191 122 54", // #bf7a36
    "--color-primary-800": "153 98 43", // #99622b
    "--color-primary-900": "125 80 35", // #7d5023
    // secondary | #6bc187
    "--color-secondary-50": "233 246 237", // #e9f6ed
    "--color-secondary-100": "225 243 231", // #e1f3e7
    "--color-secondary-200": "218 240 225", // #daf0e1
    "--color-secondary-300": "196 230 207", // #c4e6cf
    "--color-secondary-400": "151 212 171", // #97d4ab
    "--color-secondary-500": "107 193 135", // #6bc187
    "--color-secondary-600": "96 174 122", // #60ae7a
    "--color-secondary-700": "80 145 101", // #509165
    "--color-secondary-800": "64 116 81", // #407451
    "--color-secondary-900": "52 95 66", // #345f42
    // tertiary | #3584e4
    "--color-tertiary-50": "225 237 251", // #e1edfb
    "--color-tertiary-100": "215 230 250", // #d7e6fa
    "--color-tertiary-200": "205 224 248", // #cde0f8
    "--color-tertiary-300": "174 206 244", // #aecef4
    "--color-tertiary-400": "114 169 236", // #72a9ec
    "--color-tertiary-500": "53 132 228", // #3584e4
    "--color-tertiary-600": "48 119 205", // #3077cd
    "--color-tertiary-700": "40 99 171", // #2863ab
    "--color-tertiary-800": "32 79 137", // #204f89
    "--color-tertiary-900": "26 65 112", // #1a4170
    // success | #6bc187
    "--color-success-50": "233 246 237", // #e9f6ed
    "--color-success-100": "225 243 231", // #e1f3e7
    "--color-success-200": "218 240 225", // #daf0e1
    "--color-success-300": "196 230 207", // #c4e6cf
    "--color-success-400": "151 212 171", // #97d4ab
    "--color-success-500": "107 193 135", // #6bc187
    "--color-success-600": "96 174 122", // #60ae7a
    "--color-success-700": "80 145 101", // #509165
    "--color-success-800": "64 116 81", // #407451
    "--color-success-900": "52 95 66", // #345f42
    // warning | #f8e45c
    "--color-warning-50": "254 251 231", // #fefbe7
    "--color-warning-100": "254 250 222", // #fefade
    "--color-warning-200": "253 248 214", // #fdf8d6
    "--color-warning-300": "252 244 190", // #fcf4be
    "--color-warning-400": "250 236 141", // #faec8d
    "--color-warning-500": "248 228 92", // #f8e45c
    "--color-warning-600": "223 205 83", // #dfcd53
    "--color-warning-700": "186 171 69", // #baab45
    "--color-warning-800": "149 137 55", // #958937
    "--color-warning-900": "122 112 45", // #7a702d
    // error | #f66151
    "--color-error-50": "254 231 229", // #fee7e5
    "--color-error-100": "253 223 220", // #fddfdc
    "--color-error-200": "253 216 212", // #fdd8d4
    "--color-error-300": "251 192 185", // #fbc0b9
    "--color-error-400": "249 144 133", // #f99085
    "--color-error-500": "246 97 81", // #f66151
    "--color-error-600": "221 87 73", // #dd5749
    "--color-error-700": "185 73 61", // #b9493d
    "--color-error-800": "148 58 49", // #943a31
    "--color-error-900": "121 48 40", // #793028
    // surface | #8743db
    "--color-surface-50": "237 227 250", // #ede3fa
    "--color-surface-100": "231 217 248", // #e7d9f8
    "--color-surface-200": "225 208 246", // #e1d0f6
    "--color-surface-300": "207 180 241", // #cfb4f1
    "--color-surface-400": "171 123 230", // #ab7be6
    "--color-surface-500": "135 67 219", // #8743db
    "--color-surface-600": "122 60 197", // #7a3cc5
    "--color-surface-700": "101 50 164", // #6532a4
    "--color-surface-800": "81 40 131", // #512883
    "--color-surface-900": "66 33 107", // #42216b
  },
};
