import type { Schema, Struct } from '@strapi/strapi';

export interface FooterFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_links';
  info: {
    description: 'Link individual do footer';
    displayName: 'Footer Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    target: Schema.Attribute.Enumeration<['_self', '_blank']> &
      Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterFooterSection extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_sections';
  info: {
    description: 'Se\u00E7\u00E3o de links do footer';
    displayName: 'Footer Section';
  };
  attributes: {
    links: Schema.Attribute.Component<'footer.footer-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: 'Link de rede social';
    displayName: 'Social Link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'twitter',
        'youtube',
        'tiktok',
        'linkedin',
        'whatsapp',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MenuMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_items';
  info: {
    description: 'Item de menu com suporte a subitens';
    displayName: 'Menu Item';
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    children: Schema.Attribute.Component<'menu.menu-item', true>;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    target: Schema.Attribute.Enumeration<
      ['_self', '_blank', '_parent', '_top']
    > &
      Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageContentBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_content_blocks';
  info: {
    description: 'Bloco de conte\u00FAdo modular';
    displayName: 'Content Block';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    css_classes: Schema.Attribute.String;
    html_content: Schema.Attribute.Text;
    media: Schema.Attribute.Media<'images' | 'videos' | 'files', true>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['text', 'image', 'video', 'gallery', 'quote', 'list', 'html']
    > &
      Schema.Attribute.Required;
  };
}

export interface PageHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_page_hero_sections';
  info: {
    description: 'Se\u00E7\u00E3o hero da p\u00E1gina';
    displayName: 'Hero Section';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    cta_text: Schema.Attribute.String;
    cta_url: Schema.Attribute.String;
    overlay_opacity: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0.5>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMetaSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_socials';
  info: {
    description: 'Componente para meta tags de redes sociais';
    displayName: 'Meta Social';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    image: Schema.Attribute.Media<'images'>;
    socialNetwork: Schema.Attribute.Enumeration<['Facebook', 'Twitter']> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Componente para configura\u00E7\u00F5es de SEO';
    displayName: 'SEO';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'index,follow'>;
    metaSocial: Schema.Attribute.Component<'shared.meta-social', true>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'width=device-width, initial-scale=1'>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface WidgetSidebarWidget extends Struct.ComponentSchema {
  collectionName: 'components_widget_sidebar_widgets';
  info: {
    description: 'Widget para sidebar';
    displayName: 'Sidebar Widget';
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    configuration: Schema.Attribute.JSON;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      [
        'latest_posts',
        'popular_posts',
        'categories',
        'tags',
        'custom_html',
        'social_media',
      ]
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.footer-link': FooterFooterLink;
      'footer.footer-section': FooterFooterSection;
      'footer.social-link': FooterSocialLink;
      'menu.menu-item': MenuMenuItem;
      'page.content-block': PageContentBlock;
      'page.hero-section': PageHeroSection;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'widget.sidebar-widget': WidgetSidebarWidget;
    }
  }
}
