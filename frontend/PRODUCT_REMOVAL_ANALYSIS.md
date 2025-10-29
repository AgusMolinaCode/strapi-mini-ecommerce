# Frontend Product/Checkout/Order/Category Removal Analysis

**Date**: 2025-10-28
**Scope**: Frontend only - Backend remains intact
**Objective**: Identify all product, checkout, order, and category usage to be removed from frontend

---

## Executive Summary

This analysis identifies **all frontend files and components** that reference products, checkout flows, orders, and categories. The backend should remain untouched - only frontend usage needs to be removed.

### Impact Summary
- **35 files** contain product/checkout/order/category references
- **7 pages** need removal or modification
- **12 components** need removal or modification
- **2 store files** (Zustand) need removal
- **Multiple API routes** and utility files affected

---

## 🚨 CRITICAL: Pages to Remove/Modify

### 1. **Checkout Pages** (Remove Entirely)
```
❌ src/app/checkout/page.tsx
   - Main checkout page for products
   - Uses cart store, checkout form, order summary
   - Creates orders in Strapi and MercadoPago preferences

❌ src/app/checkout/plan/page.tsx
   - Checkout page for plan subscriptions
   - Uses checkout store for plan subscriptions

❌ src/app/checkout/success/page.tsx
   - Success page after payment
   - Handles payment confirmation

❌ src/app/checkout/error/page.tsx
   - Error page for failed payments
```

### 2. **Product Pages** (Remove Entirely)
```
❌ src/app/producto/[slug]/page.tsx
   - Individual product detail page
   - Shows product gallery, description, add to cart
   - Uses ProductImageGallery, RelatedProducts components
   - Integrates with cart store
```

### 3. **Category Pages** (Remove Entirely)
```
❌ src/app/categorias/[slug]/page.tsx
   - Category listing page
   - Shows products filtered by category
   - Uses CategoryFilter and ProductCard components
```

### 4. **Home Page** (Needs Modification)
```
⚠️ src/app/page.tsx
   - Remove: CategoryFilter component usage (line 33)
   - Remove: PremiumProducts component usage (line 34)
   - Remove: Product and category data fetching (lines 15-20)
   - Remove: Category section (lines 28-33)
   - Keep: HeroSection, PlanHeroSection, CTASection
```

**Recommended Changes for Home Page:**
```typescript
// BEFORE (lines 15-20)
const dataProductos: ProductosResponse = await getStrapiData("/api/productos?populate=*");
const dataCategorias: CategoriasResponse = await getStrapiData("/api/categorias?populate=imagen");

// AFTER - Remove these lines entirely

// BEFORE (lines 28-34)
<div className="max-w-7xl mx-auto px-4 pt-12">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
    Categorias
  </h2>
</div>
<CategoryFilter categorias={dataCategorias.data} activeSlug="todos" />
<PremiumProducts />

// AFTER - Remove these sections entirely
```

---

## 🗑️ Components to Remove

### Product Components
```
❌ src/components/product/ProductCard.tsx
   - Displays individual product card
   - Used in category pages and premium products
   - Integrates with cart store

❌ src/components/product/ProductImageGallery.tsx
   - Product image gallery/carousel
   - Used in product detail page

❌ src/components/product/RelatedProducts.tsx
   - Shows related products carousel
   - Used in product detail page
```

### Category Components
```
❌ src/components/category/CategoryFilter.tsx
   - Category filter/navigation
   - Used in home page and category pages
   - Shows category circles with images
```

### Checkout Components
```
❌ src/components/checkout/CheckoutFormProduct.tsx
   - Checkout form for product purchases
   - Collects buyer data and shipping address
   - Used in /checkout page

❌ src/components/checkout/CheckoutFormPlan.tsx
   - Checkout form for plan subscriptions
   - Collects subscriber data
   - Used in /checkout/plan page

❌ src/components/checkout/OrderSummary.tsx
   - Order summary component
   - Shows cart items or plan details
   - Used in both checkout pages
```

### Cart Components
```
❌ src/components/cart/CartDrawer.tsx
   - Shopping cart drawer/modal
   - Shows cart items and totals
   - Navigates to /checkout page (line 114)

❌ src/components/cart/CartButton.tsx
   - Cart button in navbar
   - Toggles cart drawer

❌ src/components/cart/CartItem.tsx
   - Individual cart item display
   - Used within CartDrawer
```

### Premium Products Component
```
❌ src/components/premiumProducts/PremiumProducts.tsx
   - Shows featured/premium products
   - Used in home page
```

---

