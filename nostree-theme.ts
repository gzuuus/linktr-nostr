import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const nostreeTheme: CustomThemeConfig = {
  name: "nostree-theme",
  properties: {
    // =~= Theme Properties =~=
    "--theme-font-family-base": `system-ui`,
    "--theme-font-family-heading": `system-ui`,
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
    "--on-error": "255 255 255",
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
    // secondary | #99c1f1
    "--color-secondary-50": "240 246 253", // #f0f6fd
    "--color-secondary-100": "235 243 252", // #ebf3fc
    "--color-secondary-200": "230 240 252", // #e6f0fc
    "--color-secondary-300": "214 230 249", // #d6e6f9
    "--color-secondary-400": "184 212 245", // #b8d4f5
    "--color-secondary-500": "153 193 241", // #99c1f1
    "--color-secondary-600": "138 174 217", // #8aaed9
    "--color-secondary-700": "115 145 181", // #7391b5
    "--color-secondary-800": "92 116 145", // #5c7491
    "--color-secondary-900": "75 95 118", // #4b5f76
    // tertiary | #5bc094
    "--color-tertiary-50": "230 246 239", // #e6f6ef
    "--color-tertiary-100": "222 242 234", // #def2ea
    "--color-tertiary-200": "214 239 228", // #d6efe4
    "--color-tertiary-300": "189 230 212", // #bde6d4
    "--color-tertiary-400": "140 211 180", // #8cd3b4
    "--color-tertiary-500": "91 192 148", // #5bc094
    "--color-tertiary-600": "82 173 133", // #52ad85
    "--color-tertiary-700": "68 144 111", // #44906f
    "--color-tertiary-800": "55 115 89", // #377359
    "--color-tertiary-900": "45 94 73", // #2d5e49
    // success | #2bd3d5
    "--color-success-50": "223 248 249", // #dff8f9
    "--color-success-100": "213 246 247", // #d5f6f7
    "--color-success-200": "202 244 245", // #caf4f5
    "--color-success-300": "170 237 238", // #aaedee
    "--color-success-400": "107 224 226", // #6be0e2
    "--color-success-500": "43 211 213", // #2bd3d5
    "--color-success-600": "39 190 192", // #27bec0
    "--color-success-700": "32 158 160", // #209ea0
    "--color-success-800": "26 127 128", // #1a7f80
    "--color-success-900": "21 103 104", // #156768
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
    // surface | #772ac0
    "--color-surface-50": "235 223 246", // #ebdff6
    "--color-surface-100": "228 212 242", // #e4d4f2
    "--color-surface-200": "221 202 239", // #ddcaef
    "--color-surface-300": "201 170 230", // #c9aae6
    "--color-surface-400": "160 106 211", // #a06ad3
    "--color-surface-500": "119 42 192", // #772ac0
    "--color-surface-600": "107 38 173", // #6b26ad
    "--color-surface-700": "89 32 144", // #592090
    "--color-surface-800": "71 25 115", // #471973
    "--color-surface-900": "58 21 94", // #3a155e
  },
};
// export const nostreeTheme: CustomThemeConfig = {
//     name: 'nostree-theme',
//     properties: {
// 		// =~= Theme Properties =~=
// 		"--theme-font-family-base": `system-ui`,
// 		"--theme-font-family-heading": `system-ui`,
// 		"--theme-font-color-base": "0 0 0",
// 		"--theme-font-color-dark": "255 255 255",
// 		"--theme-rounded-base": "9999px",
// 		"--theme-rounded-container": "8px",
// 		"--theme-border-base": "1px",
// 		// =~= Theme On-X Colors =~=
// 		"--on-primary": "0 0 0",
// 		"--on-secondary": "0 0 0",
// 		"--on-tertiary": "0 0 0",
// 		"--on-success": "0 0 0",
// 		"--on-warning": "0 0 0",
// 		"--on-error": "0 0 0",
// 		"--on-surface": "0 0 0",
// 		// =~= Theme Colors  =~=
// 		// primary | #ffa348
// 		"--color-primary-50": "255 241 228", // #fff1e4
// 		"--color-primary-100": "255 237 218", // #ffedda
// 		"--color-primary-200": "255 232 209", // #ffe8d1
// 		"--color-primary-300": "255 218 182", // #ffdab6
// 		"--color-primary-400": "255 191 127", // #ffbf7f
// 		"--color-primary-500": "255 163 72", // #ffa348
// 		"--color-primary-600": "230 147 65", // #e69341
// 		"--color-primary-700": "191 122 54", // #bf7a36
// 		"--color-primary-800": "153 98 43", // #99622b
// 		"--color-primary-900": "125 80 35", // #7d5023
// 		// secondary | #dc8add
// 		"--color-secondary-50": "250 237 250", // #faedfa
// 		"--color-secondary-100": "248 232 248", // #f8e8f8
// 		"--color-secondary-200": "246 226 247", // #f6e2f7
// 		"--color-secondary-300": "241 208 241", // #f1d0f1
// 		"--color-secondary-400": "231 173 231", // #e7ade7
// 		"--color-secondary-500": "220 138 221", // #dc8add
// 		"--color-secondary-600": "198 124 199", // #c67cc7
// 		"--color-secondary-700": "165 104 166", // #a568a6
// 		"--color-secondary-800": "132 83 133", // #845385
// 		"--color-secondary-900": "108 68 108", // #6c446c
// 		// tertiary | #96847a
// 		"--color-tertiary-50": "239 237 235", // #efedeb
// 		"--color-tertiary-100": "234 230 228", // #eae6e4
// 		"--color-tertiary-200": "229 224 222", // #e5e0de
// 		"--color-tertiary-300": "213 206 202", // #d5ceca
// 		"--color-tertiary-400": "182 169 162", // #b6a9a2
// 		"--color-tertiary-500": "150 132 122", // #96847a
// 		"--color-tertiary-600": "135 119 110", // #87776e
// 		"--color-tertiary-700": "113 99 92", // #71635c
// 		"--color-tertiary-800": "90 79 73", // #5a4f49
// 		"--color-tertiary-900": "74 65 60", // #4a413c
// 		// success | #2ec27e
// 		"--color-success-50": "224 246 236", // #e0f6ec
// 		"--color-success-100": "213 243 229", // #d5f3e5
// 		"--color-success-200": "203 240 223", // #cbf0df
// 		"--color-success-300": "171 231 203", // #abe7cb
// 		"--color-success-400": "109 212 165", // #6dd4a5
// 		"--color-success-500": "46 194 126", // #2ec27e
// 		"--color-success-600": "41 175 113", // #29af71
// 		"--color-success-700": "35 146 95", // #23925f
// 		"--color-success-800": "28 116 76", // #1c744c
// 		"--color-success-900": "23 95 62", // #175f3e
// 		// warning | #f6d32d
// 		"--color-warning-50": "254 248 224", // #fef8e0
// 		"--color-warning-100": "253 246 213", // #fdf6d5
// 		"--color-warning-200": "253 244 203", // #fdf4cb
// 		"--color-warning-300": "251 237 171", // #fbedab
// 		"--color-warning-400": "249 224 108", // #f9e06c
// 		"--color-warning-500": "246 211 45", // #f6d32d
// 		"--color-warning-600": "221 190 41", // #ddbe29
// 		"--color-warning-700": "185 158 34", // #b99e22
// 		"--color-warning-800": "148 127 27", // #947f1b
// 		"--color-warning-900": "121 103 22", // #796716
// 		// error | #ed333b
// 		"--color-error-50": "252 224 226", // #fce0e2
// 		"--color-error-100": "251 214 216", // #fbd6d8
// 		"--color-error-200": "251 204 206", // #fbccce
// 		"--color-error-300": "248 173 177", // #f8adb1
// 		"--color-error-400": "242 112 118", // #f27076
// 		"--color-error-500": "237 51 59", // #ed333b
// 		"--color-error-600": "213 46 53", // #d52e35
// 		"--color-error-700": "178 38 44", // #b2262c
// 		"--color-error-800": "142 31 35", // #8e1f23
// 		"--color-error-900": "116 25 29", // #74191d
// 		// surface | #ae54d5
// 		"--color-surface-50": "243 229 249", // #f3e5f9
// 		"--color-surface-100": "239 221 247", // #efddf7
// 		"--color-surface-200": "235 212 245", // #ebd4f5
// 		"--color-surface-300": "223 187 238", // #dfbbee
// 		"--color-surface-400": "198 135 226", // #c687e2
// 		"--color-surface-500": "174 84 213", // #ae54d5
// 		"--color-surface-600": "157 76 192", // #9d4cc0
// 		"--color-surface-700": "131 63 160", // #833fa0
// 		"--color-surface-800": "104 50 128", // #683280
// 		"--color-surface-900": "85 41 104", // #552968

// 	}
// }
