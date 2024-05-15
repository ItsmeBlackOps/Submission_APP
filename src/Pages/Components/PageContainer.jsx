import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const PageContainer = ({ title, description, children }) => (
  <HelmetProvider>
    <div>
      <Helmet>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
      </Helmet>
      {children}
    </div>
  </HelmetProvider>
);

export default PageContainer;
