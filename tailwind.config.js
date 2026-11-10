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
          DEFAULT: '#1B1E1B',
          light: '#3B2B1D',
          muted: '#6B5B4E',
        },
        ink: {
          DEFAULT: '#1B1E1B',
          light: '#3B2B1D',
          muted: '#6B5B4E',
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
        // 1. Font đồng nhất cho Header (Tiêu đề lớn, nhỏ, tên di sản): Playfair Display
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // 2. Font đồng nhất cho Chữ bình thường & Chữ nhỏ (Nội dung, nhãn, thẻ, nút bấm): Be Vietnam Pro
        body: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        caption: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        // Bí danh cinzel trỏ trực tiếp về Be Vietnam Pro để loại bỏ vĩnh viễn lỗi vỡ font ở mọi component cũ
        cinzel: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        // 3. Font cho Highlight / Kỹ thuật (Tỷ lệ 1:120, kích thước cm, tọa độ): Roboto Mono
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
        highlight: ['"Playfair Display"', 'Georgia', 'serif'],
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