## 📦 Store Files to Remove

### Zustand Stores
```
❌ src/store/cartStore.ts
   - Shopping cart state management
   - Functions: addItem, removeItem, updateQuantity, clearCart
   - Persisted to localStorage as 'fitpro-cart'

⚠️ src/store/checkoutStore.ts
   - Checkout process state management
   - PARTIALLY KEEP: Plan-related state (selectedPlan, subscriberData)
   - REMOVE: Product/order-related state (buyerData for shipping)
```

**Recommended Changes for checkoutStore.ts:**
```typescript
// Keep only plan-related functionality
// Remove buyerData fields related to shipping:
// - direccion, numero, piso, ciudad, provincia, codigoPostal, notas
```

---

## 🔗 Navigation References to Remove

### Navbar
```
⚠️ src/components/navbar/NavbarDemo.tsx
   - Remove "Tienda" navigation link (line 28)
   - Remove CartButton component usage (lines 42, 51)
   - Remove CartDrawer component usage (line 78)

// BEFORE (lines 27-29)
{
  name: "Tienda",
  link: "/categorias/todos",
},

// AFTER - Remove this entire object
```

---

## 🛠️ API Routes to Remove

```
❌ src/app/api/mercadopago/route.ts
   - Creates MercadoPago preferences for product orders
   - Handles product checkout flow

⚠️ src/app/api/mercadopago-subscription/route.ts
   - Creates MercadoPago subscriptions
   - KEEP THIS - Used for plan subscriptions
```

---

## 📚 TypeScript Interfaces to Clean

### src/lib/interface.ts
```
⚠️ Keep these interfaces (used for backend compatibility):
   - Imagen, ImageFormat, ImageFormats, StrapiImage
   - HomePage, StrapiResponse
   - Plan, PlanFeature, PlanFeatureFull, PlansResponse
   - Subscription-related interfaces

❌ Remove these interfaces (product/order related):
   - ProductoSimple (lines 46-61)
   - Categoria (lines 63-74)
   - Producto (lines 76-93)
   - ProductosResponse (lines 95-97)
   - CategoriasResponse (lines 99-101)
   - CartItem (lines 160-169)
   - OrderItem (lines 175-182)
   - BuyerData (lines 184-190)
   - ShippingAddress (lines 192-200)
   - CreateOrderData (lines 202-209)
   - OrderInfo (lines 211-215)
   - CreateOrderResponse (lines 217-221)
   - Order (lines 223-244)
   - GetOrderResponse (lines 246-248)
```

---

## 🧹 Utility Files to Clean

### src/lib/utils/mercadopago.ts
```
⚠️ Review this file
   - If it contains product-specific preference creation, remove those functions
   - Keep subscription-related functions
```

### src/lib/validations/checkout.ts
```
❌ Remove product checkout validation schema
   - checkoutProductSchema
   - CheckoutProductFormData type

⚠️ Keep plan checkout validation if exists
```

---

## 📊 Data Actions to Review

### src/data/actions/strapi.ts
```
⚠️ Keep getStrapiData function
   - It's a generic API fetcher
   - Used for plans and other data too
   - No removal needed
```

---

## 🎨 UI Components to Review

```
⚠️ src/components/ui/resizable-navbar.tsx
   - Generic navbar component
   - No specific product references
   - Keep as-is

⚠️ src/components/ui/button.tsx
   - Generic button component
   - Keep as-is
```

---

## 📋 Step-by-Step Removal Checklist

### Phase 1: Remove Pages
- [ ] Delete `/src/app/checkout/` directory (entire folder)
- [ ] Delete `/src/app/producto/` directory (entire folder)
- [ ] Delete `/src/app/categorias/` directory (entire folder)

### Phase 2: Remove Components
- [ ] Delete `/src/components/product/` directory
- [ ] Delete `/src/components/category/` directory
- [ ] Delete `/src/components/checkout/` directory
- [ ] Delete `/src/components/cart/` directory
- [ ] Delete `/src/components/premiumProducts/` directory

### Phase 3: Remove Stores
- [ ] Delete `src/store/cartStore.ts`
- [ ] Clean `src/store/checkoutStore.ts` (remove shipping-related fields)

### Phase 4: Clean API Routes
- [ ] Delete `src/app/api/mercadopago/route.ts`
- [ ] Keep `src/app/api/mercadopago-subscription/route.ts`

### Phase 5: Clean Type Definitions
- [ ] Clean `src/lib/interface.ts` (remove product/order interfaces)
- [ ] Clean `src/lib/validations/checkout.ts` (remove product validations)

