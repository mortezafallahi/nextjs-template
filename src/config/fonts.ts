import localFont from 'next/font/local';

export const fontPrimary = localFont({
  src: [
    {
      path: '../../public/fonts/Yekan-Bakh-FaNum-03-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Yekan-Bakh-FaNum-04-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Yekan-Bakh-FaNum-05-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Yekan-Bakh-FaNum-06-Bold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Yekan-Bakh-FaNum-07-Heavy.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Yekan-Bakh-FaNum-08-Fat.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-primary',
  display: 'swap',
  preload: true,
});
