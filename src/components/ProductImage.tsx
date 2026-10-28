import type {ImgHTMLAttributes} from 'react';
import type {Product} from '@/content/products';
import {productImageProfiles} from '@/content/product-image-profiles';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {product:Product};

/** Real pack pixels with native dimensions and browser-selected derivatives. */
export default function ProductImage({product,sizes='(max-width: 1023px) 58vw, 412px',width:_width,height:_height,...props}:Props) {
  const profile = productImageProfiles[product.id];
  return <img {...props} src={product.image} srcSet={profile.srcSet} sizes={sizes}
    width={profile.width} height={profile.height}/>;
}
