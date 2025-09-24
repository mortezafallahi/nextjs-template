'use client';

import { useEffect } from 'react';

const BASE_TITLE = 'هلث اپ';

export const useSetTitle = (pageTitle?: string) => {
  useEffect(() => {
    if (!pageTitle) {
      document.title = BASE_TITLE;
    }

    document.title = `${BASE_TITLE} | ${pageTitle}`;

    return () => {
      document.title = BASE_TITLE;
    };
  }, [pageTitle]);
};
