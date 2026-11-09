/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          paper: '#E2D3BA',
          'paper-light': '#FFFFFF',
          'paper-card': '#F3EBDD',
          'paper-deep': '#D8C7A5',
          header: '#F9F4E8',
          outer: '#15171C',
          ink: '#3B2B1D',
          brown: '#745C42',
          'brown-dark': '#5F4A38',
          bronze: '#8F6E4A',
          sepia: '#5F4A38',
          line: '#D8CCB8',
          muted: '#796857',
          brass: '#B88A38',
          'brass-light': '#D4AF37',
          cinnabar: '#98281A',
          'cinnabar-dark': '#7A1D12',
          forest: '#142820',
          'forest-dark': '#0D1C16',
        },
        paper: {
          DEFAULT: '#FAF7F0',
          light: '#FFFFFF',
          card: '#F3EBDD',
          deep: '#D8C7A5',
          warm: '#F3EFE6',
          muted: '#E8E1D3',
          border: '#D8CCB8',
          footer: '#E2D3BA',
        },
        forest: {
          DEFAULT: '#142820',
          dark: '#0D1C16',
          deep: '#07110D',
          light: '#1B382D',
          muted: '#24483B',
        },
        brass: {
          DEFAULT: '#B88A38',
          light: '#D4AF37',
          dark: '#8F6E4A',
          subtle: '#E2CFA8',
        },
        charcoal: {
          DEFAULT: '#3B2B1D',
          light: '#554231',
          muted: '#796857',
        },
        ink: {
          DEFAULT: '#3B2B1D',
          light: '#554231',
          muted: '#796857',
        },
        terracotta: {
          DEFAULT: '#98281A',
          dark: '#7A1D12',
          light: '#B94D35',
        },
        header: '#F9F4E8',
        brown: '#735735',
        'brown-dark': '#5B432A',
        cinnabar: '#98281A',
      },
      fontFamily: {
        // Cổ xưa, bia đá, vương triều, con dấu hoàng gia (dành cho tiêu đề lớn, thương hiệu, mã di sản)
        cinzel: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        // Cổ điển, văn bia, tự sự lịch sử (đầy đủ dấu tiếng Việt)
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // Nội dung chuẩn xác, thanh thoát, đọc êm mắt (toàn bộ body, form, buttons, navigation)
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        // Chỉ dùng cho thông số kỹ thuật (tỷ lệ 1:120, kích thước cm, tọa độ)
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        xs: '1px',
        sm: '2px',
        DEFAULT: '2px',
      },
      letterSpacing: {
        editorial: '0.18em',
        widest: '0.25em',
      },
    },
  },
  plugins: [],
}