### Phase 6: Modify Existing Pages
- [ ] Update `src/app/page.tsx` (remove CategoryFilter, PremiumProducts)
- [ ] Update `src/components/navbar/NavbarDemo.tsx` (remove Tienda link, cart components)

### Phase 7: Clean Utilities
- [ ] Review and clean `src/lib/utils/mercadopago.ts`
- [ ] Remove any product-specific utility functions

### Phase 8: Testing
- [ ] Test home page renders without product sections
- [ ] Test navbar without Tienda link and cart
- [ ] Test plan checkout flow still works
- [ ] Verify no broken imports or references

---

## ⚠️ Important Notes

1. **Backend Intact**: All Strapi content types remain in the backend
2. **Plan Functionality**: Keep all plan/subscription functionality
3. **Shared Components**: Keep generic UI components (buttons, cards, etc.)
4. **MercadoPago**: Keep subscription API, remove product order API
5. **Type Safety**: After removal, run TypeScript check to catch any missed references

---

## 🔍 Files with Product/Checkout/Order/Category References

### Total: 35 Files Affected

#### Pages (7 files)
1. `src/app/checkout/page.tsx` ❌
2. `src/app/checkout/plan/page.tsx` ⚠️ (Keep for plans)
3. `src/app/checkout/success/page.tsx` ⚠️ (May keep for plan success)
4. `src/app/checkout/error/page.tsx` ⚠️ (May keep for plan errors)
5. `src/app/producto/[slug]/page.tsx` ❌
6. `src/app/categorias/[slug]/page.tsx` ❌
7. `src/app/page.tsx` ⚠️ (Modify)

#### Components (12 files)
1. `src/components/product/ProductCard.tsx` ❌
2. `src/components/product/ProductImageGallery.tsx` ❌
3. `src/components/product/RelatedProducts.tsx` ❌
4. `src/components/category/CategoryFilter.tsx` ❌
5. `src/components/checkout/CheckoutFormProduct.tsx` ❌
6. `src/components/checkout/CheckoutFormPlan.tsx` ⚠️ (Keep for plans)
7. `src/components/checkout/OrderSummary.tsx` ⚠️ (Keep for plans)
8. `src/components/cart/CartDrawer.tsx` ❌
9. `src/components/cart/CartButton.tsx` ❌
10. `src/components/cart/CartItem.tsx` ❌
11. `src/components/premiumProducts/PremiumProducts.tsx` ❌
12. `src/components/navbar/NavbarDemo.tsx` ⚠️ (Modify)

#### Other Files (16 files)
1. `src/store/cartStore.ts` ❌
2. `src/store/checkoutStore.ts` ⚠️ (Clean)
3. `src/app/api/mercadopago/route.ts` ❌
4. `src/app/api/mercadopago-subscription/route.ts` ⚠️ (Keep)
5. `src/lib/interface.ts` ⚠️ (Clean)
6. `src/lib/validations/checkout.ts` ⚠️ (Clean)
7. `src/lib/utils/mercadopago.ts` ⚠️ (Review)
8. `src/data/actions/strapi.ts` ✅ (Keep)
9. `src/components/planHeroSection/PlanHeroSection.tsx` ✅ (Keep)
10. `src/components/ctaSection/CTASection.tsx` ✅ (Keep)
11. `src/components/ui/resizable-navbar.tsx` ✅ (Keep)
12. `src/components/footer/footer.tsx` ⚠️ (Check for links)
13. `src/components/ui/button.tsx` ✅ (Keep)
14. `src/app/planes/page.tsx` ✅ (Keep)
15. `src/app/planes/PlanCard.tsx` ✅ (Keep)
16. `src/app/globals.css` ✅ (Keep)

---

## 🎯 Expected Result After Removal

**Frontend will have:**
- ✅ Home page with hero, plan section, and CTA
- ✅ Plans page with plan listing
- ✅ Plan checkout flow (subscriptions)
- ✅ Navigation: Inicio, Planes
- ❌ No product catalog or categories
- ❌ No shopping cart
- ❌ No product checkout
- ❌ No order management

**Backend will remain:**
- ✅ All Strapi content types intact
- ✅ Products, categories, orders collections
- ✅ Plans and subscriptions
- ✅ All data preserved for future use

---

## 📞 Questions or Clarifications Needed

1. Should checkout success/error pages be kept for plan subscriptions?
2. Should any product-related API routes be kept in backend for admin use?
3. Do you want to keep the OrderSummary component for plan checkout display?

---

**End of Analysis Report**
