import {manrope,arabic,fontAssets} from '../fonts';
import '../fonts.css';
import '../globals.css';
export default function EntryLayout({children}:{children:React.ReactNode}){return <html lang="tr" className={`${manrope.variable} ${arabic.variable}`}><head><link rel="preload" href={fontAssets.latin} as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}</body></html>;}
