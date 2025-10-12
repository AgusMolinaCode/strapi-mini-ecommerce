import type { Schema, Struct } from '@strapi/strapi';

export interface PlanFeature extends Struct.ComponentSchema {
  collectionName: 'components_plan_features';
  info: {
    displayName: 'feature';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'plan.feature': PlanFeature;
    }
  }
}
