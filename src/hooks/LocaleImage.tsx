'use client';
import Image, { ImageProps } from 'next/image';
import React from 'react';

interface LocaleImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

const LocaleImage: React.FC<LocaleImageProps> = ({ src, ...props }) => {
  // أي locale ما يأثرش على public folder
  const fixedSrc = src.startsWith('/') ? src : `/${src}`;
  return <Image src={fixedSrc} {...props} />;
};

export default LocaleImage;
