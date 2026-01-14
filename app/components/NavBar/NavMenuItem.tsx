'use client'; // Ավելացրեք այս տողը

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface NavMenuItemProps {
  name: string;
  path: string;
  color?: string;
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({ name, path, color }) => {
  const [lang, setLang] = useState('am');

  useEffect(() => {
    const cookieLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1] || 'am';
    setLang(cookieLang);
  }, []);

  return (
    <li>
      <Link href={`/${lang}${path}`} style={{ color: color }} className='text-[14px] focus:border-b border-[#0E0449] pb-[10px] hover:border-b font_color'>
        {name}
      </Link>
    </li>
  );
};

export default NavMenuItem;