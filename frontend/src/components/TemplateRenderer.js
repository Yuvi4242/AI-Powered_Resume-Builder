import React from 'react';
import SoftwareTemplate from './templates/SoftwareTemplate';
import MarketingTemplate from './templates/MarketingTemplate';
import DataTemplate from './templates/DataTemplate';
import BusinessTemplate from './templates/BusinessTemplate';
import DesignerTemplate from './templates/DesignerTemplate';
import SidebarTemplate from './templates/SidebarTemplate';
import FresherTemplate from './templates/FresherTemplate';

const TemplateRenderer = ({ layoutType, data, isEditing, onInlineEdit }) => {
  const props = { data, isEditing, onInlineEdit };
  switch (layoutType) {
    case 'sidebar':
      return <SidebarTemplate {...props} />;
    case 'software':
      return <SoftwareTemplate {...props} />;
    case 'marketing':
      return <MarketingTemplate {...props} />;
    case 'data':
      return <DataTemplate {...props} />;
    case 'business':
      return <BusinessTemplate {...props} />;
    case 'designer':
      return <DesignerTemplate {...props} />;
    case 'fresher':
      return <FresherTemplate {...props} />;
    default:
      return <SoftwareTemplate {...props} />;
  }
};

export default TemplateRenderer;
